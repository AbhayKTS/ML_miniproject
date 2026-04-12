const express = require("express");
const {
  createGenerationHandler,
  generateTripletWorkflow
} = require("../controllers/generationController");
const { asyncHandler } = require("../middleware/asyncHandler");
const { requireAuth } = require("../utils/auth");

const router = express.Router();

router.post("/text", requireAuth, asyncHandler(createGenerationHandler("text")));
router.post("/image", requireAuth, asyncHandler(createGenerationHandler("image")));
router.post("/audio", requireAuth, asyncHandler(createGenerationHandler("audio")));
router.post("/workflow/triplet", requireAuth, asyncHandler(generateTripletWorkflow));

module.exports = router;
