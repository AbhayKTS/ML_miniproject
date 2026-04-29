const { blendFeedback } = require("./creativeMemory");
const { saveFeedback } = require("../repositories/feedbackRepository");
const { logger } = require("../utils/logger");

const recordFeedback = async ({ userId, generationId, rating, edits, signals }) => {
  const entry = await saveFeedback({
    userId,
    generationId,
    rating,
    edits,
    signals
  });

  logger.info("feedback_recorded", { userId, generationId, rating });

  try {
    logger.info("feedback_blend_start", { userId });
    await blendFeedback(userId, { rating, edits });
    logger.info("feedback_blend_complete", { userId });
  } catch (error) {
    logger.warn("feedback_blend_failed", {
      userId,
      message: error?.message || String(error)
    });
  }

  return entry;
};

module.exports = {
  recordFeedback
};
