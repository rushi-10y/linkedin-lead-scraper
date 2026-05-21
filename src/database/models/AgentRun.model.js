import mongoose from "mongoose";

const ToolEventSchema = new mongoose.Schema(
  {
    toolName: String,
    input: mongoose.Schema.Types.Mixed,
    outputSummary: mongoose.Schema.Types.Mixed,
    error: String,
    durationMs: Number,
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const DecisionSchema = new mongoose.Schema(
  {
    type: String,
    message: String,
    payload: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const AgentRunSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true, unique: true, index: true },
    input: {
      keyword: String,
      location: String,
      limit: Number
    },
    status: {
      type: String,
      enum: ["queued", "running", "completed", "failed"],
      default: "queued",
      index: true
    },
    memoryMessages: [
      {
        role: String,
        content: String,
        toolCallId: String,
        name: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],
    decisions: [DecisionSchema],
    toolEvents: [ToolEventSchema],
    metrics: {
      googleResults: { type: Number, default: 0 },
      crawledWebsites: { type: Number, default: 0 },
      linkedinMatches: { type: Number, default: 0 },
      savedLeads: { type: Number, default: 0 },
      skippedDuplicates: { type: Number, default: 0 },
      lowQualityLeads: { type: Number, default: 0 }
    },
    outputFile: String,
    error: String,
    startedAt: Date,
    completedAt: Date
  },
  { timestamps: true }
);

export const AgentRun = mongoose.models.AgentRun || mongoose.model("AgentRun", AgentRunSchema);
