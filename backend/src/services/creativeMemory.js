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

const blendFeedback = async (userId, feedback) => {
  const updates = {};
  if (feedback.rating && feedback.rating >= 4) {
    updates.tone = feedback.toneHint || "warm visionary";
  }
  if (feedback.edits) {
    updates.themes = ["refined", "user-guided"];    
  }
  return updateMemory(userId, updates);
};

module.exports = {
  getMemory,
  updateMemory,
  blendFeedback
};
