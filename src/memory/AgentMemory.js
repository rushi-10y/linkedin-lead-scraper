/**
 * AgentMemory is the durable scratchpad for a single lead-research run.
 *
 * The OpenAI message list is the short-term working memory used by tool calling.
 * MongoDB stores the same events as long-term memory so a run can be audited:
 * decisions, tool inputs, tool summaries, errors, and final output paths.
 */
export class AgentMemory {
  constructor({ jobId, mongoService }) {
    this.jobId = jobId;
    this.mongoService = mongoService;
    this.messages = [];
  }

  async addMessage(message) {
    const normalized = this.normalizeMessage(message);
    this.messages.push(normalized);
    await this.mongoService.appendMemory(this.jobId, normalized);
    return normalized;
  }

  async addSystem(content) {
    return this.addMessage({ role: "system", content });
  }

  async addUser(content) {
    return this.addMessage({ role: "user", content });
  }

  async addAssistant(message) {
    this.messages.push(message);
    await this.mongoService.appendMemory(this.jobId, {
      role: "assistant",
      content: message.content || this.describeToolCalls(message.tool_calls)
    });
    return message;
  }

  async addToolResult({ toolCallId, name, result }) {
    const content = typeof result === "string" ? result : JSON.stringify(result);
    const message = {
      role: "tool",
      tool_call_id: toolCallId,
      name,
      content: content.slice(0, 20000)
    };
    this.messages.push(message);
    await this.mongoService.appendMemory(this.jobId, {
      role: "tool",
      toolCallId,
      name,
      content: message.content
    });
    return message;
  }

  async addDecision(type, message, payload = undefined) {
    await this.mongoService.appendDecision(this.jobId, { type, message, payload });
  }

  getContextMessages() {
    const systemMessages = this.messages.filter((message) => message.role === "system");
    const recentMessages = this.messages.filter((message) => message.role !== "system").slice(-18);
    return [...systemMessages, ...recentMessages];
  }

  normalizeMessage(message) {
    return {
      role: message.role,
      content: typeof message.content === "string" ? message.content : JSON.stringify(message.content),
      name: message.name,
      toolCallId: message.tool_call_id || message.toolCallId
    };
  }

  describeToolCalls(toolCalls = []) {
    if (!toolCalls?.length) return "";
    return `Tool calls: ${toolCalls.map((call) => call.function?.name).filter(Boolean).join(", ")}`;
  }
}
