const { generate } = require("../services/generationService");
const { generateBaseSchema, validate } = require("../utils/validators");

const createGenerationHandler = (modality) => async (req, res) => {
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
    userId
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

module.exports = {
  createGenerationHandler,
  generateTripletWorkflow
};
