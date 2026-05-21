import axios from "axios";
import * as cheerio from "cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { env } from "../config/env.js";
import { EmailService } from "./EmailService.js";
import { createLimiter } from "../utils/rateLimiter.js";
import { withRetry } from "../utils/retry.js";
import { compactText } from "../utils/text.js";
import {
  dedupeUrls,
  detectSocialPlatform,
  normalizeUrl,
  sameDomain,
  toAbsoluteUrl
} from "../utils/url.js";
import { childLogger } from "../utils/logger.js";

const log = childLogger({ service: "WebsiteCrawlerService" });

const CONTACT_HINTS = [
  "contact",
  "about",
  "team",
  "staff",
  "support",
  "locations",
  "appointment",
  "book",
  "connect"
];

export class WebsiteCrawlerService {
  constructor({
    timeout = env.REQUEST_TIMEOUT_MS,
    maxPagesPerSite = env.MAX_PAGES_PER_SITE,
    emailService = new EmailService(),
    limiter = createLimiter({ minTime: 200, maxConcurrent: 4 })
  } = {}) {
    this.http = axios.create({
      timeout,
      maxRedirects: 5,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AILeadGenerationAgent/1.0; +https://example.com/bot)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });
    this.maxPagesPerSite = maxPagesPerSite;
    this.emailService = emailService;
    this.limiter = limiter;
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 120
    });
  }

  async crawlBusinesses({ businesses = [], maxWebsites = env.MAX_WEBSITES_TO_CRAWL, maxPagesPerSite = this.maxPagesPerSite }) {
    const eligible = businesses
      .filter((business) => business.website && normalizeUrl(business.website))
      .slice(0, maxWebsites);

    const results = [];
    for (const business of eligible) {
      results.push(await this.crawlBusinessWebsite(business, { maxPagesPerSite }));
    }

    return {
      crawledCount: results.length,
      skippedCount: businesses.length - eligible.length,
      businesses: results
    };
  }

  async crawlBusinessWebsite(business, { maxPagesPerSite = this.maxPagesPerSite } = {}) {
    const rootUrl = normalizeUrl(business.website);
    if (!rootUrl) return { ...business, crawlStatus: "skipped_no_website" };

    try {
      const homepage = await this.fetchPage(rootUrl);
      const discovered = this.discoverRelevantLinks(rootUrl, homepage.html);
      const selectedUrls = dedupeUrls([rootUrl, ...discovered.contactPages]).slice(0, maxPagesPerSite);

      const pages = [homepage];
      for (const url of selectedUrls.filter((url) => url !== rootUrl)) {
        pages.push(await this.fetchPage(url));
      }

      const allText = pages.map((page) => page.text).join("\n");
      const docs = await this.textSplitter.createDocuments([allText]);
      const compactedText = docs.map((doc) => doc.pageContent).join("\n").slice(0, 12000);
      const extractedEmails = this.emailService.extractEmails(
        `${allText}\n${pages.map((page) => page.html).join("\n")}`
      );
      const generatedEmails = this.emailService.generateBusinessEmails(rootUrl);
      const socialLinks = this.extractSocialLinks(rootUrl, pages.map((page) => page.html).join("\n"));

      return {
        ...business,
        emails: [...new Set([...(business.emails || []), ...extractedEmails])],
        generatedEmails,
        contactPages: dedupeUrls([...discovered.contactPages, ...selectedUrls.filter((url) => url !== rootUrl)]),
        socialLinks,
        websiteTextSample: compactedText,
        crawlStatus: "crawled",
        sources: [...new Set([...(business.sources || []), "website"])]
      };
    } catch (error) {
      log.warn({ website: rootUrl, businessName: business.businessName, message: error.message }, "Website crawl failed");
      return {
        ...business,
        generatedEmails: this.emailService.generateBusinessEmails(rootUrl),
        crawlStatus: "failed",
        crawlError: error.message,
        sources: [...new Set([...(business.sources || []), "website_failed"])]
      };
    }
  }

  async fetchPage(url) {
    const normalized = normalizeUrl(url);
    const response = await this.limiter.schedule(() =>
      withRetry(
        () => this.http.get(normalized, { responseType: "text" }),
        { label: "website-fetch" }
      )
    );

    const html = String(response.data || "");
    const $ = cheerio.load(html);
    $("script, style, noscript, svg").remove();

    return {
      url: normalized,
      status: response.status,
      html,
      text: compactText($("body").text())
    };
  }

  discoverRelevantLinks(rootUrl, html = "") {
    const $ = cheerio.load(html);
    const contactPages = [];

    $("a[href]").each((_, element) => {
      const href = $(element).attr("href") || "";
      const label = `${$(element).text()} ${href}`.toLowerCase();
      const absolute = toAbsoluteUrl(rootUrl, href);

      if (!absolute || !sameDomain(rootUrl, absolute)) return;
      if (CONTACT_HINTS.some((hint) => label.includes(hint))) {
        contactPages.push(absolute);
      }
    });

    return { contactPages: dedupeUrls(contactPages) };
  }

  extractSocialLinks(rootUrl, html = "") {
    const $ = cheerio.load(html);
    const links = [];

    $("a[href]").each((_, element) => {
      const url = toAbsoluteUrl(rootUrl, $(element).attr("href"));
      const platform = detectSocialPlatform(url);
      if (platform) links.push({ platform, url });
    });

    const seen = new Set();
    return links.filter((link) => {
      const key = `${link.platform}:${link.url}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}
