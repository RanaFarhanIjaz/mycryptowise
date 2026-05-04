import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAk-WnTfHMJhlOguTHnjCo2oMLI_SaA5a8",
  authDomain: "crypto-wise.firebaseapp.com",
  projectId: "crypto-wise",
  storageBucket: "crypto-wise.firebasestorage.app",
  messagingSenderId: "292809266315",
  appId: "1:292809266315:web:9a018cbe8b27984c22708e",
  measurementId: "G-HGFDPTEHEQ",
  // Realtime Database
  databaseURL: "https://crypto-wise-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);       // Firestore (Auth, etc.)
const rtdb = getDatabase(app);      // Realtime Database (accounts, transactions)

// Initialize Analytics (optional, client-side only)
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}

export { app, auth, db, rtdb };

