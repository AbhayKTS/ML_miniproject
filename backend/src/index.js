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

const xss = require("xss-clean");

const app = express();

// Security Middlewares
app.use(helmet());
app.use(xss());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(attachUser);

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
app.listen(PORT, () => {
  console.log(`Chhaya backend running on port ${PORT}`);
});
