const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { execFileSync } = require("child_process");
const authRoutes = require("./routes/auth");
const generateRoutes = require("./routes/generate");
const feedbackRoutes = require("./routes/feedback");
const memoryRoutes = require("./routes/memory");
const projectRoutes = require("./routes/projects");
const videoRoutes = require("./routes/video");
const { attachUser } = require("./utils/auth");
const { requestContext } = require("./middleware/requestContext");
const { errorHandler } = require("./middleware/errorHandler");
const { csrfGuard } = require("./middleware/csrfGuard");
const { logger } = require("./utils/logger");

const xss = require("xss-clean");

const app = express();

const getListeningPid = (port) => {
  try {
    const output = execFileSync("netstat", ["-ano", "-p", "tcp"], {
      encoding: "utf8"
    });

    for (const line of output.split(/\r?\n/)) {
      if (!line.toUpperCase().includes("LISTENING") || !line.includes(`:${port}`)) {
        continue;
      }

      const match = line.trim().match(/(\d+)$/);
      if (match) {
        return Number(match[1]);
      }
    }
  } catch (error) {
    logger.warn("port_probe_failed", { port, error: error.message });
  }

  return null;
};

const freePortForDev = (port) => {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const pid = getListeningPid(port);
  if (!pid || pid === process.pid) {
    return;
  }

  try {
    execFileSync("taskkill", ["/PID", String(pid), "/F"], {
      stdio: "ignore"
    });
    logger.warn("stale_listener_killed", { port, pid });
  } catch (error) {
    logger.warn("stale_listener_kill_failed", { port, pid, error: error.message });
  }
};

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

const corsConfig = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true,
  credentials: true
};

app.use(cors(corsConfig));
app.use(express.json({ limit: "2mb" }));
app.use(requestContext);
app.use(attachUser);
app.use(csrfGuard);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "chhaya-backend" });
});

app.use("/auth", authRoutes);
app.use("/generate", generateRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/memory", memoryRoutes);
app.use("/projects", projectRoutes);
app.use("/", videoRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
freePortForDev(PORT);

const server = app.listen(PORT, () => {
  logger.info("backend_started", { port: PORT });
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    logger.error("port_in_use", { port: PORT, message: "Port already in use" });
    process.exit(1);
  }

  throw error;
});
