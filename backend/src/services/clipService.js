const path = require("path");
const fs = require("fs/promises");
const { updateStore } = require("../data/store");
const { v4: uuid } = require("uuid");
const { detectHighlights } = require("../workers/highlightDetection");
const { sliceVideo } = require("../workers/ffmpegSlicer");

const clipsDir = path.join(process.cwd(), "data", "clips");

const ensureClipsDir = async () => {
  await fs.mkdir(clipsDir, { recursive: true });
  return clipsDir;
};

const generateClips = async ({ video, minDuration = 15, maxDuration = 60 }) => {
  await ensureClipsDir();
  const jobId = uuid();

  await updateStore((store) => {
    store.clip_jobs.push({
      id: jobId,
      videoId: video.id,
      status: "running",
      progress: 10,
      createdAt: new Date().toISOString()
    });
    return store;
  });

  const highlights = await detectHighlights(video.sourcePath, { minDuration, maxDuration });
  const clips = [];

  for (const highlight of highlights) {
    const clipId = uuid();
    const outputPath = path.join(clipsDir, `${clipId}.mp4`);
    await sliceVideo(video.sourcePath, outputPath, highlight.start, highlight.end);
    clips.push({
      id: clipId,
      videoId: video.id,
      title: highlight.title,
      startTime: highlight.start,
      endTime: highlight.end,
      aspectRatio: "9:16",
      status: "ready",
      outputPath,
      createdAt: new Date().toISOString()
    });
  }

  await updateStore((store) => {
    store.clips.push(...clips);
    const job = store.clip_jobs.find((entry) => entry.id === jobId);
    if (job) {
      job.status = "complete";
      job.progress = 100;
    }
    return store;
  });

  return { jobId, clips };
};

module.exports = {
  generateClips,
  ensureClipsDir
};
