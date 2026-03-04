require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth");
const generateRoutes = require("./routes/generate");
const feedbackRoutes = require("./routes/feedback");
const memoryRoutes = require("./routes/memory");
const projectRoutes = require("./routes/projects");
const videoRoutes = require("./routes/video");
const { attachUser } = require("./utils/auth");

const app = express();

// ── Security headers ──
app.use(helmet());

// ── CORS ── allow only known origins in production
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());
app.use(
  cors({
    origin: (origin, cb) => {
      // allow server-to-server / curl (no origin) or matching origin
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(attachUser);

// ── Rate limiting ──
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" }
});
app.use("/generate", apiLimiter);
app.use("/feedback", apiLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many auth attempts, please try again later" }
});
app.use("/auth", authLimiter);

// ── Health ──
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "chhaya-backend",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ── Routes ──
app.use("/auth", authRoutes);
app.use("/generate", generateRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/memory", memoryRoutes);
app.use("/projects", projectRoutes);
app.use("/", videoRoutes);

// ── Global error handler ──
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production" && status === 500
      ? "Unexpected server error"
      : err.message || "Unexpected server error";
  console.error(`[${new Date().toISOString()}] ${status} - ${err.message}`);
  if (status === 500) console.error(err.stack);
  res.status(status).json({ error: message });
});

// ── Start server ──
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Chhaya backend running on port ${PORT}`);
});

// ── Graceful shutdown ──
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully…`);
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
  // Force exit after 10s
  setTimeout(() => {
    console.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 10_000);
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
