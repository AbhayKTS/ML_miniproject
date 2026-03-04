const fs = require("fs/promises");
const { spawn } = require("child_process");

/**
 * Aspect ratio presets → width:height ratios.
 */
const ASPECT_RATIOS = {
  "16:9": { w: 16, h: 9 },
  "9:16": { w: 9, h: 16 },
  "1:1": { w: 1, h: 1 },
  "4:5": { w: 4, h: 5 },
  "4:3": { w: 4, h: 3 },
  "3:4": { w: 3, h: 4 },
  "21:9": { w: 21, h: 9 }
};

/**
 * Resolution presets → height in pixels.
 */
const RESOLUTIONS = {
  "4k": 2160,
  "1440p": 1440,
  "1080p": 1080,
  "720p": 720,
  "480p": 480,
  "360p": 360
};

/**
 * Get video dimensions using ffprobe.
 * @returns {{ width: number, height: number }}
 */
const getVideoDimensions = (videoPath) => {
  return new Promise((resolve) => {
    const ffprobe = spawn("ffprobe", [
      "-v", "error",
      "-select_streams", "v:0",
      "-show_entries", "stream=width,height",
      "-of", "csv=p=0:s=x",
      videoPath
    ]);

    let output = "";
    ffprobe.stdout.on("data", (data) => { output += data.toString(); });

    ffprobe.on("close", (code) => {
      if (code === 0 && output.includes("x")) {
        const [w, h] = output.trim().split("x").map(Number);
        resolve({ width: w || 1920, height: h || 1080 });
      } else {
        resolve({ width: 1920, height: 1080 }); // sensible default
      }
    });

    ffprobe.on("error", () => resolve({ width: 1920, height: 1080 }));
  });
};

/**
 * Calculate crop and scale dimensions for a target aspect ratio + resolution.
 */
const computeCropParams = (srcWidth, srcHeight, targetAR, targetHeight) => {
  const arRatio = targetAR.w / targetAR.h;
  const srcRatio = srcWidth / srcHeight;

  let cropW, cropH, cropX, cropY;

  if (srcRatio > arRatio) {
    // Source is wider than target → crop width
    cropH = srcHeight;
    cropW = Math.round(srcHeight * arRatio);
    cropX = Math.round((srcWidth - cropW) / 2);
    cropY = 0;
  } else {
    // Source is taller than target → crop height
    cropW = srcWidth;
    cropH = Math.round(srcWidth / arRatio);
    cropX = 0;
    cropY = Math.round((srcHeight - cropH) / 2);
  }

  // Target scale dimensions
  const scaleH = targetHeight;
  const scaleW = Math.round(targetHeight * arRatio);
  // Ensure even dimensions (required by most video codecs)
  const finalW = scaleW % 2 === 0 ? scaleW : scaleW + 1;
  const finalH = scaleH % 2 === 0 ? scaleH : scaleH + 1;

  return { cropW, cropH, cropX, cropY, scaleW: finalW, scaleH: finalH };
};

/**
 * Crop and resize a video using FFmpeg.
 * @param {string} inputPath - Source video path
 * @param {string} aspectRatio - Target aspect ratio (e.g., "9:16", "1:1")
 * @param {string} resolution - Target resolution (e.g., "1080p", "720p")
 * @returns {string} Output file path
 */
const cropAndResize = async (inputPath, aspectRatio = "9:16", resolution = "1080p") => {
  const outputPath = inputPath.replace(/\.mp4$/, `-${aspectRatio.replace(":", "x")}-${resolution}.mp4`);

  // Resolve aspect ratio and resolution
  const ar = ASPECT_RATIOS[aspectRatio] || ASPECT_RATIOS["9:16"];
  const targetHeight = RESOLUTIONS[resolution] || RESOLUTIONS["1080p"];

  try {
    // Get source dimensions
    const { width: srcW, height: srcH } = await getVideoDimensions(inputPath);
    console.log(`[Cropper] Source: ${srcW}x${srcH}, Target: ${aspectRatio} @ ${resolution}`);

    // Compute crop/scale params
    const { cropW, cropH, cropX, cropY, scaleW, scaleH } = computeCropParams(srcW, srcH, ar, targetHeight);
    const filterStr = `crop=${cropW}:${cropH}:${cropX}:${cropY},scale=${scaleW}:${scaleH}:flags=lanczos`;

    console.log(`[Cropper] Filter: ${filterStr}`);

    // Run FFmpeg
    await new Promise((resolve, reject) => {
      const ffmpeg = spawn("ffmpeg", [
        "-y",
        "-i", inputPath,
        "-vf", filterStr,
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "128k",
        outputPath
      ]);

      let stderr = "";
      ffmpeg.stderr.on("data", (data) => { stderr += data.toString(); });

      ffmpeg.on("close", (code) => {
        if (code === 0) {
          console.log(`[Cropper] Output: ${outputPath}`);
          resolve();
        } else {
          reject(new Error(`FFmpeg crop/resize failed (exit ${code}): ${stderr.slice(-300)}`));
        }
      });

      ffmpeg.on("error", (err) => reject(new Error(`FFmpeg not available: ${err.message}`)));
    });

    return outputPath;
  } catch (error) {
    console.error(`[Cropper] Failed: ${error.message}`);
    // Fallback: copy file as-is
    console.warn("[Cropper] Falling back to copy without crop/resize");
    await fs.copyFile(inputPath, outputPath);
    return outputPath;
  }
};

module.exports = {
  cropAndResize
};
