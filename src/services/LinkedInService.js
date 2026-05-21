import axios from "axios";
import puppeteer from "puppeteer";
import { env, requireEnv } from "../config/env.js";
import { createLimiter } from "../utils/rateLimiter.js";
import { withRetry } from "../utils/retry.js";
import { compactText } from "../utils/text.js";
import { childLogger } from "../utils/logger.js";

const log = childLogger({ service: "LinkedInService" });

export class LinkedInService {
  constructor({
    serperApiKey = env.SERPER_API_KEY,
    timeout = env.REQUEST_TIMEOUT_MS,
    limiter = createLimiter({ minTime: 700, maxConcurrent: 1 })
  } = {}) {
    this.serperApiKey = serperApiKey;
    this.http = axios.create({
      baseURL: "https://google.serper.dev",
      timeout,
      headers: {
        "Content-Type": "application/json"
      }
    });
    this.limiter = limiter;
  }

  generateCompanyQuery(business) {
    const city = business.city ? `"${business.city}"` : "";
    return `"${business.businessName}" ${city} site:linkedin.com/company`;
  }

  async enrichBusinesses({ businesses = [] }) {
    requireEnv("SERPER_API_KEY", this.serperApiKey);

    const enriched = [];
    for (const business of businesses) {
      enriched.push(await this.enrichBusiness(business));
    }

    return {
      linkedinMatches: enriched.filter((lead) => lead.linkedin?.url).length,
      businesses: enriched
    };
  }

  async enrichBusiness(business) {
    const query = this.generateCompanyQuery(business);
    try {
      const candidates = await this.searchCompanyPages(query);
      const best = this.chooseBestCandidate(candidates, business);

      if (!best?.link) {
        return {
          ...business,
          linkedin: {
            query,
            confidence: 0,
            source: "serper"
          }
        };
      }

      const scraped = await this.scrapeCompanyPage(best.link);
      return {
        ...business,
        industry: scraped.industry || business.industry,
        linkedin: {
          query,
          url: best.link,
          description: scraped.description || best.snippet || "",
          employeeCount: scraped.employeeCount || "",
          industry: scraped.industry || "",
          confidence: best.confidence,
          source: "serper_puppeteer"
        },
        sources: [...new Set([...(business.sources || []), "linkedin"])]
      };
    } catch (error) {
      log.warn({ businessName: business.businessName, message: error.message }, "LinkedIn enrichment failed");
      return {
        ...business,
        linkedin: {
          query,
          confidence: 0,
          source: "serper_failed"
        }
      };
    }
  }

  async searchCompanyPages(query) {
    const response = await this.limiter.schedule(() =>
      withRetry(
        () =>
          this.http.post(
            "/search",
            { q: query, num: 5 },
            { headers: { "X-API-KEY": this.serperApiKey } }
          ),
        { label: "serper-linkedin-search" }
      )
    );

    return (response.data.organic || [])
      .filter((item) => item.link?.includes("linkedin.com/company"))
      .map((item) => ({
        title: item.title || "",
        link: this.cleanLinkedInUrl(item.link),
        snippet: item.snippet || ""
      }));
  }

  chooseBestCandidate(candidates, business) {
    const target = (business.businessName || "").toLowerCase();
    const city = (business.city || "").toLowerCase();

    return candidates
      .map((candidate) => {
        const haystack = `${candidate.title} ${candidate.snippet} ${candidate.link}`.toLowerCase();
        let confidence = 0.35;
        if (target && haystack.includes(target)) confidence += 0.4;
        if (city && haystack.includes(city)) confidence += 0.1;
        if (candidate.link.includes("/company/")) confidence += 0.1;
        return { ...candidate, confidence: Math.min(confidence, 0.95) };
      })
      .sort((a, b) => b.confidence - a.confidence)[0];
  }

  async scrapeCompanyPage(url) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: env.PUPPETEER_HEADLESS,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
      });
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
      );
      await page.setViewport({ width: 1366, height: 900 });
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: env.PUPPETEER_NAVIGATION_TIMEOUT_MS
      });
      await page.waitForTimeout?.(1500);

      const data = await page.evaluate(() => {
        const getMeta = (selector) => document.querySelector(selector)?.getAttribute("content") || "";
        const text = document.body?.innerText || "";
        return {
          title: document.title || "",
          description:
            getMeta('meta[property="og:description"]') ||
            getMeta('meta[name="description"]') ||
            "",
          text
        };
      });

      const text = compactText(`${data.title} ${data.description} ${data.text}`).slice(0, 15000);
      return {
        description: compactText(data.description || this.extractDescription(text)),
        employeeCount: this.extractEmployeeCount(text),
        industry: this.extractIndustry(text)
      };
    } catch (error) {
      log.warn({ url, message: error.message }, "Puppeteer LinkedIn scrape failed");
      return {};
    } finally {
      if (browser) await browser.close();
    }
  }

  extractDescription(text = "") {
    const match = text.match(/(?:About us|Overview)\s+(.{80,600}?)(?:\s+(?:Website|Industry|Company size|Headquarters)\s+)/i);
    return compactText(match?.[1] || "").slice(0, 600);
  }

  extractEmployeeCount(text = "") {
    const match =
      text.match(/(?:Company size|employees?)\s*[:\-]?\s*([0-9,]+\s*[-–]\s*[0-9,]+\s*employees|[0-9,]+\+?\s*employees)/i) ||
      text.match(/([0-9,]+\s*[-–]\s*[0-9,]+|[0-9,]+\+?)\s+employees/i);
    return compactText(match?.[1] || "");
  }

  extractIndustry(text = "") {
    const match = text.match(/Industry\s*[:\-]?\s*([A-Za-z&,\-/ ]{3,80})(?:\s+(?:Company size|Headquarters|Website|Founded))/i);
    return compactText(match?.[1] || "");
  }

  cleanLinkedInUrl(url = "") {
    try {
      const parsed = new URL(url);
      parsed.search = "";
      parsed.hash = "";
      return parsed.toString();
    } catch {
      return url;
    }
  }
}
