const { insertGeneration } = require("../repositories/generationRepository");
const { buildGenerationPlan } = require("./creativeEngine");
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

  await insertGeneration(generation);

  return generation;
};

module.exports = {
  generate
};
