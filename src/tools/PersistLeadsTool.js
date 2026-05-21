import { BaseTool } from "./BaseTool.js";
import { LeadQualityService } from "../services/LeadQualityService.js";
import { summarizeLeads } from "../utils/leadSerializer.js";

export class PersistLeadsTool extends BaseTool {
  constructor({ mongoService, leadQualityService = new LeadQualityService() }) {
    super({
      name: "persist_leads",
      description:
        "Score leads, identify low-quality leads, skip/update duplicate companies by fingerprint, and persist the lead records in MongoDB.",
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {
          useLatestBusinesses: { type: "boolean" },
          businesses: {
            type: "array",
            items: { type: "object", additionalProperties: true }
          }
        },
        required: ["useLatestBusinesses"]
      }
    });
    this.mongoService = mongoService;
    this.leadQualityService = leadQualityService;
  }

  async execute(input, context) {
    const businesses =
      input.useLatestBusinesses === false && input.businesses?.length
        ? input.businesses
        : context.state.businesses || [];

    const ranked = this.leadQualityService.rankLeads(
      businesses.map((business) => ({
        ...business,
        jobId: context.jobId,
        keyword: context.input.keyword,
        location: context.input.location
      }))
    );

    const result = await this.mongoService.upsertLeads(ranked);
    context.state.businesses = ranked;
    context.state.persistedLeads = result.saved;
    context.state.persistence = result;

    return {
      ok: result.errors.length === 0,
      savedCount: result.saved.length,
      duplicateCount: result.duplicates.length,
      errorCount: result.errors.length,
      errors: result.errors,
      summary: summarizeLeads(result.saved),
      businesses: result.saved
    };
  }
}
