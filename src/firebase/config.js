import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9nQ6gUO0gM6nI8Tlfto9h5h5Ku3lr0WE",
  authDomain: "montemy-official.firebaseapp.com",
  projectId: "montemy-official",
  storageBucket: "montemy-official.firebasestorage.app",
  messagingSenderId: "1047774712779",
  appId: "1:1047774712779:web:baec3709b3f6fd07b89c4e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
