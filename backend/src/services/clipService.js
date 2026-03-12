const path = require("path");
const fs = require("fs/promises");
const { updateStore } = require("../data/store");
const { v4: uuid } = require("uuid");
const { detectHighlights } = require("../../workers/highlightDetection");
const { sliceVideo } = require("../../workers/ffmpegSlicer");
const { saveClipsToFirestore, uploadClipToStorage, isFirebaseEnabled } = require("./firebaseAdmin");

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

  // Save to local JSON store
  await updateStore((store) => {
    store.clips.push(...clips);
    const job = store.clip_jobs.find((entry) => entry.id === jobId);
    if (job) {
      job.status = "complete";
      job.progress = 100;
    }
    return store;
  });

  // Save to Firestore if enabled
  if (isFirebaseEnabled()) {
    try {
      await saveClipsToFirestore(clips);
      console.log(`Saved ${clips.length} clips to Firestore`);
      
      // Optionally upload clip files to Firebase Storage
      for (const clip of clips) {
        const result = await uploadClipToStorage(clip);
        if (result) {
          clip.storageUrl = result.url;
          clip.storagePath = result.destination;
        }
      }
    } catch (error) {
      console.error("Firestore save error (non-fatal):", error.message);
    }
  }

  return { jobId, clips };
};

module.exports = {
  generateClips,
  ensureClipsDir
};
