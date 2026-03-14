const mongoose = require("mongoose");
const logger = require("../utils/logger");
const env = require("./env");

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      autoIndex: false
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error("MongoDB connection failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;
