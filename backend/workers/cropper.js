const fs = require("fs/promises");

const cropAndResize = async (inputPath, _aspectRatio, _resolution) => {
  const tempPath = inputPath.replace(/\.mp4$/, "-cropped.mp4");
  await fs.copyFile(inputPath, tempPath);
  return tempPath;
};

module.exports = {
  cropAndResize
};
