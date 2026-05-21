import { BaseTool } from "./BaseTool.js";
import { summarizeLeads } from "../utils/leadSerializer.js";

export class LinkedInTool extends BaseTool {
  constructor({ linkedInService }) {
    super({
      name: "search_linkedin_companies",
      description:
        "Generate LinkedIn company search queries, search via Serper API, then use Puppeteer to scrape public company description, employee count, industry, and LinkedIn URL.",
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
    this.linkedInService = linkedInService;
  }

  async execute(input, context) {
    const businesses =
      input.useLatestBusinesses === false && input.businesses?.length
        ? input.businesses
        : context.state.businesses || [];

    const result = await this.linkedInService.enrichBusinesses({ businesses });
    context.state.businesses = result.businesses;

    return {
      ok: true,
      linkedinMatches: result.linkedinMatches,
      summary: summarizeLeads(result.businesses),
      businesses: result.businesses
    };
  }
}
