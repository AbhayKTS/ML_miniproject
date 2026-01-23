const { getModel, isGeminiEnabled } = require("../src/services/geminiClient");

const transcribeWithWhisper = async (_clipPath) => {
  if (isGeminiEnabled()) {
    const model = getModel();
    const prompt = "Generate a concise transcript with timestamps for a 30-second highlight clip.";
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return {
        text,
        words: text.split(" ").map((word, index) => ({
          word,
          start: index * 0.3,
          end: index * 0.3 + 0.25
        }))
      };
    } catch (error) {
      console.warn("Gemini transcription fallback triggered.");
    }
  }

  return {
    text: "This moment was incredible and the audience reaction spiked right here.",
    words: [
      { word: "This", start: 0.0, end: 0.3 },
      { word: "moment", start: 0.31, end: 0.62 },
      { word: "was", start: 0.63, end: 0.8 },
      { word: "incredible", start: 0.81, end: 1.2 },
      { word: "and", start: 1.21, end: 1.35 },
      { word: "the", start: 1.36, end: 1.48 },
      { word: "audience", start: 1.49, end: 1.9 },
      { word: "reaction", start: 1.91, end: 2.2 },
      { word: "spiked", start: 2.21, end: 2.5 },
      { word: "right", start: 2.51, end: 2.7 },
      { word: "here", start: 2.71, end: 2.9 }
    ]
  };
};

module.exports = {
  transcribeWithWhisper
};
