const { supabase, isSupabaseEnabled } = require("../services/supabaseClient");
const { updateStore } = require("../data/store");

/**
 * Inserts a feedback record into the database.
 * @param {Object} entry - The feedback entry to save
 * @returns {Promise<Object>} The saved feedback entry
 */
const insertFeedback = async (entry) => {
  if (isSupabaseEnabled()) {
    const { data, error } = await supabase.from('feedback_logs').insert([entry]).select().single();
    if (error) {
      console.warn("Supabase insert failed, falling back to local store", error);
    } else {
      return data;
    }
  }
  
  // Fallback to local store
  await updateStore((store) => {
    store.feedback_logs.push(entry);
    return store;
  });
  return entry;
};

module.exports = { insertFeedback };
