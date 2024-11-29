import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBYhYLMjzs8N_7BVnVV2y0R3wNTSU1EzFM",
  authDomain: "bazar-dor-3.firebaseapp.com",
  projectId: "bazar-dor-3",
  storageBucket: "bazar-dor-3.firebasestorage.app",
  messagingSenderId: "875906070898",
  appId: "1:875906070898:web:d366ff34934a2c4a3a05eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);