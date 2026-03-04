const express = require("express");
const { generate } = require("../services/generationService");
const { generateBaseSchema, validate } = require("../utils/validators");
const { requireAuth } = require("../middleware/requireAuth");
const { catchAsync } = require("../middleware/catchAsync");

const router = express.Router();

const handleGeneration = (modality) =>
  catchAsync(async (req, res) => {
    const validation = validate(generateBaseSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Invalid payload", details: validation.errors });
    }

    const userId = req.user.id;
    const result = await generate({
      modality,
      prompt: validation.data.prompt,
      controls: validation.data.controls,
      constraints: validation.data.constraints,
      userId
    });

    return res.json(result);
  });

router.post("/text", requireAuth, handleGeneration("text"));
router.post("/image", requireAuth, handleGeneration("image"));
router.post("/audio", requireAuth, handleGeneration("audio"));

module.exports = router;
