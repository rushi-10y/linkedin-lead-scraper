const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const env = require("./config/env");
const logger = require("./utils/logger");
const errorHandler = require("./middlewares/error.middleware");

// Routes
const leadRoutes = require("./routes/lead.routes");
const scrapeRoutes = require("./routes/scrape.routes");
const exportRoutes = require("./routes/export.routes");
const authRoutes = require("./routes/auth.routes");

const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

/* =======================
   Database Connection
======================= */
connectDB();

/* =======================
   Scheduler (ONLY in production or worker)
======================= */
if (process.env.ENABLE_SCHEDULER === "true") {
  const scheduler = require("./jobs/scheduler");
  scheduler.startScheduler();
}

/* =======================
   Security + Logging Middleware
======================= */
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logging
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);

/* =======================
   Health Check
======================= */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Lead Generation API is running 🚀"
  });
});

/* =======================
   API Routes
======================= */
app.use("/api/leads", leadRoutes);
app.use("/api/scrape", scrapeRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/auth", authRoutes);

/* =======================
   Frontend Handling
======================= */
const FRONTEND_DEV_URL =
  env.FRONTEND_DEV_URL;

const FRONTEND_DIST_DIR = path.join(
  __dirname,
  "../../frontend/dist"
);
const ADMIN_DIST_DIR = path.join(__dirname, "../admin/dist");

app.use("/admin", express.static(ADMIN_DIST_DIR));
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(ADMIN_DIST_DIR, "index.html"));
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(FRONTEND_DIST_DIR));

  app.get("*", (req, res) => {
    res.sendFile(path.join(FRONTEND_DIST_DIR, "index.html"));
  });
} else {
  app.use(
    createProxyMiddleware({
      target: FRONTEND_DEV_URL,
      changeOrigin: true,
      ws: true,
      filter: (pathname) => !pathname.startsWith("/api"),
      logLevel: "silent"
    })
  );
}

/* =======================
   Error Handler (LAST)
======================= */
app.use(errorHandler);

/* =======================
   Server Start
======================= */
const PORT = env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});

/* =======================
   Graceful Shutdown
======================= */
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
  shutdown();
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  shutdown();
});

function shutdown() {
  server.close(() => {
    logger.info("Server shut down gracefully");
    process.exit(1);
  });
}

module.exports = app;
