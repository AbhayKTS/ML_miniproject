const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

let firebaseApp = null;
let firestore = null;
let storage = null;

const initializeFirebase = () => {
  if (firebaseApp) return firebaseApp;

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./firebase-service-account.json";
  const absolutePath = path.isAbsolute(serviceAccountPath) 
    ? serviceAccountPath 
    : path.join(process.cwd(), serviceAccountPath);

  if (!fs.existsSync(absolutePath)) {
    console.warn("Firebase service account not found at:", absolutePath);
    console.warn("Firestore features will be disabled.");
    return null;
  }

  try {
    const serviceAccount = require(absolutePath);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: `${serviceAccount.project_id}.appspot.com`
    });
    console.log("Firebase Admin SDK initialized for project:", serviceAccount.project_id);
    return firebaseApp;
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error.message);
    return null;
  }
};

const getFirestore = () => {
  if (firestore) return firestore;
  
  const app = initializeFirebase();
  if (!app) return null;
  
  firestore = admin.firestore();
  return firestore;
};

const getStorage = () => {
  if (storage) return storage;
  
  const app = initializeFirebase();
  if (!app) return null;
  
  storage = admin.storage().bucket();
  return storage;
};

const isFirebaseEnabled = () => {
  return initializeFirebase() !== null;
};

// Firestore helpers
const saveClipToFirestore = async (clip) => {
  const db = getFirestore();
  if (!db) {
    console.warn("Firestore not available, skipping clip save");
    return null;
  }

  try {
    const clipData = {
      ...clip,
      outputPath: undefined, // Don't store local path in Firestore
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    delete clipData.outputPath;

    await db.collection("clips").doc(clip.id).set(clipData);
    console.log("Clip saved to Firestore:", clip.id);
    return clip.id;
  } catch (error) {
    console.error("Failed to save clip to Firestore:", error.message);
    return null;
  }
};

const saveClipsToFirestore = async (clips) => {
  const db = getFirestore();
  if (!db) {
    console.warn("Firestore not available, skipping clips save");
    return [];
  }

  const batch = db.batch();
  const savedIds = [];

  for (const clip of clips) {
    const clipRef = db.collection("clips").doc(clip.id);
    const clipData = {
      id: clip.id,
      videoId: clip.videoId,
      title: clip.title,
      startTime: clip.startTime,
      endTime: clip.endTime,
      aspectRatio: clip.aspectRatio,
      status: clip.status,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    batch.set(clipRef, clipData);
    savedIds.push(clip.id);
  }

  try {
    await batch.commit();
    console.log(`Saved ${clips.length} clips to Firestore`);
    return savedIds;
  } catch (error) {
    console.error("Failed to batch save clips to Firestore:", error.message);
    return [];
  }
};

const uploadClipToStorage = async (clip) => {
  const bucket = getStorage();
  if (!bucket) {
    console.warn("Firebase Storage not available, skipping upload");
    return null;
  }

  try {
    const destination = `clips/${clip.videoId}/${clip.id}.mp4`;
    await bucket.upload(clip.outputPath, {
      destination,
      metadata: {
        contentType: "video/mp4",
        metadata: {
          clipId: clip.id,
          videoId: clip.videoId,
          title: clip.title
        }
      }
    });

    // Get signed URL for the uploaded file
    const [url] = await bucket.file(destination).getSignedUrl({
      action: "read",
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log("Clip uploaded to Firebase Storage:", clip.id);
    return { destination, url };
  } catch (error) {
    console.error("Failed to upload clip to Storage:", error.message);
    return null;
  }
};

const getClipsFromFirestore = async (videoId = null) => {
  const db = getFirestore();
  if (!db) return [];

  try {
    let query = db.collection("clips");
    if (videoId) {
      query = query.where("videoId", "==", videoId);
    }
    
    const snapshot = await query.orderBy("createdAt", "desc").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Failed to get clips from Firestore:", error.message);
    return [];
  }
};

module.exports = {
  initializeFirebase,
  getFirestore,
  getStorage,
  isFirebaseEnabled,
  saveClipToFirestore,
  saveClipsToFirestore,
  uploadClipToStorage,
  getClipsFromFirestore
};
