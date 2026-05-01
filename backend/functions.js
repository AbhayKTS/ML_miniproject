// functions.js — Firebase Cloud Functions entry point
const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const app = require("./src/app");

// Set default region and memory for all functions
setGlobalOptions({ region: "us-central1", memory: "512MiB", timeoutSeconds: 300 });

exports.api = onRequest(app);
