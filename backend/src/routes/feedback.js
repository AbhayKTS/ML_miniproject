const express = require("express");
const { submitFeedback } = require("../controllers/feedbackController");
const { asyncHandler } = require("../middleware/asyncHandler");
const { requireAuth } = require("../utils/auth");

const router = express.Router();

router.post("/", requireAuth, asyncHandler(submitFeedback));

module.exports = router;
