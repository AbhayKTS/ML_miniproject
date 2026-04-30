require("dotenv").config();
const express = require("express");
const cors = require("cors");

if (!process.env.ENGINE_ACCESS_KEY) {
  console.warn("WARNING: ENGINE_ACCESS_KEY is missing from environment variables.");
}
const authRoutes = require("./routes/auth");
const generateRoutes = require("./routes/generate");
const feedbackRoutes = require("./routes/feedback");
const memoryRoutes = require("./routes/memory");
const projectRoutes = require("./routes/projects");
const videoRoutes = require("./routes/video");
const videoRoutes = require("./routes/video");

const app = express();

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");

app.use(helmet());
app.use(xss());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
  credentials: true,
}));
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "chhaya-backend" });
});

app.use("/auth", authRoutes);
app.use("/generate", generateRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/memory", memoryRoutes);
app.use("/projects", projectRoutes);
app.use("/", videoRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected server error" });
});

const PORT = process.env.PORT || 4000;

try {
  const { execSync } = require('child_process');
  console.log(`Checking if port ${PORT} is in use...`);
  if (process.platform === 'win32') {
    execSync(`FOR /F "tokens=5" %a in ('netstat -ano ^| findstr :${PORT}') do taskkill /F /PID %a`, { stdio: 'ignore' });
  } else {
    execSync(`lsof -ti:${PORT} | xargs kill -9`, { stdio: 'ignore' });
  }
  console.log(`Successfully cleared port ${PORT}.`);
} catch (e) {
  // Ignore errors if the port was already free
}

app.listen(PORT, () => {
  console.log(`Chhaya backend running on port ${PORT}`);
});
