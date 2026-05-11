const mongoose = require("mongoose");
const logger = require("../utils/logger");
const env = require("./env");

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  try {
    if (!env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(env.MONGO_URI, {
      autoIndex: false,
      serverSelectionTimeoutMS: 5000, // fail fast if DB not reachable
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;