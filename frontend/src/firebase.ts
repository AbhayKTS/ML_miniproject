import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    literal:apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "chhaya-4e0b1.firebaseapp.com",
    projectId: "chhaya-4e0b1",
    storageBucket: "chhaya-4e0b1.firebasestorage.app",
    messagingSenderId: "200065906990",
    appId: "1:200065906990:web:41dad2be6b1b6977de22bf",
    measurementId: "G-301C9CT7K7"
};

const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
