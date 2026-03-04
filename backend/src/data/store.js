const fs = require("fs/promises");
const path = require("path");

const dataPath = path.resolve(__dirname, "../../data/db.json");
let cache = null;
let writeQueue = Promise.resolve(); // Serialize writes to prevent race conditions

const defaultStore = () => ({
  users: [],
  sessions: [],
  creative_memory: [],
  text_generations: [],
  image_generations: [],
  audio_generations: [],
  feedback_logs: [],
  projects: [],
  assets: [],
  videos: [],
  clip_jobs: [],
  clips: [],
  captions: [],
  exports: []
});

const ensureStore = async () => {
  if (cache) {
    return cache;
  }

  try {
    const raw = await fs.readFile(dataPath, "utf-8");
    cache = JSON.parse(raw);
  } catch (error) {
    cache = defaultStore();
    await fs.mkdir(path.dirname(dataPath), { recursive: true });
    await fs.writeFile(dataPath, JSON.stringify(cache, null, 2));
  }

  return cache;
};

const saveStore = async (store) => {
  cache = store;
  // Atomic write: write to temp file then rename
  const tmpPath = dataPath + ".tmp";
  await fs.writeFile(tmpPath, JSON.stringify(store, null, 2));
  await fs.rename(tmpPath, dataPath);
  return store;
};

const getStore = async () => {
  return ensureStore();
};

// Serialized writes — each updateStore call waits for the previous to finish
const updateStore = async (mutator) => {
  const doUpdate = async () => {
    const store = await ensureStore();
    const updated = (await mutator(store)) || store;
    return saveStore(updated);
  };

  // Chain onto the write queue to prevent concurrent write races
  writeQueue = writeQueue.then(doUpdate).catch((err) => {
    console.error("Store write error:", err);
    throw err;
  });

  return writeQueue;
};

module.exports = {
  getStore,
  updateStore
};
