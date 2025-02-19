import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQSnHxXQ28LAsTKeerVmeoyv_AP99PDFw",
  authDomain: "anime-6f55d.firebaseapp.com",
  projectId: "anime-6f55d",
  storageBucket: "anime-6f55d.firebasestorage.app",
  messagingSenderId: "570528766425",
  appId: "1:570528766425:web:835cd84fd9bcb33deca1c8",
  measurementId: "G-TE42L46M9S"
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(FirebaseApp);
const analytics = getAnalytics(FirebaseApp);
