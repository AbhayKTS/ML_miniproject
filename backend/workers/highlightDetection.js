const path = require("path");

const detectHighlights = async (videoPath, { minDuration = 15, maxDuration = 60 } = {}) => {
  const baseName = path.basename(videoPath);
  return [
    {
      title: `${baseName}-hook`,
      start: 12,
      end: 12 + Math.min(maxDuration, Math.max(minDuration, 28)),
      score: 0.92
    },
    {
      title: `${baseName}-insight`,
      start: 74,
      end: 74 + Math.min(maxDuration, Math.max(minDuration, 24)),
      score: 0.87
    },
    {
      title: `${baseName}-surprise`,
      start: 142,
      end: 142 + Math.min(maxDuration, Math.max(minDuration, 36)),
      score: 0.9
    }
  ];
};

module.exports = {
  detectHighlights
};
