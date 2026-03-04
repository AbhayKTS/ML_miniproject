const { updateStore } = require("../data/store");
const { buildGenerationPlan } = require("./creativeEngine");
const { getMemory } = require("./creativeMemory");
const { v4: uuid } = require("uuid");

const VALID_MODALITIES = new Set(["text", "image", "audio"]);

const generate = async ({ modality, prompt, controls, constraints, userId }) => {
  if (!VALID_MODALITIES.has(modality)) {
    throw new Error(`Unsupported modality: ${modality}. Must be one of: text, image, audio`);
  }

  try {
    const memory = await getMemory(userId);
    const plan = await buildGenerationPlan({ modality, prompt, controls, constraints, memory });

    const generation = {
      id: uuid(),
      modality,
      prompt,
      output: plan.output,
      reasoning: plan.intent,
      crossModal: plan.crossModal,
      createdAt: new Date().toISOString(),
      userId
    };

    await updateStore((store) => {
      const collection = `${modality}_generations`;
      if (!store[collection]) {
        store[collection] = [];
      }
      store[collection].push(generation);
      return store;
    });

    return generation;
  } catch (error) {
    console.error(`Generation failed for modality=${modality}, userId=${userId}:`, error);
    throw error;
  }
};

module.exports = {
  generate
};
