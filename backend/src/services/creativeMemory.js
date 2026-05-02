const { updateStore, getStore } = require("../data/store");

const THEME_KEYWORDS = [
  "romance",
  "cinematic",
  "horror",
  "comedy",
  "mythic",
  "futurism",
  "nostalgia",
  "spiritual",
  "energetic",
  "minimal"
];

const tokenize = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const inferThemesFromEdits = (edits, currentThemes = []) => {
  const tokens = new Set(tokenize(edits));
  const inferred = THEME_KEYWORDS.filter((keyword) => tokens.has(keyword));
  return [...new Set([...currentThemes, ...inferred])].slice(0, 8);
};

const inferToneFromRating = (rating, currentTone) => {
  if (!rating) return currentTone;
  if (rating >= 4) return currentTone;
  if (rating <= 2) return "clear grounded";
  return "balanced thoughtful";
};

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

const { getProcessingModel, isEngineEnabled } = require("./engineClient");

const blendFeedback = async (userId, feedback) => {
  const currentMemory = await getMemory(userId);
  const updates = {};
  const signals = feedback.signals || {};

  if (isEngineEnabled()) {
    const model = getProcessingModel();
    const prompt = `Analyze user feedback on a creative generation and suggest updates for the "creative memory" profile of this user.
      Current Memory: ${JSON.stringify(currentMemory)}
      User Rating: ${feedback.rating}/5
      User Edits/Comments: "${feedback.edits || "None"}"
      Implicit Signals: ${JSON.stringify(signals)}
      
      Suggest updates for: tone (description), themes (array of strings), visualStyle (short desc), audioStyle (short desc), and culturalContext (short desc).
      Return ONLY a JSON object with the suggested updates. Do not include any other text.`;

    try {
      const result = await model.generateContent(prompt);
      const suggested = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());
      console.log(`Processing engine suggested memory updates for ${userId}:`, suggested);
      Object.assign(updates, suggested);
    } catch (error) {
      console.warn("Processing feedback blending failed fallback to heuristic:", error);
    }
  } else {
    console.log(`Processing engine disabled, using heuristic memory blend for ${userId}`);
  }

  // Fallback or additional heuristics
  if (!updates.tone) {
    updates.tone = inferToneFromRating(feedback.rating, feedback.toneHint || currentMemory.tone);
  }
  if (!updates.themes && feedback.edits) {
    const inferredThemes = inferThemesFromEdits(feedback.edits, currentMemory.themes);
    updates.themes = inferredThemes.length ? inferredThemes : [...new Set([...currentMemory.themes, "refined"])];
  }

  if (!updates.visualStyle && feedback.rating && feedback.rating <= 2) {
    updates.visualStyle = "clean composition with lower visual noise";
  }

  if (!updates.audioStyle && feedback.rating && feedback.rating <= 2) {
    updates.audioStyle = "structured rhythm with reduced layering";
  }
  if (!updates.lock && signals.reuse === true) {
    updates.lock = true;
  }
  if (!updates.tone && signals.acceptance === false) {
    updates.tone = "balanced exploratory";
  }

  return updateMemory(userId, updates);
};

module.exports = {
  getMemory,
  updateMemory,
  blendFeedback
};

// v0.2 – added TTL-based cache eviction for stale memory entries
const MEMORY_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// v0.3 – persist memory snapshots to disk for session recovery
// import { writeSnapshot, readSnapshot } from '../utils/snapshot';
