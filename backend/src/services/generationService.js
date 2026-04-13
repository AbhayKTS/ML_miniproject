const { buildGenerationPlan } = require("./creativeEngine");
const { getMemory } = require("./creativeMemory");
const { findByUserId } = require("../repositories/feedbackRepository");
const { saveGeneration } = require("../repositories/generationRepository");
const {
  summarizeFeedback,
  buildAdaptiveProfile,
  applyAdaptiveControls
} = require("../ai-engine/adaptiveLearning");

const generate = async ({ modality, prompt, controls, constraints, userId }) => {
  const memory = await getMemory(userId);
  const feedbackHistory = await findByUserId(userId, 30);
  const feedbackSummary = summarizeFeedback(feedbackHistory);
  const adaptiveProfile = buildAdaptiveProfile({ memory, feedbackSummary });
  const adaptiveControls = applyAdaptiveControls({ controls, adaptiveProfile });

  const plan = await buildGenerationPlan({
    modality,
    prompt,
    controls: adaptiveControls,
    constraints,
    memory
  });
  const safeOutput = typeof plan?.output === "string" ? plan.output : "";
  return saveGeneration({
    modality,
    prompt,
    output: safeOutput,
    reasoning: plan.intent,
    crossModal: plan.crossModal,
    userId,
    adaptiveProfile
  });
};

module.exports = {
  generate
};
