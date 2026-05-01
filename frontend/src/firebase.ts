import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfHb7_G8r7FFXGTEqvi7WDrKUsNZg4Qsk",
  authDomain: "miniml-d9ea9.firebaseapp.com",
  projectId: "miniml-d9ea9",
  storageBucket: "miniml-d9ea9.firebasestorage.app",
  messagingSenderId: "49951808733",
  appId: "1:49951808733:web:8cc4c4511ecf561c9a8f34",
  measurementId: "G-1LBMDLQ97Z"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithEmail = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
export const signUpWithEmail = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
export const signOut = () => firebaseSignOut(auth);
export { auth, db };
