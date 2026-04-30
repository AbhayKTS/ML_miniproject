const { insertFeedback } = require("../repositories/feedbackRepository");
const { blendFeedback } = require("./creativeMemory");
const { v4: uuid } = require("uuid");

const recordFeedback = async ({ userId, generationId, rating, edits, signals }) => {
  const entry = {
    id: uuid(),
    userId,
    generationId,
    rating,
    edits,
    signals,
    createdAt: new Date().toISOString()
  };

  console.log(`Recording feedback for user ${userId}, generation ${generationId}: rating=${rating}`);

  await insertFeedback(entry);

  console.log(`Starting feedback blending for user ${userId}...`);
  await blendFeedback(userId, { rating, edits, signals: signals || {} });
  console.log(`Feedback blending complete for user ${userId}`);

  return entry;
};

module.exports = {
  recordFeedback
};
