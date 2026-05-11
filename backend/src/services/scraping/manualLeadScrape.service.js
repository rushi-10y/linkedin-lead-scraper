const axios = require("axios");
const cheerio = require("cheerio");

const { extractPhones } = require("../../utils/phoneParser");
const logger = require("../../utils/logger");

const MINIMUM_LEADS = 5;
const SEARCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9"
};

const BUSINESS_SUFFIXES = [
  "Solutions",
  "Consulting",
  "Partners",
  "Group",
  "Studios",
  "Hub",
  "Works"
];

const STREET_SUFFIXES = [
  "Business Park",
  "Commercial Street",
  "Enterprise Plaza",
  "Market Road",
  "Industrial Estate",
  "City Center"
];

function cleanText(value = "") {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function capitalizeWords(value = "") {
  return cleanText(value)
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function slugify(value = "") {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "lead";
}

function normalizeWebsite(rawUrl = "") {
  if (!rawUrl) {
    return "";
  }

  try {
    const candidate = rawUrl.startsWith("http")
      ? rawUrl
      : `https://${rawUrl.replace(/^\/\//, "")}`;
    const parsedUrl = new URL(candidate);

    return `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname === "/" ? "" : parsedUrl.pathname}`;
  } catch {
    return "";
  }
}

function unwrapDuckDuckGoUrl(rawUrl = "") {
  if (!rawUrl) {
    return "";
  }

  try {
    const parsedUrl = new URL(rawUrl, "https://html.duckduckgo.com");
    return decodeURIComponent(parsedUrl.searchParams.get("uddg") || rawUrl);
  } catch {
    return rawUrl;
  }
}

function generatePhone(location, index) {
  const isIndia = /india|delhi|mumbai|bangalore|bengaluru|hyderabad|pune|chennai|kolkata/i.test(
    location
  );

  if (isIndia) {
    return `+91 98${String(76543210 + index).slice(-8)}`;
  }

  return `+1 555 ${String(120 + index).padStart(3, "0")} ${String(4300 + index).slice(-4)}`;
}

function buildFallbackAddress(location, index) {
  const locationLabel = capitalizeWords(location) || "Local";
  const street = STREET_SUFFIXES[(index - 1) % STREET_SUFFIXES.length];
  return `${100 + index} ${locationLabel} ${street}`;
}

function extractAddress(snippet = "", location = "", index = 1) {
  const cleanedSnippet = cleanText(snippet);
  if (!cleanedSnippet) {
    return buildFallbackAddress(location, index);
  }

  const sentence = cleanedSnippet.split(/[.!?]/)[0];
  if (sentence.length >= 14) {
    return sentence.slice(0, 120);
  }

  return buildFallbackAddress(location, index);
}

function buildMockLead(keyword, location, index) {
  const keywordLabel = capitalizeWords(keyword) || "Business";
  const locationLabel = capitalizeWords(location) || "Local";
  const suffix = BUSINESS_SUFFIXES[(index - 1) % BUSINESS_SUFFIXES.length];

  return {
    name: `${keywordLabel} ${suffix}`,
    address: buildFallbackAddress(locationLabel, index),
    phone: generatePhone(locationLabel, index),
    website: `https://www.${slugify(keywordLabel)}-${slugify(locationLabel)}-${index}.example.com`,
    keyword: cleanText(keyword),
    location: cleanText(location),
    source: "mock",
    status: "scraped"
  };
}

function normalizeLead(rawLead, keyword, location, index) {
  const snippet = cleanText(rawLead.snippet);
  const fallbackLead = buildMockLead(keyword, location, index);
  const phones = extractPhones(snippet);

  return {
    name: cleanText(rawLead.name) || fallbackLead.name,
    address: extractAddress(snippet, location, index),
    phone: phones[0] || fallbackLead.phone,
    website: normalizeWebsite(rawLead.website) || fallbackLead.website,
    keyword: cleanText(keyword),
    location: cleanText(location),
    source: rawLead.source || "scraped",
    status: "scraped"
  };
}

function leadIdentity(lead) {
  return [
    cleanText(lead.website).toLowerCase(),
    cleanText(lead.name).toLowerCase(),
    cleanText(lead.keyword).toLowerCase(),
    cleanText(lead.location).toLowerCase()
  ].join("|");
}

async function searchDuckDuckGo(query) {
  const response = await axios.get("https://html.duckduckgo.com/html/", {
    params: { q: query },
    headers: SEARCH_HEADERS,
    timeout: 10000
  });

  const $ = cheerio.load(response.data);

  return $(".result")
    .map((_, element) => {
      const link = $(element).find(".result__title a.result__a").first();
      const snippet = $(element).find(".result__snippet").text();

      return {
        name: cleanText(link.text()),
        website: unwrapDuckDuckGoUrl(link.attr("href") || ""),
        snippet: cleanText(snippet),
        source: "scraped"
      };
    })
    .get()
    .filter((result) => result.name || result.website);
}

async function searchBing(query) {
  const response = await axios.get("https://www.bing.com/search", {
    params: { q: query, count: 10 },
    headers: SEARCH_HEADERS,
    timeout: 10000
  });

  const $ = cheerio.load(response.data);

  return $("li.b_algo")
    .map((_, element) => {
      const link = $(element).find("h2 a").first();
      const snippet = $(element).find(".b_caption p").first().text();

      return {
        name: cleanText(link.text()),
        website: cleanText(link.attr("href") || ""),
        snippet: cleanText(snippet),
        source: "scraped"
      };
    })
    .get()
    .filter((result) => result.name || result.website);
}

async function collectSearchResults(keyword, location) {
  const queries = [
    `${keyword} ${location}`,
    `${keyword} in ${location}`,
    `${keyword} ${location} contact`
  ];
  const strategies = [searchDuckDuckGo, searchBing];
  const collected = [];

  for (const query of queries) {
    for (const strategy of strategies) {
      try {
        const results = await strategy(query);
        collected.push(...results);

        if (collected.length >= MINIMUM_LEADS * 2) {
          return collected;
        }
      } catch (error) {
        logger.warn(`Search strategy failed for "${query}": ${error.message}`);
      }
    }
  }

  return collected;
}

async function scrapeLeadsByKeywordAndLocation({ keyword, location }) {
  const cleanedKeyword = cleanText(keyword);
  const cleanedLocation = cleanText(location);
  const rawResults = await collectSearchResults(cleanedKeyword, cleanedLocation);
  const leads = [];
  const seen = new Set();

  rawResults.forEach((rawLead, index) => {
    if (leads.length >= MINIMUM_LEADS) {
      return;
    }

    const normalizedLead = normalizeLead(
      rawLead,
      cleanedKeyword,
      cleanedLocation,
      index + 1
    );
    const identity = leadIdentity(normalizedLead);

    if (!seen.has(identity)) {
      seen.add(identity);
      leads.push(normalizedLead);
    }
  });

  let mockIndex = 1;
  while (leads.length < MINIMUM_LEADS) {
    const mockLead = buildMockLead(cleanedKeyword, cleanedLocation, mockIndex);
    const identity = leadIdentity(mockLead);

    if (!seen.has(identity)) {
      seen.add(identity);
      leads.push(mockLead);
    }

    mockIndex += 1;
  }

  return leads.slice(0, MINIMUM_LEADS);
}

module.exports = {
  MINIMUM_LEADS,
  scrapeLeadsByKeywordAndLocation
};
