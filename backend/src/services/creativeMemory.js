const { updateStore, getStore } = require("../data/store");

const defaultMemory = (userId) => ({
  userId,
  tone: "balanced",
  themes: ["exploratory"],
  visualStyle: "evocative",
  audioStyle: "ambient",
  culturalContext: "universal",
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

    // Enforce lock — if memory is locked, skip updates unless unlock is requested
    if (current.lock && updates.lock !== false) {
      console.log(`Creative memory for user ${userId} is locked. Skipping update.`);
      return store;
    }

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

  // Enforce lock — don't blend if memory is locked
  if (currentMemory.lock) {
    console.log(`Creative memory for user ${userId} is locked. Skipping feedback blend.`);
    return { ...currentMemory, locked: true };
  }

  const updates = {};
  const { rating, edits, signals } = feedback;

  if (isEngineEnabled()) {
    const model = getProcessingModel();

    // Build signal description for the AI prompt
    let signalDescription = "";
    if (signals) {
      const parts = [];
      if (signals.reuse) parts.push("The user REUSED this output, indicating strong preference for this creative direction.");
      if (signals.acceptance) parts.push("The user ACCEPTED this output without edits, indicating satisfaction with the style and content.");
      signalDescription = parts.length ? `\nImplicit Signals: ${parts.join(" ")}` : "";
    }

    const prompt = `Analyze user feedback on a creative generation and suggest updates for the "creative memory" profile of this user.
      Current Memory: ${JSON.stringify(currentMemory)}
      User Rating: ${rating !== undefined ? `${rating}/5` : "Not provided"}
      User Edits/Comments: "${edits || "None"}"${signalDescription}
      
      Based on this feedback, suggest updates for: tone (description), themes (array of strings), visualStyle (short desc), audioStyle (short desc), and culturalContext (short desc).
      If the user reused or accepted the output, reinforce the current creative direction.
      If the rating is low, suggest meaningful pivots.
      Return ONLY a JSON object with the suggested updates. Do not include any other text.`;

    try {
      const result = await model.generateContent(prompt);
      const suggested = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());
      console.log(`AI suggested memory updates for ${userId}:`, suggested);
      Object.assign(updates, suggested);
    } catch (error) {
      console.warn("AI feedback blending failed, falling back to heuristic:", error.message || error);
    }
  } else {
    console.log(`AI engine disabled, using heuristic memory blend for ${userId}`);
  }

  // Heuristic fallback / supplement
  if (!Object.keys(updates).length) {
    // Implicit signals — reinforce or explore
    if (signals?.reuse) {
      // User reused output — reinforce current creative direction
      updates.tone = currentMemory.tone;
      if (!updates.themes) {
        updates.themes = [...new Set([...currentMemory.themes, "reinforced"])];
      }
    }
    if (signals?.acceptance) {
      // User accepted without edits — slight boost toward current style
      updates.visualStyle = currentMemory.visualStyle;
      updates.audioStyle = currentMemory.audioStyle;
    }

    // Explicit rating
    if (rating !== undefined) {
      if (rating >= 4) {
        updates.tone = updates.tone || currentMemory.tone;
      } else if (rating <= 2) {
        // Low rating — shift direction
        updates.tone = "exploring new directions";
        updates.themes = [...new Set([...currentMemory.themes, "pivoting"])];
      }
    }

    // User edits indicate refinement needs
    if (edits && !updates.themes) {
      updates.themes = [...new Set([...currentMemory.themes, "refined"])];
    }
  }

  if (Object.keys(updates).length === 0) {
    return currentMemory;
  }

  return updateMemory(userId, updates);
};

module.exports = {
  getMemory,
  updateMemory,
  blendFeedback
};
};
