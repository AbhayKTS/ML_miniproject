const path = require("path");
const fs = require("fs/promises");
const { spawn } = require("child_process");
const { getProcessingModel, isEngineEnabled } = require("../src/services/engineClient");

/**
 * Extract audio from a video/clip file to a temporary WAV file using FFmpeg.
 */
const extractAudio = (inputPath) => {
  const outputPath = inputPath.replace(/\.[^.]+$/, ".wav");
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-y",
      "-i", inputPath,
      "-vn",                  // No video
      "-acodec", "pcm_s16le", // 16-bit PCM WAV
      "-ar", "16000",          // 16kHz sample rate (optimal for speech recognition)
      "-ac", "1",              // Mono
      outputPath
    ]);

    let stderr = "";
    ffmpeg.stderr.on("data", (data) => { stderr += data.toString(); });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        reject(new Error(`Audio extraction failed (exit ${code}): ${stderr.slice(-200)}`));
      }
    });

    ffmpeg.on("error", (err) => reject(new Error(`FFmpeg not available: ${err.message}`)));
  });
};

/**
 * Use FFmpeg's speech detection to get basic word timing.
 * This is a lightweight alternative when no AI API is available.
 */
const detectSpeechSegments = (audioPath) => {
  return new Promise((resolve) => {
    let stderr = "";

    const ffmpeg = spawn("ffmpeg", [
      "-i", audioPath,
      "-af", "silencedetect=noise=-30dB:d=0.5",
      "-f", "null",
      "-"
    ]);

    ffmpeg.stderr.on("data", (data) => { stderr += data.toString(); });

    ffmpeg.on("close", () => {
      const segments = [];
      const lines = stderr.split("\n");
      let silenceEnd = 0;

      for (const line of lines) {
        const endMatch = line.match(/silence_end: ([\d.]+)/);
        const startMatch = line.match(/silence_start: ([\d.]+)/);

        if (endMatch) {
          silenceEnd = parseFloat(endMatch[1]);
        }
        if (startMatch) {
          const silenceStart = parseFloat(startMatch[1]);
          if (silenceStart > silenceEnd && silenceStart - silenceEnd > 0.3) {
            segments.push({
              start: Math.round(silenceEnd * 100) / 100,
              end: Math.round(silenceStart * 100) / 100
            });
          }
        }
      }

      resolve(segments);
    });

    ffmpeg.on("error", () => resolve([]));
  });
};

/**
 * Transcribe audio from a clip using Gemini AI or FFmpeg-based speech detection fallback.
 * @param {string} clipPath - Path to the video/audio clip file
 * @returns {{ text: string, words: Array<{ word: string, start: number, end: number }> }}
 */
const transcribeWithWhisper = async (clipPath) => {
  let audioPath = null;

  try {
    // Step 1: Extract audio from clip
    audioPath = await extractAudio(clipPath);
    console.log(`[Transcribe] Audio extracted to ${audioPath}`);

    // Step 2: Try Gemini with actual audio file data
    if (isEngineEnabled()) {
      try {
        const model = getProcessingModel();
        const audioBuffer = await fs.readFile(audioPath);
        const audioBase64 = audioBuffer.toString("base64");

        const result = await model.generateContent([
          {
            inlineData: {
              mimeType: "audio/wav",
              data: audioBase64
            }
          },
          {
            text: `Transcribe this audio clip precisely. Return a JSON object with:
- "text": the full transcription text
- "words": array of { "word": string, "start": number (seconds), "end": number (seconds) }
Return ONLY the JSON object. No commentary.`
          }
        ]);

        const rawText = result.response.text().replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(rawText);

        if (parsed.text && Array.isArray(parsed.words)) {
          console.log(`[Transcribe] Gemini transcription: ${parsed.words.length} words`);
          return parsed;
        }
      } catch (error) {
        console.warn("[Transcribe] Gemini transcription failed, falling back:", error.message);
      }
    }

    // Step 3: Fallback — use FFmpeg speech detection for segment timing
    const segments = await detectSpeechSegments(audioPath);
    console.log(`[Transcribe] FFmpeg detected ${segments.length} speech segments`);

    if (segments.length > 0) {
      // We can detect speech segments but can't get the actual words without an AI model.
      // Return segment boundaries as placeholder transcript.
      const words = segments.map((seg, i) => ({
        word: `[speech-${i + 1}]`,
        start: seg.start,
        end: seg.end
      }));

      return {
        text: `[Detected ${segments.length} speech segments. AI transcription unavailable — set GEMINI_API_KEY for full transcription.]`,
        words,
        segmentsDetected: segments.length,
        requiresAI: true
      };
    }

    // Step 4: No speech detected at all
    return {
      text: "[No speech detected in this clip]",
      words: [],
      segmentsDetected: 0,
      requiresAI: false
    };
  } catch (error) {
    console.error("[Transcribe] Failed:", error.message);
    return {
      text: `[Transcription failed: ${error.message}]`,
      words: [],
      error: error.message
    };
  } finally {
    // Clean up temp audio file
    if (audioPath) {
      try { await fs.unlink(audioPath); } catch { /* ignore */ }
    }
  }
};

module.exports = {
  transcribeWithWhisper
};
