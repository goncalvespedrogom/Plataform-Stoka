import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCyjCJErofKKout6zh0p8rO88oKHA5_F0",
  authDomain: "stoka-project.firebaseapp.com",
  projectId: "stoka-project",
  storageBucket: "stoka-project.firebasestorage.app",
  messagingSenderId: "504059364239",
  appId: "1:504059364239:web:34e79c052f7be5226481fa",
  measurementId: "G-R1JWQHRHYX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); 