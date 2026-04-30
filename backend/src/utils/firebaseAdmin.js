const admin = require("firebase-admin");

let app;

try {
  let credential;
  if (process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT) {
    try {
      // Try to parse as JSON string
      const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT);
      credential = admin.credential.cert(serviceAccount);
    } catch (e) {
      // Fallback to file path
      credential = admin.credential.cert(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT);
    }
  } else {
      console.warn("FIREBASE_ADMIN_SERVICE_ACCOUNT not set. Firebase Admin may not initialize correctly.");
  }

  app = admin.initializeApp({
    credential: credential,
  });
} catch (error) {
  if (!/already exists/.test(error.message)) {
    console.error("Firebase admin initialization error", error.stack);
  }
}

module.exports = admin;
