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

// GET clips - returns all clips or clips for a specific video
router.get("/clips", async (req, res) => {
  const store = await getStore();
  const { videoId } = req.query;
  
  let clips = store.clips || [];
  if (videoId) {
    clips = clips.filter((clip) => clip.videoId === videoId);
  }
  
  // Format clips for frontend
  const formattedClips = clips.map((clip) => ({
    ...clip,
    duration: formatDuration(clip.endTime - clip.startTime),
    captionStyle: store.captions.find((c) => c.clipId === clip.id)?.style || null
  }));
  
  res.json(formattedClips);
});

// GET videos - returns all uploaded videos
router.get("/videos", async (req, res) => {
  const store = await getStore();
  const userId = req.user?.id;
  
  let videos = store.videos || [];
  if (userId) {
    videos = videos.filter((v) => v.userId === userId);
  }
  
  res.json(videos);
});

// GET single clip by ID
router.get("/clips/:id", async (req, res) => {
  const store = await getStore();
  const clip = store.clips.find((c) => c.id === req.params.id);
  
  if (!clip) {
    return res.status(404).json({ error: "Clip not found" });
  }
  
  const caption = store.captions.find((c) => c.clipId === clip.id);
  res.json({ ...clip, caption });
});

// GET stats for dashboard
router.get("/stats", async (req, res) => {
  const store = await getStore();
  const userId = req.user?.id;
  
  const textGenerations = store.text_generations?.filter((g) => !userId || g.userId === userId) || [];
  const imageGenerations = store.image_generations?.filter((g) => !userId || g.userId === userId) || [];
  const audioGenerations = store.audio_generations?.filter((g) => !userId || g.userId === userId) || [];
  const feedbackLogs = store.feedback_logs?.filter((f) => !userId || f.userId === userId) || [];
  const clips = store.clips || [];
  const videos = store.videos || [];
  
  const totalSessions = textGenerations.length + imageGenerations.length + audioGenerations.length;
  const feedbackCount = feedbackLogs.length;
  const avgRating = feedbackLogs.length > 0 
    ? (feedbackLogs.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbackLogs.length).toFixed(1)
    : "0.0";
  
  res.json({
    creativeSessions: totalSessions,
    feedbackLoops: feedbackCount,
    memorySync: "98%", // Could be calculated based on memory updates
    collaborationIndex: avgRating,
    clipsGenerated: clips.length,
    videosUploaded: videos.length,
    textGenerations: textGenerations.length,
    imageGenerations: imageGenerations.length,
    audioGenerations: audioGenerations.length
  });
});

// Helper function to format duration
function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

module.exports = router;
