const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const generateRoutes = require("./routes/generate");
const feedbackRoutes = require("./routes/feedback");
const memoryRoutes = require("./routes/memory");
const projectRoutes = require("./routes/projects");
const { attachUser } = require("./utils/auth");

const app = express();

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

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Chhaya backend running on port ${PORT}`);
});
