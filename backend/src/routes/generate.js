const express = require("express");
const { generate } = require("../services/generationService");
const { generateBaseSchema, validate } = require("../utils/validators");

const router = express.Router();

const handleGeneration = (modality) => async (req, res) => {
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

router.post("/text", handleGeneration("text"));
router.post("/image", handleGeneration("image"));
router.post("/audio", handleGeneration("audio"));

module.exports = router;
