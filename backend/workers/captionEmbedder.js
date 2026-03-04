const fs = require("fs/promises");
const path = require("path");
const { spawn } = require("child_process");

/**
 * Generate an ASS subtitle file from caption word timestamps.
 * @param {string} outputPath - Path to write the .ass file
 * @param {string} text - Full transcript text
 * @param {Array<{word: string, start: number, end: number}>} words - Word-level timestamps
 * @param {Object} style - Caption style options
 */
const generateSubtitleFile = async (outputPath, text, words = [], style = {}) => {
  const {
    fontName = "Arial",
    fontSize = 18,
    primaryColor = "&H00FFFFFF", // white
    outlineColor = "&H00000000", // black
    alignment = 2, // bottom-center
    bold = 1,
    outline = 2,
    shadow = 1,
    marginV = 30
  } = style;

  // ASS header
  let ass = `[Script Info]
Title: Chhaya Captions
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,${fontName},${fontSize},${primaryColor},&H000000FF,${outlineColor},&H80000000,${bold},0,0,0,100,100,0,0,1,${outline},${shadow},${alignment},10,10,${marginV},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  if (words.length > 0) {
    // Group words into subtitle chunks (3-5 words per line for readability)
    const chunkSize = 4;
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize);
      const startTime = formatASSTime(chunk[0].start);
      const endTime = formatASSTime(chunk[chunk.length - 1].end + 0.3);
      const lineText = chunk.map((w) => w.word).join(" ");
      ass += `Dialogue: 0,${startTime},${endTime},Default,,0,0,0,,${lineText}\n`;
    }
  } else if (text) {
    // Fallback: show full text for a standard duration
    ass += `Dialogue: 0,0:00:00.00,0:00:30.00,Default,,0,0,0,,${text.replace(/\n/g, "\\N")}\n`;
  }

  await fs.writeFile(outputPath, ass, "utf-8");
  return outputPath;
};

/**
 * Format seconds to ASS timestamp format: H:MM:SS.CC
 */
const formatASSTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const cs = Math.round((seconds % 1) * 100);
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
};

/**
 * Burn captions (subtitles) into a video using FFmpeg.
 * @param {string} inputPath - Input video file path
 * @param {string} outputPath - Output video file path
 * @param {Object} captionData - { text, words, style }
 */
const embedCaptions = async (inputPath, outputPath, captionData = {}) => {
  const { text = "", words = [], style = {} } = typeof captionData === "string"
    ? { text: captionData }
    : captionData;

  // Generate subtitle file
  const assPath = inputPath.replace(/\.[^.]+$/, ".ass");

  try {
    await generateSubtitleFile(assPath, text, words, style);
    console.log(`[CaptionEmbedder] Subtitle file generated: ${assPath}`);

    // Burn subtitles using FFmpeg ASS filter
    await new Promise((resolve, reject) => {
      // Escape special characters in the path for FFmpeg filter
      const escapedAssPath = assPath.replace(/([:\\'])/g, "\\$1").replace(/\[/g, "\\[").replace(/\]/g, "\\]");

      const ffmpeg = spawn("ffmpeg", [
        "-y",
        "-i", inputPath,
        "-vf", `ass=${escapedAssPath}`,
        "-c:a", "copy",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "23",
        outputPath
      ]);

      let stderr = "";
      ffmpeg.stderr.on("data", (data) => { stderr += data.toString(); });

      ffmpeg.on("close", (code) => {
        if (code === 0) {
          console.log(`[CaptionEmbedder] Captions burned successfully: ${outputPath}`);
          resolve();
        } else {
          reject(new Error(`FFmpeg caption burn failed (exit ${code}): ${stderr.slice(-300)}`));
        }
      });

      ffmpeg.on("error", (err) => reject(new Error(`FFmpeg not available: ${err.message}`)));
    });

    return outputPath;
  } catch (error) {
    console.error(`[CaptionEmbedder] Failed to burn captions: ${error.message}`);
    // Fallback: copy file without captions
    console.warn("[CaptionEmbedder] Falling back to copy without captions");
    await fs.copyFile(inputPath, outputPath);
    return outputPath;
  } finally {
    // Clean up temp subtitle file
    try { await fs.unlink(assPath); } catch { /* ignore */ }
  }
};

module.exports = {
  embedCaptions
};
