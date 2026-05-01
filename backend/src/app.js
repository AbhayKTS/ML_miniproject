// app.js — Pure Express app, no server.listen() here
// Imported by both index.js (local dev) and functions.js (Cloud Functions)
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env.local") });
require("dotenv").config(); // Fallback for safe variables
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");

if (!process.env.ENGINE_ACCESS_KEY) {
  console.warn("WARNING: ENGINE_ACCESS_KEY is missing from environment variables.");
}

const authRoutes = require("./routes/auth");
const generateRoutes = require("./routes/generate");
const feedbackRoutes = require("./routes/feedback");
const memoryRoutes = require("./routes/memory");
const projectRoutes = require("./routes/projects");
const videoRoutes = require("./routes/video");

const app = express();

app.use(helmet());
app.use(xss());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://miniml-d9ea9.web.app",
  "https://miniml-d9ea9.firebaseapp.com",
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

app.use(express.json({ limit: "2mb" }));

const apiRouter = express.Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "chhaya-backend", env: process.env.NODE_ENV || "development" });
});

apiRouter.use("/auth", authRoutes);
apiRouter.use("/generate", generateRoutes);
apiRouter.use("/feedback", feedbackRoutes);
apiRouter.use("/memory", memoryRoutes);
apiRouter.use("/projects", projectRoutes);
apiRouter.use("/", videoRoutes);

app.use("/", apiRouter);
app.use("/api", apiRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected server error" });
});

module.exports = app;
