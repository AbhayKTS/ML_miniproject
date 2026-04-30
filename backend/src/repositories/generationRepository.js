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
