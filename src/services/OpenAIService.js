import OpenAI from "openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { env, requireEnv } from "../config/env.js";
import { childLogger } from "../utils/logger.js";

const log = childLogger({ service: "OpenAIService" });

export class OpenAIService {
  constructor({ apiKey = env.OPENAI_API_KEY, model = env.OPENAI_MODEL } = {}) {
    this.apiKey = apiKey;
    this.model = model;
    this.client = apiKey ? new OpenAI({ apiKey }) : null;
  }

  ensureClient() {
    requireEnv("OPENAI_API_KEY", this.apiKey);
    if (!this.client) this.client = new OpenAI({ apiKey: this.apiKey });
    return this.client;
  }

  async formatAgentPrompt({ keyword, location, limit }) {
    const template = PromptTemplate.fromTemplate(`
You are an autonomous AI Lead Generation Agent.

Goal:
Find, enrich, score, store, and export business leads for:
- keyword: {keyword}
- location: {location}
- max businesses: {limit}

Reasoning rules:
- Think step by step privately before each tool call.
- Use tools instead of inventing data.
- Start with Google Maps discovery.
- Crawl only websites that are present, non-duplicate, and likely to be useful.
- Search LinkedIn with generated company queries.
- Mark low-quality leads when there is too little contact data, poor ratings, weak fit, or duplicate evidence.
- Persist leads before exporting CSV.
- Return a concise final summary with counts and CSV path.
`);

    return template.format({ keyword, location, limit });
  }

  async createToolCall({ messages, tools, temperature = 0.2 }) {
    const client = this.ensureClient();
    const startedAt = Date.now();

    const response = await client.chat.completions.create({
      model: this.model,
      messages,
      tools,
      tool_choice: "auto",
      temperature
    });

    log.debug({ durationMs: Date.now() - startedAt }, "OpenAI tool-call response received");
    return response.choices[0].message;
  }

  parseToolArguments(toolCall) {
    const raw = toolCall?.function?.arguments || "{}";
    try {
      return JSON.parse(raw);
    } catch (error) {
      log.warn({ tool: toolCall?.function?.name, raw }, "Failed to parse tool arguments");
      return {};
    }
  }
}
