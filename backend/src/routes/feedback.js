const express = require("express");
<<<<<<< HEAD
const { submitFeedback } = require("../controllers/feedbackController");
const { asyncHandler } = require("../middleware/asyncHandler");
=======
const { recordFeedback } = require("../services/feedbackEngine");
const { feedbackSchema, validate } = require("../utils/validators");
>>>>>>> 4fc186f5da84b6998f44fdef320d46c05e6f9ec4
const { requireAuth } = require("../utils/auth");

const router = express.Router();

<<<<<<< HEAD
router.post("/", requireAuth, asyncHandler(submitFeedback));
=======
router.post("/", requireAuth, async (req, res) => {
  const validation = validate(feedbackSchema, req.body);
  if (!validation.success) {
    return res.status(400).json({ error: "Invalid payload", details: validation.errors });
  }

  const userId = req.user?.id || validation.data.userId || "guest";
  const entry = await recordFeedback({
    userId,
    generationId: validation.data.generationId,
    rating: validation.data.rating,
    edits: validation.data.edits,
    signals: validation.data.signals
  });

  res.json(entry);
});
>>>>>>> 4fc186f5da84b6998f44fdef320d46c05e6f9ec4

module.exports = router;
