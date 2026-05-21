import { BaseTool } from "./BaseTool.js";
import { summarizeLeads } from "../utils/leadSerializer.js";

export class EmailExtractorTool extends BaseTool {
  constructor({ emailService }) {
    super({
      name: "extract_and_generate_emails",
      description:
        "Extract emails from crawled website content and generate likely business email patterns such as info@, contact@, hello@, support@.",
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
    this.emailService = emailService;
  }

  async execute(input, context) {
    const businesses =
      input.useLatestBusinesses === false && input.businesses?.length
        ? input.businesses
        : context.state.businesses || [];

    const enriched = businesses.map((business) => {
      const extracted = this.emailService.extractEmails(
        `${business.websiteTextSample || ""}\n${(business.emails || []).join("\n")}`
      );
      const generated = this.emailService.generateBusinessEmails(business.website);
      const merged = this.emailService.merge({
        extracted: [...(business.emails || []), ...extracted],
        generated: [...(business.generatedEmails || []), ...generated]
      });

      return {
        ...business,
        ...merged,
        sources: [...new Set([...(business.sources || []), "email_extractor"])]
      };
    });

    context.state.businesses = enriched;

    return {
      ok: true,
      summary: summarizeLeads(enriched),
      businesses: enriched
    };
  }
}
