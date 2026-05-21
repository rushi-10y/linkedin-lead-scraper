import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { MongoDBService } from "./database/MongoDBService.js";
import { createAgentRouter } from "./routes/agent.routes.js";
import { isOperationalError } from "./utils/errors.js";
import { logger } from "./utils/logger.js";

const mongoService = new MongoDBService();

const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "2mb" }));

  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX_REQUESTS,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "ai-lead-generation-agent",
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  });

  app.use("/api", createAgentRouter({ mongoService }));

  app.use((req, res) => {
    res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: `Route ${req.method} ${req.originalUrl} not found`
      }
    });
  });

  app.use((error, _req, res, _next) => {
    const statusCode = error.statusCode || 500;
    const payload = {
      error: {
        code: error.code || "INTERNAL_SERVER_ERROR",
        message: error.message || "Unexpected server error",
        details: error.details
      }
    };

    if (!isOperationalError(error)) {
      logger.error({ error: error.stack || error.message }, "Unhandled request error");
    }

    res.status(statusCode).json(payload);
  });

  return app;
};

const start = async () => {
  await mongoService.connect();
  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        health: `${env.API_BASE_URL}/health`,
        leadResearchEndpoint: `${env.API_BASE_URL}/api/agents/lead-research`
      },
      "AI Lead Generation Agent server started"
    );
  });

  const shutdown = async (signal) => {
    logger.info({ signal }, "Shutting down server");
    server.close(async () => {
      await mongoService.disconnect();
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

start().catch((error) => {
  logger.fatal({ error: error.stack || error.message }, "Failed to start server");
  process.exit(1);
});
