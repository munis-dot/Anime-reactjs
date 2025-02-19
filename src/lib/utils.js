import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/Firebase/FirebaseConfig";
import axios from 'axios';

export const fetchAnimeDetails = async (animeTitle) => {
  if (!animeTitle) {
    throw new Error('Anime title is required');
  }

  try {
    const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${animeTitle}&limit=1`);
    return response.data.data[0]; // Assuming the first result is the correct one
  } catch (error) {
    console.error('Error fetching anime details:', error);
    throw error;
  }
};

export const fetchDocumentById = async (collectionName = 'movies', docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document Data:", docSnap.data());
      return { id: docId, ...docSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
  }
};

export const subscribe = async(id) => {
  await updateDoc(doc(db, "Users", id), {
    premium: true,
  })
}
// Fetch Movies by Category (e.g., Top Rated)
export const getMoviesByCategory = async (category) => {
  const moviesRef = collection(db, "movies");
  const q = query(moviesRef, where("category", "==", category));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Fetch Movies by Genre (e.g., Action, Comedy)
export const getMoviesByGenre = async (genre) => {
  const moviesRef = collection(db, "movies");
  const q = query(moviesRef, where("genre", "array-contains", genre));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Fetch Trending Movies (Sort by Popularity)
export const getTrendingMovies = async () => {
  const moviesRef = collection(db, "movies");
  const q = query(moviesRef, where("category", "==", "trending"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const updatePremiumStatus = async (userId, isPremium) => {
  if (!userId) return;

  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { premium: isPremium }, { merge: true });
    console.log("Premium status updated!");
  } catch (error) {
    console.error("Error updating premium status:", error);
  }
};