import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const boolFromString = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  return ["true", "1", "yes", "y"].includes(String(value).toLowerCase());
};

const numberFromEnv = (fallback) =>
  z.preprocess((value) => {
    if (value === undefined || value === null || value === "") return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }, z.number());

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: numberFromEnv(3000),
  API_BASE_URL: z.string().url().optional().default("http://localhost:3000"),
  OPENAI_API_KEY: z.string().optional().default(""),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
  GOOGLE_MAPS_API_KEY: z.string().optional().default(""),
  GOOGLE_MAPS_PAGE_LIMIT: numberFromEnv(1),
  SERPER_API_KEY: z.string().optional().default(""),
  MONGODB_URI: z.string().default("mongodb://127.0.0.1:27017/ai_lead_generation_agent"),
  MAX_AGENT_ITERATIONS: numberFromEnv(12),
  DEFAULT_SEARCH_LIMIT: numberFromEnv(10),
  MAX_WEBSITES_TO_CRAWL: numberFromEnv(10),
  MAX_PAGES_PER_SITE: numberFromEnv(4),
  LOW_QUALITY_REVIEW_THRESHOLD: numberFromEnv(3.5),
  LOW_QUALITY_MIN_REVIEWS: numberFromEnv(5),
  REQUEST_TIMEOUT_MS: numberFromEnv(15000),
  RETRY_ATTEMPTS: numberFromEnv(3),
  RATE_LIMIT_WINDOW_MS: numberFromEnv(60000),
  RATE_LIMIT_MAX_REQUESTS: numberFromEnv(60),
  PUPPETEER_HEADLESS: z.preprocess(
    (value) => boolFromString(value, true),
    z.boolean()
  ),
  PUPPETEER_NAVIGATION_TIMEOUT_MS: numberFromEnv(30000),
  EXPORT_DIR: z.string().default("exports"),
  LOG_LEVEL: z.string().default("info")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
  throw new Error(`Invalid environment configuration: ${formatted.join("; ")}`);
}

export const env = parsed.data;

export const requireEnv = (name, value) => {
  if (!value) {
    const error = new Error(`${name} is required for this operation`);
    error.statusCode = 500;
    error.code = "MISSING_CONFIGURATION";
    throw error;
  }
  return value;
};
