const path = require("path");
const { getModel, isGeminiEnabled } = require("../src/services/geminiClient");

const detectHighlights = async (videoPath, { minDuration = 15, maxDuration = 60 } = {}) => {
  const baseName = path.basename(videoPath);
  if (isGeminiEnabled()) {
    const model = getModel();
    const prompt = `Analyze this transcript summary for highlight moments. Provide 3 timestamps with titles between ${minDuration}-${maxDuration} seconds.`;
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return [
        { title: `${baseName}-gemini-1`, start: 10, end: 10 + minDuration, score: 0.9, note: text },
        { title: `${baseName}-gemini-2`, start: 60, end: 60 + minDuration, score: 0.88, note: text },
        { title: `${baseName}-gemini-3`, start: 120, end: 120 + minDuration, score: 0.86, note: text }
      ];
    } catch (error) {
      console.warn("Gemini highlight detection failed, falling back.");
    }
  }

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
