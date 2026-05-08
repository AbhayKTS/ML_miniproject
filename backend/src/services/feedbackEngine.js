<<<<<<< HEAD
=======
const { insertFeedback } = require("../repositories/feedbackRepository");
>>>>>>> 4fc186f5da84b6998f44fdef320d46c05e6f9ec4
const { blendFeedback } = require("./creativeMemory");
const { saveFeedback } = require("../repositories/feedbackRepository");
const { logger } = require("../utils/logger");

const recordFeedback = async ({ userId, generationId, rating, edits, signals }) => {
  const entry = await saveFeedback({
    userId,
    generationId,
    rating,
    edits,
<<<<<<< HEAD
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
=======
    signals,
    createdAt: new Date().toISOString()
  };

  console.log(`Recording feedback for user ${userId}, generation ${generationId}: rating=${rating}`);

  await insertFeedback(entry);

  console.log(`Starting feedback blending for user ${userId}...`);
  await blendFeedback(userId, { rating, edits, signals: signals || {} });
  console.log(`Feedback blending complete for user ${userId}`);
>>>>>>> 4fc186f5da84b6998f44fdef320d46c05e6f9ec4

  return entry;
};

module.exports = {
  recordFeedback
};
