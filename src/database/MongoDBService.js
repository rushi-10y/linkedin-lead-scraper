import mongoose from "mongoose";
import { env } from "../config/env.js";
import { Lead } from "./models/Lead.model.js";
import { AgentRun } from "./models/AgentRun.model.js";
import { sha256 } from "../utils/hash.js";
import { normalizeBusinessName, normalizePhone } from "../utils/text.js";
import { getDomainRoot } from "../utils/url.js";
import { childLogger } from "../utils/logger.js";

const log = childLogger({ service: "MongoDBService" });

export class MongoDBService {
  constructor({ uri = env.MONGODB_URI } = {}) {
    this.uri = uri;
  }

  async connect() {
    if (mongoose.connection.readyState === 1) return mongoose.connection;

    mongoose.set("strictQuery", true);
    await mongoose.connect(this.uri, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: true
    });
    log.info({ database: mongoose.connection.name }, "MongoDB connected");
    return mongoose.connection;
  }

  async disconnect() {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      log.info("MongoDB disconnected");
    }
  }

  createLeadFingerprint(lead) {
    const normalizedName = normalizeBusinessName(lead.businessName || lead.name);
    const city = (lead.city || "").toLowerCase().trim();
    const domain = getDomainRoot(lead.website);
    const phone = normalizePhone(lead.phone);
    return sha256([normalizedName, city, domain || phone || lead.address || ""].join("|"));
  }

  prepareLead(lead) {
    const businessName = lead.businessName || lead.name;
    const normalizedName = normalizeBusinessName(businessName);
    return {
      ...lead,
      businessName,
      normalizedName,
      emails: [...new Set(lead.emails || [])],
      generatedEmails: [...new Set(lead.generatedEmails || [])],
      contactPages: [...new Set(lead.contactPages || [])],
      sources: [...new Set(lead.sources || [])],
      fingerprint: lead.fingerprint || this.createLeadFingerprint({ ...lead, businessName })
    };
  }

  async upsertLeads(leads = []) {
    const results = {
      saved: [],
      duplicates: [],
      errors: []
    };

    for (const lead of leads) {
      try {
        const prepared = this.prepareLead(lead);
        const existing = await Lead.findOne({ fingerprint: prepared.fingerprint }).lean();
        const saved = await Lead.findOneAndUpdate(
          { fingerprint: prepared.fingerprint },
          { $set: prepared },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        ).lean();

        if (existing) results.duplicates.push(saved);
        results.saved.push(saved);
      } catch (error) {
        results.errors.push({ businessName: lead.businessName || lead.name, message: error.message });
      }
    }

    return results;
  }

  async listLeads(filter = {}, { limit = 100, sort = { createdAt: -1 } } = {}) {
    return Lead.find(filter).sort(sort).limit(limit).lean();
  }

  async createRun({ jobId, input }) {
    return AgentRun.create({
      jobId,
      input,
      status: "queued",
      memoryMessages: [],
      decisions: [],
      toolEvents: []
    });
  }

  async updateRun(jobId, update) {
    return AgentRun.findOneAndUpdate({ jobId }, update, { new: true }).lean();
  }

  async appendMemory(jobId, message) {
    const content =
      typeof message.content === "string"
        ? message.content
        : JSON.stringify(message.content ?? "");

    return AgentRun.updateOne(
      { jobId },
      {
        $push: {
          memoryMessages: {
            ...message,
            content: content.slice(0, 12000)
          }
        }
      }
    );
  }

  async appendDecision(jobId, decision) {
    return AgentRun.updateOne({ jobId }, { $push: { decisions: decision } });
  }

  async appendToolEvent(jobId, event) {
    return AgentRun.updateOne({ jobId }, { $push: { toolEvents: event } });
  }

  async getRun(jobId) {
    return AgentRun.findOne({ jobId }).lean();
  }
}
