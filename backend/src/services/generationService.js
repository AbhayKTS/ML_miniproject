const { updateStore } = require("../data/store");
const { buildGenerationPlan } = require("./aiEngine");
const { getMemory } = require("./creativeMemory");
const { v4: uuid } = require("uuid");

const generate = async ({ modality, prompt, controls, constraints, userId }) => {
  const memory = await getMemory(userId);
  const plan = buildGenerationPlan({ modality, prompt, controls, constraints, memory });
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
    if (modality === "text") {
      store.text_generations.push(generation);
    } else if (modality === "image") {
      store.image_generations.push(generation);
    } else {
      store.audio_generations.push(generation);
    }
    return store;
  });

  return generation;
};

module.exports = {
  generate
};
