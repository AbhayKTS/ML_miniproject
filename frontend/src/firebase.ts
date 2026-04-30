import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCpGT3PIGLAsglQXjqoMR3t4KnBxZ4BHS8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "chhaya-4e0b1.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "chhaya-4e0b1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "chhaya-4e0b1.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "200065906990",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:200065906990:web:41dad2be6b1b6977de22bf",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-301C9CT7K7"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signUpWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const signOut = () => firebaseSignOut(auth);
export { auth };
