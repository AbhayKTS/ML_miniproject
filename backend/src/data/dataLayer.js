/**
 * Data layer factory — returns the appropriate store based on environment config.
 *
 * When SUPABASE_URL is set → uses Supabase (production)
 * When SUPABASE_URL is NOT set → uses JSON file store (local dev)
 */
const { isSupabaseEnabled } = require("../services/supabaseClient");

let _dataLayer = null;

const getDataLayer = () => {
  if (_dataLayer) return _dataLayer;

  if (isSupabaseEnabled()) {
    console.log("[DataLayer] Using Supabase store (production mode)");
    _dataLayer = require("./supabaseStore");
  } else {
    console.log("[DataLayer] Using JSON file store (development mode)");
    const jsonStore = require("./store");
    // Add no-op compatibility methods for JSON store
    _dataLayer = {
      ...jsonStore,
      getCollection: async (collection, filter = {}) => {
        const store = await jsonStore.getStore();
        let records = store[collection] || [];
        // Apply filter
        for (const [key, value] of Object.entries(filter)) {
          records = records.filter((r) => r[key] === value);
        }
        return records;
      },
      getRecord: async (collection, id) => {
        const store = await jsonStore.getStore();
        return (store[collection] || []).find((r) => r.id === id) || null;
      },
      findRecord: async (collection, filter = {}) => {
        const store = await jsonStore.getStore();
        const records = store[collection] || [];
        return records.find((r) => Object.entries(filter).every(([k, v]) => r[k] === v)) || null;
      },
      insertRecord: async (collection, record) => {
        await jsonStore.updateStore((store) => {
          if (!store[collection]) store[collection] = [];
          store[collection].push(record);
          return store;
        });
        return record;
      },
      updateRecord: async (collection, id, updates) => {
        let updated = null;
        await jsonStore.updateStore((store) => {
          const arr = store[collection] || [];
          const idx = arr.findIndex((r) => r.id === id);
          if (idx >= 0) {
            arr[idx] = { ...arr[idx], ...updates };
            updated = arr[idx];
          }
          return store;
        });
        return updated;
      },
      deleteRecord: async (collection, id) => {
        await jsonStore.updateStore((store) => {
          if (store[collection]) {
            store[collection] = store[collection].filter((r) => r.id !== id);
          }
          return store;
        });
        return true;
      }
    };
  }

  return _dataLayer;
};

module.exports = { getDataLayer };
