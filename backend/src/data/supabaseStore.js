/**
 * Supabase-backed data store — production persistence layer.
 * Mirrors the store.js API so it can be swapped transparently via dataLayer.js.
 */
const { supabaseAdmin, isSupabaseEnabled } = require("../services/supabaseClient");

// ─── Table name map (JSON collection → SQL table) ────────────
const TABLE_MAP = {
  users: "users",
  sessions: "sessions",
  creative_memory: "creative_memory",
  text_generations: "text_generations",
  image_generations: "image_generations",
  audio_generations: "audio_generations",
  feedback_logs: "feedback_logs",
  projects: "projects",
  assets: "assets",
  videos: "videos",
  clip_jobs: "clip_jobs",
  clips: "clips",
  captions: "captions",
  exports: "exports"
};

// ─── Generic CRUD helpers ─────────────────────────────────────

/**
 * Get records from a Supabase table.
 * @param {string} collection - Collection/table name
 * @param {Object} [filter] - Key-value pairs for WHERE equality
 * @param {Object} [options] - { limit, offset, orderBy, ascending }
 */
const getCollection = async (collection, filter = {}, options = {}) => {
  const table = TABLE_MAP[collection];
  if (!table) throw new Error(`Unknown collection: ${collection}`);
  if (!supabaseAdmin) throw new Error("Supabase is not configured");

  let query = supabaseAdmin.from(table).select("*");

  for (const [key, value] of Object.entries(filter)) {
    query = query.eq(key, value);
  }

  if (options.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending ?? false });
  }
  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Supabase getCollection(${collection}) failed: ${error.message}`);
  return data || [];
};

/**
 * Get a single record by ID.
 */
const getRecord = async (collection, id) => {
  const table = TABLE_MAP[collection];
  if (!table) throw new Error(`Unknown collection: ${collection}`);
  if (!supabaseAdmin) throw new Error("Supabase is not configured");

  const { data, error } = await supabaseAdmin.from(table).select("*").eq("id", id).single();
  if (error && error.code !== "PGRST116") {
    throw new Error(`Supabase getRecord(${collection}, ${id}) failed: ${error.message}`);
  }
  return data || null;
};

/**
 * Find a single record matching a filter.
 */
const findRecord = async (collection, filter = {}) => {
  const table = TABLE_MAP[collection];
  if (!table) throw new Error(`Unknown collection: ${collection}`);
  if (!supabaseAdmin) throw new Error("Supabase is not configured");

  let query = supabaseAdmin.from(table).select("*");
  for (const [key, value] of Object.entries(filter)) {
    query = query.eq(key, value);
  }

  const { data, error } = await query.limit(1).single();
  if (error && error.code !== "PGRST116") {
    throw new Error(`Supabase findRecord(${collection}) failed: ${error.message}`);
  }
  return data || null;
};

/**
 * Insert a record into a Supabase table.
 */
const insertRecord = async (collection, record) => {
  const table = TABLE_MAP[collection];
  if (!table) throw new Error(`Unknown collection: ${collection}`);
  if (!supabaseAdmin) throw new Error("Supabase is not configured");

  // Convert camelCase keys to snake_case for SQL tables
  const snaked = toSnakeCase(record);

  const { data, error } = await supabaseAdmin.from(table).insert(snaked).select().single();
  if (error) throw new Error(`Supabase insertRecord(${collection}) failed: ${error.message}`);
  return toCamelCase(data);
};

/**
 * Update a record by ID.
 */
const updateRecord = async (collection, id, updates) => {
  const table = TABLE_MAP[collection];
  if (!table) throw new Error(`Unknown collection: ${collection}`);
  if (!supabaseAdmin) throw new Error("Supabase is not configured");

  const snaked = toSnakeCase(updates);

  const { data, error } = await supabaseAdmin.from(table).update(snaked).eq("id", id).select().single();
  if (error) throw new Error(`Supabase updateRecord(${collection}, ${id}) failed: ${error.message}`);
  return toCamelCase(data);
};

/**
 * Delete a record by ID.
 */
const deleteRecord = async (collection, id) => {
  const table = TABLE_MAP[collection];
  if (!table) throw new Error(`Unknown collection: ${collection}`);
  if (!supabaseAdmin) throw new Error("Supabase is not configured");

  const { error } = await supabaseAdmin.from(table).delete().eq("id", id);
  if (error) throw new Error(`Supabase deleteRecord(${collection}, ${id}) failed: ${error.message}`);
  return true;
};

// ─── Case conversion helpers ──────────────────────────────────

const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
};

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = value;
  }
  return result;
};

// ─── Compatibility layer (mirror store.js API) ───────────────

/**
 * getStore() for Supabase — returns a proxy that fetches from DB on access.
 * Note: For Supabase mode, prefer using getCollection/insertRecord/etc. directly.
 * This exists for backward compatibility during migration.
 */
const getStore = async () => {
  console.warn("getStore() called in Supabase mode — use getCollection() for better performance");
  const collections = Object.keys(TABLE_MAP);
  const store = {};
  for (const col of collections) {
    try {
      store[col] = await getCollection(col);
    } catch {
      store[col] = [];
    }
  }
  return store;
};

/**
 * updateStore() for Supabase — NOT recommended. Use insertRecord/updateRecord directly.
 */
const updateStore = async (_mutator) => {
  throw new Error(
    "updateStore() is not supported in Supabase mode. Use insertRecord/updateRecord/deleteRecord instead."
  );
};

module.exports = {
  getStore,
  updateStore,
  getCollection,
  getRecord,
  findRecord,
  insertRecord,
  updateRecord,
  deleteRecord,
  isSupabaseEnabled,
  toSnakeCase,
  toCamelCase
};
