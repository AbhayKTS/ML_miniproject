const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const generateRoutes = require("./routes/generate");
const feedbackRoutes = require("./routes/feedback");
const memoryRoutes = require("./routes/memory");
const projectRoutes = require("./routes/projects");
const videoRoutes = require("./routes/video");
const { attachUser } = require("./utils/auth");
const { initializeFirebase, isFirebaseEnabled } = require("./services/firebaseAdmin");

// Initialize Firebase Admin SDK
initializeFirebase();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(",") 
    : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
};
app.use(cors(corsOptions));
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
  console.log(`Firebase Firestore: ${isFirebaseEnabled() ? "enabled" : "disabled"}`);
});
