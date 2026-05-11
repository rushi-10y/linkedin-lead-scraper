const dotenv = require("dotenv");

/**
 * Load environment variables
 */
dotenv.config();

/**
 * Validate required environment variables (optional for development)
 */
const requiredEnvVars = [
  "PORT",
  "JWT_SECRET"
];

// For development, use defaults if not provided
const defaults = {
  PORT: process.env.PORT || 3000,
  MONGO_URI:
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/leadscraper",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-key-change-in-production",
  SCRAPING_API_KEY: process.env.SCRAPING_API_KEY || "f705c74115eeb8416e570dde6aa1f812",
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_DEV_URL: process.env.FRONTEND_DEV_URL || "http://localhost:3001",
  ALLOW_DEV_AUTH_BYPASS: process.env.ALLOW_DEV_AUTH_BYPASS || "true"
};

requiredEnvVars.forEach((key) => {
  if (!process.env[key] && !defaults[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
});

module.exports = defaults;
