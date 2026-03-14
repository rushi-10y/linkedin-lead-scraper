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
  "MONGO_URI",
  "JWT_SECRET"
];

// For development, use defaults if not provided
const defaults = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/leadscraper",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-key-change-in-production",
  NODE_ENV: process.env.NODE_ENV || "development"
};

requiredEnvVars.forEach((key) => {
  if (!process.env[key] && !defaults[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
});

module.exports = defaults;
