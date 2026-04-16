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
// Simple JSON-file feedback repository
const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/feedback.json');

async function load() {
  try { return JSON.parse(await fs.readFile(DB_PATH, 'utf8')); }
  catch { return []; }
}

async function save(entry) {
  const data = await load();
  data.push(entry);
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  return entry;
}

async function findByUser(uid) {
  return (await load()).filter(e => e.uid === uid);
}

module.exports = { save, findByUser };
