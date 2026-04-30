const express = require("express");
const { generate } = require("../services/generationService");
const { generateBaseSchema, validate } = require("../utils/validators");
const { requireAuth } = require("../utils/auth");

const router = express.Router();

const handleGeneration = (modality) => async (req, res) => {
  const validation = validate(generateBaseSchema, req.body);
  if (!validation.success) {
    return res.status(400).json({ error: "Invalid payload", details: validation.errors });
  }

  const userId = req.user?.id || validation.data.userId || "guest";
  try {
    const result = await generate({
      modality,
      prompt: validation.data.prompt,
      controls: validation.data.controls,
      constraints: validation.data.constraints,
      userId
    });

    return res.json(result);
  } catch (err) {
    console.error("Generation route error:", err);
    return res.status(500).json({ error: "Content generation failed", details: err.message });
  }
};

router.post("/text", requireAuth, handleGeneration("text"));
router.post("/image", requireAuth, handleGeneration("image"));
router.post("/audio", requireAuth, handleGeneration("audio"));

module.exports = router;
