const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      index: true
    },

    phone: {
      type: String,
      trim: true
    },

    company: {
      type: String,
      trim: true,
      index: true
    },

    designation: {
      type: String,
      trim: true
    },

    industry: {
      type: String,
      trim: true,
      index: true
    },

    location: {
      type: String,
      trim: true,
      index: true
    },

    website: {
      type: String,
      trim: true
    },

    linkedin: {
      type: String,
      trim: true
    },

    source: {
      type: String,
      enum: ["google", "website", "linkedin", "manual"],
      default: "manual",
      index: true
    },

    scrapedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true // adds createdAt & updatedAt
  }
);

// Prevent duplicate emails
LeadSchema.index({ email: 1 }, { unique: false });

module.exports = mongoose.model("Lead", LeadSchema);
