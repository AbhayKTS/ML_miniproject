const fs = require("fs/promises");
const path = require("path");

const dataPath = path.join(process.cwd(), "data", "db.json");
let cache = null;

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
  await fs.writeFile(dataPath, JSON.stringify(store, null, 2));
  return store;
};

const getStore = async () => {
  return ensureStore();
};

const updateStore = async (mutator) => {
  const store = await ensureStore();
  const updated = (await mutator(store)) || store;
  return saveStore(updated);
};

module.exports = {
  getStore,
  updateStore
};
