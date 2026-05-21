import crypto from "node:crypto";
import { env } from "../config/env.js";
import { AgentMemory } from "../memory/AgentMemory.js";
import { OpenAIService } from "../services/OpenAIService.js";
import { createToolRegistry, toolDefinitions } from "../tools/index.js";
import { summarizeLeads } from "../utils/leadSerializer.js";
import { childLogger } from "../utils/logger.js";

const log = childLogger({ agent: "LeadResearchAgent" });

/**
 * LeadResearchAgent is an autonomous tool-calling agent, not a workflow runner.
 *
 * The LLM owns the planning loop: it sees the goal, reasons privately, then asks
 * for tools. The code owns safety rails: retries/rate limits live inside tools,
 * memory is persisted, duplicate handling is enforced by MongoDB fingerprints,
 * and a minimum completion path makes sure leads are stored/exported.
 */
export class LeadResearchAgent {
  constructor({
    mongoService,
    openAIService = new OpenAIService(),
    toolRegistry = createToolRegistry({ mongoService })
  }) {
    this.mongoService = mongoService;
    this.openAIService = openAIService;
    this.toolRegistry = toolRegistry;
    this.toolDefinitions = toolDefinitions(toolRegistry);
  }

  async run({ keyword, location, limit = env.DEFAULT_SEARCH_LIMIT }) {
    const jobId = crypto.randomUUID();
    const input = { keyword, location, limit };
    const context = {
      jobId,
      input,
      state: {
        businesses: [],
        persistedLeads: [],
        csv: null
      }
    };

    await this.mongoService.createRun({ jobId, input });
    await this.mongoService.updateRun(jobId, { status: "running", startedAt: new Date() });

    const memory = new AgentMemory({ jobId, mongoService: this.mongoService });

    try {
      const systemPrompt = await this.openAIService.formatAgentPrompt(input);
      await memory.addSystem(systemPrompt);
      await memory.addUser(
        JSON.stringify({
          task: "Generate production-quality leads using autonomous tools. Persist to MongoDB and export CSV.",
          input
        })
      );

      const executedTools = new Set();
      let finalMessage = "";

      for (let iteration = 1; iteration <= env.MAX_AGENT_ITERATIONS; iteration += 1) {
        await memory.addDecision("iteration", `Starting autonomous reasoning iteration ${iteration}`, {
          executedTools: [...executedTools]
        });

        const assistantMessage = await this.openAIService.createToolCall({
          messages: memory.getContextMessages(),
          tools: this.toolDefinitions
        });

        await memory.addAssistant(assistantMessage);

        if (!assistantMessage.tool_calls?.length) {
          finalMessage = assistantMessage.content || "";
          break;
        }

        for (const toolCall of assistantMessage.tool_calls) {
          const name = toolCall.function?.name;
          const args = this.openAIService.parseToolArguments(toolCall);
          const result = await this.executeTool({ name, args, context, memory });
          executedTools.add(name);

          await memory.addToolResult({
            toolCallId: toolCall.id,
            name,
            result: this.toToolMemoryResult(result)
          });
        }

        if (context.state.csv?.path) {
          finalMessage = "Leads have been researched, persisted, and exported.";
          break;
        }
      }

      await this.ensureMinimumCompletion({ context, memory, executedTools });

      const metrics = this.buildMetrics(context);
      const summary = {
        jobId,
        status: "completed",
        message: finalMessage || "Lead research completed.",
        input,
        metrics,
        csv: context.state.csv,
        leads: summarizeLeads(context.state.persistedLeads || context.state.businesses, 20)
      };

      await this.mongoService.updateRun(jobId, {
        status: "completed",
        metrics,
        outputFile: context.state.csv?.path,
        completedAt: new Date()
      });

      log.info({ jobId, metrics, csv: context.state.csv?.path }, "Lead research run completed");
      return summary;
    } catch (error) {
      await this.mongoService.updateRun(jobId, {
        status: "failed",
        error: error.message,
        completedAt: new Date()
      });
      log.error({ jobId, message: error.message, stack: error.stack }, "Lead research run failed");
      throw error;
    }
  }

  async executeTool({ name, args, context, memory }) {
    const tool = this.toolRegistry.get(name);
    if (!tool) {
      throw new Error(`Unknown tool requested by model: ${name}`);
    }

    const startedAt = Date.now();
    await memory.addDecision("tool_call", `Executing ${name}`, args);

    try {
      const result = await tool.execute(args, context);
      const durationMs = Date.now() - startedAt;
      await this.mongoService.appendToolEvent(context.jobId, {
        toolName: name,
        input: args,
        outputSummary: this.toToolMemoryResult(result),
        durationMs
      });
      await this.mongoService.updateRun(context.jobId, { metrics: this.buildMetrics(context) });
      log.info({ jobId: context.jobId, tool: name, durationMs }, "Tool executed");
      return result;
    } catch (error) {
      const durationMs = Date.now() - startedAt;
      await this.mongoService.appendToolEvent(context.jobId, {
        toolName: name,
        input: args,
        error: error.message,
        durationMs
      });
      throw error;
    }
  }

  async ensureMinimumCompletion({ context, memory, executedTools }) {
    const runTool = async (name, args, { force = false } = {}) => {
      if (force || !executedTools.has(name)) {
        const result = await this.executeTool({ name, args, context, memory });
        executedTools.add(name);
        return result;
      }
      return null;
    };

    if (!context.state.businesses?.length) {
      await runTool("google_maps_search", {
        keyword: context.input.keyword,
        location: context.input.location,
        limit: context.input.limit
      });
    }

    await runTool("crawl_websites", {
      useLatestBusinesses: true,
      maxWebsites: env.MAX_WEBSITES_TO_CRAWL,
      maxPagesPerSite: env.MAX_PAGES_PER_SITE
    });

    await runTool("extract_and_generate_emails", { useLatestBusinesses: true });
    await runTool("search_linkedin_companies", { useLatestBusinesses: true });
    await runTool("persist_leads", { useLatestBusinesses: true }, { force: true });

    await runTool("export_leads_csv", { usePersistedLeads: true }, { force: true });
  }

  toToolMemoryResult(result = {}) {
    const sanitized = {
      ...result,
      businesses: undefined
    };

    if (result.businesses) {
      sanitized.summary = result.summary || summarizeLeads(result.businesses);
    }

    return sanitized;
  }

  buildMetrics(context) {
    const businesses = context.state.businesses || [];
    const persisted = context.state.persistedLeads || [];
    const persistence = context.state.persistence || {};

    return {
      googleResults: businesses.length,
      crawledWebsites: businesses.filter((lead) => lead.crawlStatus === "crawled").length,
      linkedinMatches: businesses.filter((lead) => lead.linkedin?.url).length,
      savedLeads: persisted.length,
      skippedDuplicates: persistence.duplicates?.length || 0,
      lowQualityLeads: businesses.filter((lead) => lead.quality?.isLowQuality).length
    };
  }
}
