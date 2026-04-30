const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

if (!admin.apps.length) {
  try {
    // Priority 1: Load from the JSON file directly (most reliable — no dotenv escaping issues)
    const jsonPath = path.resolve(__dirname, "../../chhaya-4e0b1-firebase-adminsdk-fbsvc-19f7dc9d89.json");
    let serviceAccount;

    if (fs.existsSync(jsonPath)) {
      serviceAccount = require(jsonPath);
      console.log("Firebase Admin: loaded service account from JSON file");
    } else if (process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT) {
      // Priority 2: Parse from env var, fixing escaped newlines
      const raw = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;
      serviceAccount = JSON.parse(raw);
      // dotenv may keep \\n as literal — fix the private_key
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
      }
      console.log("Firebase Admin: loaded service account from env var");
    } else {
      throw new Error("No Firebase service account found (neither JSON file nor env var)");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin Initialized successfully");
  } catch (error) {
    console.error("Firebase Admin initialization error:", error.message);
  }
}

module.exports = admin;
