<<<<<<< HEAD
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
=======
const { supabase, isSupabaseEnabled } = require("../services/supabaseClient");
const { updateStore } = require("../data/store");

/**
 * Inserts a generation record into the database.
 * @param {Object} generation - The generation entry to save
 * @returns {Promise<Object>} The saved generation entry
 */
const insertGeneration = async (generation) => {
  if (isSupabaseEnabled()) {
    const table = generation.modality === 'text' ? 'text_generations' : 
                  generation.modality === 'image' ? 'image_generations' : 'audio_generations';
    const { data, error } = await supabase.from(table).insert([generation]).select().single();
    if (error) {
      console.warn("Supabase insert failed, falling back to local store", error);
    } else {
      return data;
    }
  }
  
  // Fallback to local store
  await updateStore((store) => {
    if (generation.modality === "text") {
      store.text_generations.push(generation);
    } else if (generation.modality === "image") {
      store.image_generations.push(generation);
    } else {
      store.audio_generations.push(generation);
    }
    return store;
  });
  return generation;
};

module.exports = { insertGeneration };
>>>>>>> 4fc186f5da84b6998f44fdef320d46c05e6f9ec4
