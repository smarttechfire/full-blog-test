// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "reelsmix-9c6b1.firebaseapp.com",
  databaseURL: "https://reelsmix-9c6b1-default-rtdb.firebaseio.com",
  projectId: "reelsmix-9c6b1",
  storageBucket: "reelsmix-9c6b1.appspot.com",
  messagingSenderId: "180909739507",
  appId: "1:180909739507:web:50342aef61da148b34d686",
  measurementId: "G-SP3JH023SM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
