import { BaseTool } from "./BaseTool.js";
import { summarizeLeads } from "../utils/leadSerializer.js";

export class GoogleMapsTool extends BaseTool {
  constructor({ googleMapsService }) {
    super({
      name: "google_maps_search",
      description:
        "Search Google Maps for businesses by keyword and location, then clean/structure business name, address, city, industry, rating, reviews, coordinates, website, and phone.",
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {
          keyword: { type: "string" },
          location: { type: "string" },
          limit: { type: "integer", minimum: 1, maximum: 60 }
        },
        required: ["keyword", "location", "limit"]
      }
    });
    this.googleMapsService = googleMapsService;
  }

  async execute(input, context) {
    const businesses = await this.googleMapsService.searchBusinesses(input);
    context.state.businesses = businesses;

    return {
      ok: true,
      summary: summarizeLeads(businesses),
      businesses
    };
  }
}
