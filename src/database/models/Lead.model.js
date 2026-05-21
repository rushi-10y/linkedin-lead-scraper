import mongoose from "mongoose";

const SocialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, trim: true },
    url: { type: String, trim: true }
  },
  { _id: false }
);

const LinkedInSchema = new mongoose.Schema(
  {
    query: String,
    url: String,
    description: String,
    employeeCount: String,
    industry: String,
    confidence: { type: Number, default: 0 },
    source: String
  },
  { _id: false }
);

const QualitySchema = new mongoose.Schema(
  {
    tier: { type: String, enum: ["high", "medium", "low"], default: "medium" },
    score: { type: Number, default: 0 },
    isLowQuality: { type: Boolean, default: false },
    reasons: [{ type: String }]
  },
  { _id: false }
);

const LeadSchema = new mongoose.Schema(
  {
    jobId: { type: String, index: true },
    keyword: { type: String, trim: true, index: true },
    location: { type: String, trim: true, index: true },
    businessName: { type: String, trim: true, required: true },
    normalizedName: { type: String, trim: true, index: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true, index: true },
    industry: { type: String, trim: true },
    rating: Number,
    totalReviews: Number,
    latitude: Number,
    longitude: Number,
    website: { type: String, trim: true },
    phone: { type: String, trim: true },
    emails: [{ type: String, lowercase: true, trim: true }],
    generatedEmails: [{ type: String, lowercase: true, trim: true }],
    contactPages: [{ type: String, trim: true }],
    socialLinks: [SocialLinkSchema],
    linkedin: LinkedInSchema,
    quality: QualitySchema,
    sources: [{ type: String }],
    raw: { type: mongoose.Schema.Types.Mixed },
    fingerprint: { type: String, required: true, unique: true, index: true }
  },
  { timestamps: true }
);

LeadSchema.index({ keyword: 1, location: 1, createdAt: -1 });
LeadSchema.index({ "quality.score": -1 });

export const Lead = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
