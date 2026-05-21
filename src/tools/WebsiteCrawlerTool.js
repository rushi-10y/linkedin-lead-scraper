import { BaseTool } from "./BaseTool.js";
import { env } from "../config/env.js";
import { LeadQualityService } from "../services/LeadQualityService.js";
import { summarizeLeads } from "../utils/leadSerializer.js";

export class WebsiteCrawlerTool extends BaseTool {
  constructor({ websiteCrawlerService, leadQualityService = new LeadQualityService() }) {
    super({
      name: "crawl_websites",
      description:
        "Visit business websites, choose useful crawl candidates, extract contact pages, emails, social links, and compact website text for enrichment.",
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {
          useLatestBusinesses: {
            type: "boolean",
            description: "Use the current businesses already discovered by Google Maps."
          },
          maxWebsites: { type: "integer", minimum: 1, maximum: 50 },
          maxPagesPerSite: { type: "integer", minimum: 1, maximum: 12 },
          businesses: {
            type: "array",
            description: "Optional explicit business list. Usually leave empty and set useLatestBusinesses true.",
            items: { type: "object", additionalProperties: true }
          }
        },
        required: ["useLatestBusinesses", "maxWebsites", "maxPagesPerSite"]
      }
    });
    this.websiteCrawlerService = websiteCrawlerService;
    this.leadQualityService = leadQualityService;
  }

  async execute(input, context) {
    const sourceBusinesses =
      input.useLatestBusinesses === false && input.businesses?.length
        ? input.businesses
        : context.state.businesses || [];

    const selected = this.leadQualityService.chooseCrawlCandidates(
      sourceBusinesses,
      input.maxWebsites || env.MAX_WEBSITES_TO_CRAWL
    );

    const result = await this.websiteCrawlerService.crawlBusinesses({
      businesses: selected,
      maxWebsites: input.maxWebsites || env.MAX_WEBSITES_TO_CRAWL,
      maxPagesPerSite: input.maxPagesPerSite || env.MAX_PAGES_PER_SITE
    });

    context.state.businesses = this.mergeBusinesses(sourceBusinesses, result.businesses);

    return {
      ok: true,
      crawlDecisions: {
        selectedCount: selected.length,
        skippedNoWebsite: sourceBusinesses.filter((business) => !business.website).length,
        selected: selected.map((business) => ({
          businessName: business.businessName,
          website: business.website,
          rating: business.rating,
          totalReviews: business.totalReviews
        }))
      },
      summary: summarizeLeads(context.state.businesses),
      businesses: context.state.businesses
    };
  }

  mergeBusinesses(original = [], enriched = []) {
    const byName = new Map(original.map((business) => [business.businessName, business]));
    for (const business of enriched) {
      byName.set(business.businessName, { ...byName.get(business.businessName), ...business });
    }
    return [...byName.values()];
  }
}
