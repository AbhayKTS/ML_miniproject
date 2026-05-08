const express = require("express");
<<<<<<< HEAD
const {
  createGenerationHandler,
  generateTripletWorkflow,
  suggestPrompts
} = require("../controllers/generationController");
const { asyncHandler } = require("../middleware/asyncHandler");
=======
const { generate } = require("../services/generationService");
const { generateBaseSchema, validate } = require("../utils/validators");
>>>>>>> 4fc186f5da84b6998f44fdef320d46c05e6f9ec4
const { requireAuth } = require("../utils/auth");

const router = express.Router();

<<<<<<< HEAD
router.post("/text", requireAuth, asyncHandler(createGenerationHandler("text")));
router.post("/image", requireAuth, asyncHandler(createGenerationHandler("image")));
router.post("/audio", requireAuth, asyncHandler(createGenerationHandler("audio")));
router.post("/video", requireAuth, asyncHandler(createGenerationHandler("video")));
router.post("/prompt/text", requireAuth, asyncHandler(createGenerationHandler("text", { mode: "prompt" })));
router.post("/prompt/image", requireAuth, asyncHandler(createGenerationHandler("image", { mode: "prompt" })));
router.post("/prompt/audio", requireAuth, asyncHandler(createGenerationHandler("audio", { mode: "prompt" })));
router.post("/workflow/triplet", requireAuth, asyncHandler(generateTripletWorkflow));
router.get("/suggest", requireAuth, asyncHandler(suggestPrompts));
=======
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
    console.error("Generation route error:", err.message);
    console.error("Stack:", err.stack);
    return res.status(500).json({ error: "Content generation failed", details: err.message });
  }
};

router.post("/text", requireAuth, handleGeneration("text"));
router.post("/image", requireAuth, handleGeneration("image"));
router.post("/audio", requireAuth, handleGeneration("audio"));
>>>>>>> 4fc186f5da84b6998f44fdef320d46c05e6f9ec4

module.exports = router;
