import path from "node:path";
import { z } from "zod";
import { LeadResearchAgent } from "../agents/LeadResearchAgent.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/errors.js";

const leadResearchSchema = z.object({
  keyword: z.string().min(2, "keyword must contain at least 2 characters"),
  location: z.string().min(2, "location must contain at least 2 characters"),
  limit: z.number().int().min(1).max(60).optional()
});

export class LeadAgentController {
  constructor({ mongoService }) {
    this.mongoService = mongoService;
    this.agent = new LeadResearchAgent({ mongoService });
  }

  research = asyncHandler(async (req, res) => {
    const parsed = leadResearchSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError("Invalid lead research request", 400, "VALIDATION_ERROR", parsed.error.flatten());
    }

    const result = await this.agent.run({
      ...parsed.data,
      limit: parsed.data.limit || env.DEFAULT_SEARCH_LIMIT
    });

    res.status(201).json(result);
  });

  listLeads = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.jobId) filter.jobId = String(req.query.jobId);
    if (req.query.keyword) filter.keyword = String(req.query.keyword);
    if (req.query.location) filter.location = String(req.query.location);

    const limit = Math.min(Number(req.query.limit || 100), 500);
    const leads = await this.mongoService.listLeads(filter, { limit });
    res.json({ count: leads.length, leads });
  });

  getRun = asyncHandler(async (req, res) => {
    const run = await this.mongoService.getRun(req.params.jobId);
    if (!run) throw new AppError("Agent run not found", 404, "RUN_NOT_FOUND");
    res.json(run);
  });

  downloadExport = asyncHandler(async (req, res) => {
    const safeName = path.basename(req.params.filename);
    const filePath = path.resolve(env.EXPORT_DIR, safeName);
    res.download(filePath, safeName);
  });
}
