import axios from "axios";
import { env, requireEnv } from "../config/env.js";
import { createLimiter } from "../utils/rateLimiter.js";
import { withRetry } from "../utils/retry.js";
import { titleCase } from "../utils/text.js";
import { childLogger } from "../utils/logger.js";

const log = childLogger({ service: "GoogleMapsService" });

const TYPE_INDUSTRY_MAP = {
  accounting: "Accounting",
  bakery: "Food & Beverage",
  bar: "Hospitality",
  beauty_salon: "Beauty & Wellness",
  car_dealer: "Automotive",
  car_repair: "Automotive",
  dentist: "Healthcare",
  doctor: "Healthcare",
  electrician: "Home Services",
  finance: "Financial Services",
  florist: "Retail",
  food: "Food & Beverage",
  general_contractor: "Construction",
  gym: "Fitness",
  hair_care: "Beauty & Wellness",
  health: "Healthcare",
  home_goods_store: "Retail",
  insurance_agency: "Insurance",
  lawyer: "Legal Services",
  lodging: "Hospitality",
  moving_company: "Logistics",
  plumber: "Home Services",
  real_estate_agency: "Real Estate",
  restaurant: "Food & Beverage",
  roofing_contractor: "Construction",
  spa: "Beauty & Wellness",
  store: "Retail",
  veterinary_care: "Healthcare"
};

export class GoogleMapsService {
  constructor({
    apiKey = env.GOOGLE_MAPS_API_KEY,
    timeout = env.REQUEST_TIMEOUT_MS,
    limiter = createLimiter({ minTime: 150, maxConcurrent: 3 })
  } = {}) {
    this.apiKey = apiKey;
    this.http = axios.create({
      baseURL: "https://maps.googleapis.com/maps/api/place",
      timeout
    });
    this.limiter = limiter;
  }

  async searchBusinesses({ keyword, location, limit = env.DEFAULT_SEARCH_LIMIT }) {
    requireEnv("GOOGLE_MAPS_API_KEY", this.apiKey);

    const results = [];
    let nextPageToken;
    let page = 0;

    do {
      page += 1;
      const params = nextPageToken
        ? { pagetoken: nextPageToken, key: this.apiKey }
        : { query: `${keyword} in ${location}`, key: this.apiKey };

      if (nextPageToken) {
        await new Promise((resolve) => setTimeout(resolve, 2200));
      }

      const response = await this.limiter.schedule(() =>
        withRetry(
          () => this.http.get("/textsearch/json", { params }),
          { label: "google-maps-text-search" }
        )
      );

      if (!["OK", "ZERO_RESULTS"].includes(response.data.status)) {
        throw new Error(`Google Maps search failed: ${response.data.status} ${response.data.error_message || ""}`.trim());
      }

      results.push(...(response.data.results || []));
      nextPageToken = response.data.next_page_token;
    } while (nextPageToken && results.length < limit && page < env.GOOGLE_MAPS_PAGE_LIMIT);

    const selected = results.slice(0, limit);
    const detailed = [];

    for (const place of selected) {
      const details = await this.getPlaceDetails(place.place_id);
      detailed.push(this.cleanBusinessData({ ...place, ...details }, { keyword, location }));
    }

    log.info({ keyword, location, count: detailed.length }, "Google Maps businesses discovered");
    return detailed;
  }

  async getPlaceDetails(placeId) {
    if (!placeId) return {};

    const fields = [
      "name",
      "formatted_address",
      "address_components",
      "formatted_phone_number",
      "international_phone_number",
      "website",
      "rating",
      "user_ratings_total",
      "geometry",
      "types",
      "business_status",
      "url"
    ].join(",");

    const response = await this.limiter.schedule(() =>
      withRetry(
        () =>
          this.http.get("/details/json", {
            params: {
              place_id: placeId,
              fields,
              key: this.apiKey
            }
          }),
        { label: "google-maps-place-details" }
      )
    );

    if (!["OK", "ZERO_RESULTS"].includes(response.data.status)) {
      log.warn({ placeId, status: response.data.status }, "Google Maps details returned non-OK status");
      return {};
    }

    return response.data.result || {};
  }

  cleanBusinessData(place, { keyword, location }) {
    const city = this.extractCity(place.address_components) || this.cityFromAddress(place.formatted_address);
    const industry = this.classifyIndustry(place.types, keyword);

    return {
      keyword,
      location,
      businessName: place.name || "",
      address: place.formatted_address || place.vicinity || "",
      city,
      industry,
      rating: place.rating || null,
      totalReviews: place.user_ratings_total || 0,
      latitude: place.geometry?.location?.lat || null,
      longitude: place.geometry?.location?.lng || null,
      website: place.website || "",
      phone: place.international_phone_number || place.formatted_phone_number || "",
      emails: [],
      generatedEmails: [],
      contactPages: [],
      socialLinks: [],
      sources: ["google_maps"],
      raw: {
        googlePlaceId: place.place_id,
        googleMapsUrl: place.url,
        types: place.types,
        businessStatus: place.business_status
      }
    };
  }

  extractCity(components = []) {
    const component = components.find((item) =>
      item.types?.some((type) => ["locality", "postal_town", "administrative_area_level_2"].includes(type))
    );
    return component?.long_name || "";
  }

  cityFromAddress(address = "") {
    const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
    return parts.length >= 3 ? parts[parts.length - 2] : parts[0] || "";
  }

  classifyIndustry(types = [], keyword = "") {
    const mapped = types.map((type) => TYPE_INDUSTRY_MAP[type]).find(Boolean);
    if (mapped) return mapped;
    return titleCase(keyword || types[0] || "Business");
  }
}
