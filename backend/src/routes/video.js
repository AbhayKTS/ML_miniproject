const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");
const { createVideo, getVideo } = require("../services/videoService");
const { generateClips } = require("../services/clipService");
const { generateCaptions } = require("../services/captionService");
const { exportClip } = require("../services/exportService");
const {
  clipRequestSchema,
  captionRequestSchema,
  exportRequestSchema,
  validate
} = require("../utils/validators");
const { getStore } = require("../data/store");

const router = express.Router();

const upload = multer({
  dest: path.join(process.cwd(), "data", "temp"),
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }
});

router.post("/upload", upload.single("video"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const extension = path.extname(req.file.originalname).toLowerCase();
  const allowed = [".mp4", ".mov", ".mkv", ".webm"];
  if (!allowed.includes(extension)) {
    await fs.unlink(req.file.path);
    return res.status(400).json({ error: "Unsupported file format" });
  }

  const userId = req.user?.id || "guest";
  const video = await createVideo({
    userId,
    filename: req.file.originalname,
    tempPath: req.file.path
  });

  res.status(201).json({ id: video.id, filename: video.filename });
});

router.post("/generate-clips", async (req, res) => {
  const validation = validate(clipRequestSchema, req.body);
  if (!validation.success) {
    return res.status(400).json({ error: "Invalid payload", details: validation.errors });
  }

  const video = await getVideo(validation.data.videoId);
  if (!video) {
    return res.status(404).json({ error: "Video not found" });
  }

  const result = await generateClips({
    video,
    minDuration: validation.data.minDuration,
    maxDuration: validation.data.maxDuration
  });

  res.json(result);
});

router.post("/generate-captions", async (req, res) => {
  const validation = validate(captionRequestSchema, req.body);
  if (!validation.success) {
    return res.status(400).json({ error: "Invalid payload", details: validation.errors });
  }

  const store = await getStore();
  const clip = store.clips.find((entry) => entry.id === validation.data.clipId);
  if (!clip) {
    return res.status(404).json({ error: "Clip not found" });
  }

  const caption = await generateCaptions({ clip, style: validation.data.style });
  res.json(caption);
});

router.post("/export", async (req, res) => {
  const validation = validate(exportRequestSchema, req.body);
  if (!validation.success) {
    return res.status(400).json({ error: "Invalid payload", details: validation.errors });
  }

  const store = await getStore();
  const clip = store.clips.find((entry) => entry.id === validation.data.clipId);
  if (!clip) {
    return res.status(404).json({ error: "Clip not found" });
  }

  const captions = store.captions.find((entry) => entry.clipId === clip.id);
  const exportRecord = await exportClip({
    clip,
    captions,
    format: validation.data.format,
    resolution: validation.data.resolution,
    aspectRatio: validation.data.aspectRatio
  });

  res.json(exportRecord);
});

module.exports = router;
