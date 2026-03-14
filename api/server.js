const express = require("express");
const cors = require("cors");

require("../backend/src/config/db");
require("../backend/src/config/env");
require("../backend/src/utils/logger");
require("../backend/src/middlewares/error.middleware");

// Routes
require("../backend/src/routes/lead.routes");
const scrapeRoutes = require("./routes/scrape.routes");
const exportRoutes = require("./routes/export.routes");
const path = require('path');
const { spawn } = require('child_process');

const app = express();

/* =======================
   Database Connection
======================= */
connectDB();

/* =======================
   Health Check
======================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Lead Generation API is running 🚀"
  });
});

/* =======================
   Python Scraper Route (NEW)
======================= */
app.post('/api/python-scrape', async (req, res) => {
  const { keywords_file, platform } = req.body;
  const python = spawn('python', ['../scraper/leadScraper.py', keywords_file || '../data/keywords.xlsx', platform]);
  
  let output = '';
  python.stdout.on('data', (data) => output += data.toString());
  python.stderr.on('data', (data) => console.error(`Python Error: ${data}`));
  
  python.on('close', (code) => {
    res.json({ success: code === 0, output });
  });
});

/* =======================
   API Routes
======================= */
app.use("/api/leads", leadRoutes);
app.use("/api/scrape", scrapeRoutes);
app.use("/api/export", exportRoutes);

/* =======================
   Admin Panel - React App (TODO: move to root)
======================= */
app.use('/admin', express.static(path.join(__dirname, '../backend/admin/dist')));

/* =======================
   Error Handler (LAST)
======================= */
app.use(errorHandler);

const PORT = env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection", err);
  server.close(() => process.exit(1));
});

module.exports = app;

