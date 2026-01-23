const fs = require("fs/promises");

const embedCaptions = async (inputPath, outputPath, _captionsText) => {
  await fs.copyFile(inputPath, outputPath);
  return outputPath;
};

module.exports = {
  embedCaptions
};
