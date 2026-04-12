const { getStore, updateStore } = require("../data/store");
const { v4: uuid } = require("uuid");

const saveFeedback = async ({ userId, generationId, rating, edits, signals }) => {
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

  return entry;
};

const findByUserId = async (userId, limit = 50) => {
  const store = await getStore();
  return store.feedback_logs
    .filter((entry) => entry.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
};

module.exports = {
  saveFeedback,
  findByUserId
};
