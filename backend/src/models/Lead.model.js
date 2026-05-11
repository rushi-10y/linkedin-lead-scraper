const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true,
      default: ""
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    website: {
      type: String,
      trim: true,
      default: ""
    },
    keyword: {
      type: String,
      trim: true,
      index: true,
      default: ""
    },
    location: {
      type: String,
      trim: true,
      index: true,
      default: ""
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      index: true
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
    linkedin_url: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    source: {
      type: String,
      enum: [
        "google",
        "website",
        "linkedin",
        "manual",
        "google_linkedin",
        "third-party-api",
        "api",
        "jobs",
        "scraped",
        "mock"
      ],
      default: "manual",
      index: true
    },
    status: {
      type: String,
      enum: ["pending", "scraped", "verified", "failed"],
      default: "scraped"
    },
    emails: [
      {
        type: String,
        lowercase: true
      }
    ],
    phones: [String],
    scrapedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

LeadSchema.index({ email: 1 });
LeadSchema.index({ company: 1, location: 1 });
LeadSchema.index({ source: 1 });
LeadSchema.index({ linkedin_url: 1 });
LeadSchema.index({ keyword: 1, location: 1, createdAt: -1 });
LeadSchema.index({ website: 1, keyword: 1, location: 1 });
LeadSchema.index({ name: 1, keyword: 1, location: 1 });

module.exports = mongoose.model("Lead", LeadSchema);
