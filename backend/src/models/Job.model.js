const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["scrape"],
      default: "scrape"
    },

    source: {
      type: String,
      enum: ["google", "website", "linkedin", "google_keywords", "config", "api", "jobs"],
      required: true,
      index: true
    },

    query: {
      type: String
    },

    url: {
      type: String
    },

    status: {
      type: String,
      enum: ["pending", "running", "completed", "failed"],
      default: "pending",
      index: true
    },

    totalLeadsFound: {
      type: Number,
      default: 0
    },

    totalLeadsSaved: {
      type: Number,
      default: 0
    },

    errorMessage: {
      type: String
    },

    startedAt: {
      type: Date
    },

    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Job", JobSchema);
