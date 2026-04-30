const { generate } = require("../services/generationService");
const { generateBaseSchema, validate } = require("../utils/validators");
const { getMemory } = require("../services/creativeMemory");
const { findByUserId } = require("../repositories/feedbackRepository");
const { summarizeFeedback } = require("../ai-engine/adaptiveLearning");

const createGenerationHandler = (modality, options = {}) => async (req, res) => {
  const validation = validate(generateBaseSchema, req.body);
  if (!validation.success) {
    return res.status(400).json({ error: "Invalid payload", details: validation.errors });
  }

  const userId = req.user?.id || validation.data.userId || "guest";
  const result = await generate({
    modality,
    prompt: validation.data.prompt,
    controls: validation.data.controls,
    constraints: validation.data.constraints,
    userId,
    mode: options.mode || req.query.mode
  });

  return res.json(result);
};

const generateTripletWorkflow = async (req, res) => {
  const validation = validate(generateBaseSchema, req.body);
  if (!validation.success) {
    return res.status(400).json({ error: "Invalid payload", details: validation.errors });
  }

  const userId = req.user?.id || validation.data.userId || "guest";
  const prompt = validation.data.prompt;
  const controls = validation.data.controls;
  const constraints = validation.data.constraints;

  const text = await generate({ modality: "text", prompt, controls, constraints, userId });
  const image = await generate({
    modality: "image",
    prompt: `${prompt}\nNarrative anchor: ${text.output.slice(0, 240)}`,
    controls,
    constraints,
    userId
  });
  const audio = await generate({
    modality: "audio",
    prompt: `${prompt}\nNarrative anchor: ${text.output.slice(0, 240)}`,
    controls,
    constraints,
    userId
  });

  return res.json({
    workflow: "text-image-audio",
    outputs: { text, image, audio }
  });
};

const suggestPrompts = async (req, res) => {
  const partial = String(req.query.q || "").trim();
  const userId = req.user?.id || String(req.query.userId || "guest");

  if (!partial) {
    return res.json({ suggestions: [] });
  }

  const memory = await getMemory(userId);
  const feedbackSummary = summarizeFeedback(await findByUserId(userId, 20));
  const anchors = [...new Set([...(memory?.themes || []), ...(feedbackSummary.frequentKeywords || [])])]
    .slice(0, 5)
    .join(", ");

  const suggestions = [
    `${partial} in a ${memory.tone} tone`,
    `${partial} with ${anchors || "cinematic"} motifs`,
    `${partial} inspired by ${memory.culturalContext}`
  ];

  return res.json({ suggestions });
};

module.exports = {
  createGenerationHandler,
  generateTripletWorkflow,
  suggestPrompts
};
