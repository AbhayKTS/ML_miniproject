const fs = require("fs/promises");
const { spawn } = require("child_process");

const sliceVideo = async (inputPath, outputPath, start, end) => {
  const duration = Math.max(1, end - start);

  try {
    await new Promise((resolve, reject) => {
      const ffmpeg = spawn("ffmpeg", [
        "-y",
        "-ss",
        `${start}`,
        "-i",
        inputPath,
        "-t",
        `${duration}`,
        "-c",
        "copy",
        outputPath
      ]);

      ffmpeg.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error("ffmpeg slicing failed"));
        }
      });
    });
  } catch (error) {
    await fs.copyFile(inputPath, outputPath);
  }

  return outputPath;
};

module.exports = {
  sliceVideo
};
