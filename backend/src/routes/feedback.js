const express = require("express");
const { recordFeedback } = require("../services/feedbackEngine");
const { feedbackSchema, validate } = require("../utils/validators");
const { requireAuth } = require("../middleware/requireAuth");
const { catchAsync } = require("../middleware/catchAsync");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  catchAsync(async (req, res) => {
    const validation = validate(feedbackSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Invalid payload", details: validation.errors });
    }

    const userId = req.user.id;
    const entry = await recordFeedback({
      userId,
      generationId: validation.data.generationId,
      rating: validation.data.rating,
      edits: validation.data.edits,
      signals: validation.data.signals
    });

    res.json(entry);
  })
);

module.exports = router;
