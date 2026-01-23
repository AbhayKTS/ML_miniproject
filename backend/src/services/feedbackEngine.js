const { updateStore } = require("../data/store");
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

  await updateStore((store) => {
    store.feedback_logs.push(entry);
    return store;
  });

  await blendFeedback(userId, { rating, edits });

  return entry;
};

module.exports = {
  recordFeedback
};
