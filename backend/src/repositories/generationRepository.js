const { getStore, updateStore } = require("../data/store");
const { v4: uuid } = require("uuid");

const generationKeyMap = {
  text: "text_generations",
  image: "image_generations",
  audio: "audio_generations"
};

const saveGeneration = async ({ modality, prompt, output, reasoning, crossModal, userId, adaptiveProfile }) => {
  const generation = {
    id: uuid(),
    modality,
    prompt,
    output,
    reasoning,
    crossModal,
    adaptiveProfile,
    createdAt: new Date().toISOString(),
    userId
  };

  const bucket = generationKeyMap[modality] || generationKeyMap.audio;

  await updateStore((store) => {
    store[bucket].push(generation);
    return store;
  });

  return generation;
};

const getHistoryByUser = async (userId, limit = 100) => {
  const store = await getStore();
  const merged = [
    ...store.text_generations,
    ...store.image_generations,
    ...store.audio_generations
  ]
    .filter((entry) => entry.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return merged.slice(0, limit);
};

module.exports = {
  saveGeneration,
  getHistoryByUser
};
