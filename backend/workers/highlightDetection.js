const path = require("path");
const { spawn } = require("child_process");
const { getProcessingModel, isEngineEnabled } = require("../src/services/engineClient");

/**
 * Use FFmpeg to analyze audio volume levels and detect high-energy segments.
 * Returns an array of { start, end, volume } segments.
 */
const analyzeAudioEnergy = (videoPath) => {
  return new Promise((resolve, reject) => {
    const segments = [];
    let stderr = "";

    // Use FFmpeg's volumedetect and astats to get per-second volume data
    const ffmpeg = spawn("ffmpeg", [
      "-i", videoPath,
      "-af", "astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-",
      "-f", "null",
      "-"
    ]);

    ffmpeg.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    let stdout = "";
    ffmpeg.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    ffmpeg.on("close", (code) => {
      if (code !== 0) {
        // If astats fails, try simpler volumedetect approach
        return resolve(null);
      }

      try {
        // Parse per-frame RMS levels from stdout
        const lines = stdout.split("\n").filter((l) => l.includes("lavfi.astats.Overall.RMS_level"));
        let timeIndex = 0;
        for (const line of lines) {
          const match = line.match(/=(-?[\d.]+)/);
          if (match) {
            const rms = parseFloat(match[1]);
            segments.push({ time: timeIndex, rms });
          }
          timeIndex++;
        }
        resolve(segments);
      } catch {
        resolve(null);
      }
    });

    ffmpeg.on("error", () => resolve(null));
  });
};

/**
 * Get video duration using ffprobe.
 */
const getVideoDuration = (videoPath) => {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "csv=p=0",
      videoPath
    ]);

    let output = "";
    ffprobe.stdout.on("data", (data) => { output += data.toString(); });
    ffprobe.on("close", (code) => {
      if (code === 0 && output.trim()) {
        resolve(parseFloat(output.trim()));
      } else {
        resolve(300); // Default 5 min if ffprobe fails
      }
    });
    ffprobe.on("error", () => resolve(300));
  });
};

/**
 * Detect scene changes using FFmpeg's scene detection filter.
 * Returns timestamps where scene changes occur.
 */
const detectSceneChanges = (videoPath) => {
  return new Promise((resolve) => {
    const scenes = [];
    let stderr = "";

    const ffmpeg = spawn("ffmpeg", [
      "-i", videoPath,
      "-vf", "select='gt(scene,0.3)',showinfo",
      "-f", "null",
      "-"
    ]);

    ffmpeg.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    ffmpeg.on("close", () => {
      // Parse timestamps from showinfo output
      const lines = stderr.split("\n");
      for (const line of lines) {
        const match = line.match(/pts_time:([\d.]+)/);
        if (match) {
          scenes.push(parseFloat(match[1]));
        }
      }
      resolve(scenes);
    });

    ffmpeg.on("error", () => resolve([]));
  });
};

/**
 * Detect highlight moments in a video using FFmpeg audio analysis + scene detection.
 * When Gemini is enabled, sends extracted metadata for intelligent highlight selection.
 */
const detectHighlights = async (videoPath, { minDuration = 15, maxDuration = 60 } = {}) => {
  const baseName = path.basename(videoPath, path.extname(videoPath));

  // Step 1: Get video duration
  const duration = await getVideoDuration(videoPath);
  console.log(`[HighlightDetection] Video duration: ${duration}s`);

  // Step 2: Analyze audio energy and scene changes in parallel
  const [energySegments, sceneChanges] = await Promise.all([
    analyzeAudioEnergy(videoPath),
    detectSceneChanges(videoPath)
  ]);

  let highlights = [];

  // Step 3: If we have energy data, find peak regions
  if (energySegments && energySegments.length > 0) {
    // Sort by RMS level (higher = louder) and pick top segments
    const sorted = [...energySegments]
      .filter((s) => s.rms > -30) // Filter out silence
      .sort((a, b) => b.rms - a.rms);

    // Group nearby peaks into highlight windows
    const peakTimes = sorted.slice(0, 20).map((s) => s.time);
    const windows = groupIntoWindows(peakTimes, minDuration, maxDuration, duration);

    highlights = windows.map((w, i) => ({
      title: `${baseName}-highlight-${i + 1}`,
      start: w.start,
      end: w.end,
      score: Math.round((0.95 - i * 0.03) * 100) / 100,
      source: "audio-energy"
    }));
  }

  // Step 4: Add scene-change-based highlights if we don't have enough
  if (highlights.length < 3 && sceneChanges.length > 0) {
    const sceneWindows = groupIntoWindows(sceneChanges, minDuration, maxDuration, duration);
    for (let i = 0; i < Math.min(3 - highlights.length, sceneWindows.length); i++) {
      highlights.push({
        title: `${baseName}-scene-${i + 1}`,
        start: sceneWindows[i].start,
        end: sceneWindows[i].end,
        score: Math.round((0.85 - i * 0.03) * 100) / 100,
        source: "scene-change"
      });
    }
  }

  // Step 5: If Gemini is enabled, ask it to rank/refine the highlights
  if (isEngineEnabled() && highlights.length > 0) {
    try {
      const model = getProcessingModel();
      const prompt = `You are a video editor AI. Given these detected highlight segments from a video:
${JSON.stringify(highlights, null, 2)}

Video duration: ${duration}s. Scene changes at: [${sceneChanges.slice(0, 10).join(", ")}]s.

Rank these highlights by likely viewer engagement. Return a JSON array with the top 3 highlights, each with: title, start, end, score (0-1). Return ONLY the JSON array.`;

      const result = await model.generateContent(prompt);
      const refined = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());
      if (Array.isArray(refined) && refined.length > 0) {
        console.log(`[HighlightDetection] Gemini refined ${refined.length} highlights`);
        return refined.slice(0, 5);
      }
    } catch (error) {
      console.warn("[HighlightDetection] Gemini refinement failed, using FFmpeg results:", error.message);
    }
  }

  // Step 6: Fallback — evenly distribute highlights across the video
  if (highlights.length === 0) {
    const segmentLength = Math.min(maxDuration, Math.max(minDuration, 30));
    const count = Math.min(3, Math.floor(duration / segmentLength));
    const spacing = duration / (count + 1);

    for (let i = 0; i < Math.max(count, 1); i++) {
      const start = Math.max(0, Math.round(spacing * (i + 1) - segmentLength / 2));
      highlights.push({
        title: `${baseName}-segment-${i + 1}`,
        start,
        end: Math.min(start + segmentLength, duration),
        score: Math.round((0.8 - i * 0.05) * 100) / 100,
        source: "evenly-distributed"
      });
    }
  }

  return highlights.slice(0, 5);
};

/**
 * Group nearby timestamps into non-overlapping windows of [minDuration, maxDuration].
 */
const groupIntoWindows = (times, minDuration, maxDuration, totalDuration) => {
  if (!times.length) return [];

  const sorted = [...new Set(times)].sort((a, b) => a - b);
  const windows = [];
  let i = 0;

  while (i < sorted.length && windows.length < 5) {
    const center = sorted[i];
    const halfDur = minDuration / 2;
    const start = Math.max(0, Math.round(center - halfDur));
    const end = Math.min(Math.round(center + halfDur), totalDuration);

    // Skip if overlaps with previous window
    if (windows.length === 0 || start >= windows[windows.length - 1].end + 2) {
      windows.push({ start, end: Math.min(end, start + maxDuration) });
    }
    i++;
  }

  return windows;
};

module.exports = {
  detectHighlights
};
