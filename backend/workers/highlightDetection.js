const path = require("path");
const { generateWithFallback, isEngineEnabled } = require("../src/services/engineClient");

// Generate user-friendly clip titles
const CLIP_TITLES = [
  ["Viral Hook", "Opening Hook", "Attention Grabber", "Hot Start"],
  ["Key Insight", "Core Message", "Golden Nugget", "Value Drop"],
  ["Surprise Moment", "Plot Twist", "Wow Factor", "Climax Point"]
];

const getClipTitle = (index, clipNumber) => {
  const titles = CLIP_TITLES[index] || CLIP_TITLES[0];
  const title = titles[Math.floor(Math.random() * titles.length)];
  return `Clip ${String(clipNumber).padStart(2, "0")} · ${title}`;
};

const detectHighlights = async (videoPath, { minDuration = 15, maxDuration = 60 } = {}) => {
  const baseName = path.basename(videoPath);
  
  if (isEngineEnabled()) {
    const prompt = `Analyze this transcript summary for highlight moments. Provide 3 timestamps with titles between ${minDuration}-${maxDuration} seconds.`;
    try {
      const { result, provider } = await generateWithFallback(prompt);
      console.log(`Highlight detection via ${provider}`);
      return [
        { title: getClipTitle(0, 1), start: 10, end: 10 + minDuration, score: 0.9, note: result },
        { title: getClipTitle(1, 2), start: 60, end: 60 + minDuration, score: 0.88, note: result },
        { title: getClipTitle(2, 3), start: 120, end: 120 + minDuration, score: 0.86, note: result }
      ];
    } catch (error) {
      console.warn("All AI providers failed for highlight detection, using defaults.");
    }
  }

  // Fallback: use predefined highlight points
  console.log("Using default highlight detection (no AI)");
  return [
    {
      title: getClipTitle(0, 1),
      start: 12,
      end: 12 + Math.min(maxDuration, Math.max(minDuration, 28)),
      score: 0.92
    },
    {
      title: getClipTitle(1, 2),
      start: 74,
      end: 74 + Math.min(maxDuration, Math.max(minDuration, 24)),
      score: 0.87
    },
    {
      title: getClipTitle(2, 3),
      start: 142,
      end: 142 + Math.min(maxDuration, Math.max(minDuration, 36)),
      score: 0.9
    }
  ];
};

module.exports = {
  detectHighlights
};
