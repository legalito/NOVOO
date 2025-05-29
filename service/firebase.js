// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6m8yQQXdhGtIPKXyMXese3eqLl_bsi90",
  authDomain: "trainmuscle-d785a.firebaseapp.com",
  projectId: "trainmuscle-d785a",
  storageBucket: "trainmuscle-d785a.appspot.com",
  messagingSenderId: "757629476075",
  appId: "1:757629476075:web:85e3d946ef84c3311272ae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };