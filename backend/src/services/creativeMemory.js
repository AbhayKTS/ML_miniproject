const { updateStore, getStore } = require("../data/store");

const defaultMemory = (userId) => ({
  userId,
  tone: "warm visionary",
  themes: ["mythic futurism"],
  visualStyle: "painterly neon",
  audioStyle: "airy synth",
  culturalContext: "coastal ritual",
  lock: false,
  updatedAt: new Date().toISOString()
});

const getMemory = async (userId) => {
  const store = await getStore();
  return store.creative_memory.find((entry) => entry.userId === userId) || defaultMemory(userId);
};

const updateMemory = async (userId, updates) => {
  return updateStore((store) => {
    const existingIndex = store.creative_memory.findIndex((entry) => entry.userId === userId);
    const current = existingIndex >= 0 ? store.creative_memory[existingIndex] : defaultMemory(userId);
    const updated = {
      ...current,
      ...updates,
      themes: updates.themes || current.themes,
      updatedAt: new Date().toISOString()
    };
    if (existingIndex >= 0) {
      store.creative_memory[existingIndex] = updated;
    } else {
      store.creative_memory.push(updated);
    }
    return store;
  });
};

const { getModel, isGeminiEnabled } = require("./geminiClient");

const blendFeedback = async (userId, feedback) => {
  const currentMemory = await getMemory(userId);
  const updates = {};

  if (isGeminiEnabled()) {
    const model = getModel();
    const prompt = `Analyze user feedback on a creative generation and suggest updates for the AI's "creative memory" of this user.
      Current Memory: ${JSON.stringify(currentMemory)}
      User Rating: ${feedback.rating}/5
      User Edits/Comments: "${feedback.edits || "None"}"
      
      Suggest updates for: tone (description), themes (array of strings), visualStyle (short desc), audioStyle (short desc), and culturalContext (short desc).
      Return ONLY a JSON object with the suggested updates. Do not include any other text.`;

    try {
      const result = await model.generateContent(prompt);
      const suggested = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());
      console.log(`Gemini suggested memory updates for ${userId}:`, suggested);
      Object.assign(updates, suggested);
    } catch (error) {
      console.warn("Gemini feedback blending failed fallback to heuristic:", error);
    }
  } else {
    console.log(`Gemini disabled, using heuristic memory blend for ${userId}`);
  }

  // Fallback or additional heuristics
  if (!updates.tone && feedback.rating && feedback.rating >= 4) {
    updates.tone = feedback.toneHint || currentMemory.tone;
  }
  if (!updates.themes && feedback.edits) {
    updates.themes = [...new Set([...currentMemory.themes, "refined"])];
  }

  return updateMemory(userId, updates);
};

module.exports = {
  getMemory,
  updateMemory,
  blendFeedback
};
