import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB1CISU2HiMre0wsyEIhptfbNr-8a7oz9w",
    authDomain: "chhaya-9c3ea.firebaseapp.com",
    projectId: "chhaya-9c3ea",
    storageBucket: "chhaya-9c3ea.firebasestorage.app",
    messagingSenderId: "47289907099",
    appId: "1:47289907099:web:c0c1480742ccc6b876d33e",
    measurementId: "G-9D0DW0Z1QJ"
};

const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
