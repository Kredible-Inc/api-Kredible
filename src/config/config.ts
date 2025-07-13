// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcQ7iMuaIsB3Jv-WNYVOsIi5jhFB1lVUg",
  authDomain: "kredible-1f68d.firebaseapp.com",
  projectId: "kredible-1f68d",
  storageBucket: "kredible-1f68d.firebasestorage.app",
  messagingSenderId: "409366363897",
  appId: "1:409366363897:web:1490976c57ffb58f24ac28",
  measurementId: "G-4VQGJWME7Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
