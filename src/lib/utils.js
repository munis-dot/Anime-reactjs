import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/Firebase/FirebaseConfig";
import axios from 'axios';

export const deleteVideo = async (videoId) => {
  try {
    const moviesRef = collection(db, "movies");
    const isNumeric = typeof videoId === "number" || /^\d+$/.test(videoId);
    if (isNumeric) {
      const formattedId = isNumeric ? Number(videoId) : videoId;
      const q = query(moviesRef, where("id", "==", formattedId)); // Query document by `videoId`

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error("Video not found");
        return;
      }

      const docId = querySnapshot.docs[0].id; // Extract Firestore document ID
      const docRef = doc(db, "movies", docId);

      await deleteDoc(docRef); // Delete document
    }
    else {
      const docRef = doc(db, "movies", videoId);
      await deleteDoc(docRef); // Delete document
    }
    console.log("Video deleted successfully!");
    return true;
  } catch (error) {
    console.error("Error deleting video:", error);
  }
};

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

export const getDocumentByCustomId = async (collectionName = 'movies', videoId) => {
  const moviesCollection = collection(db, collectionName);
  const isNumeric = typeof videoId === "number" || /^\d+$/.test(videoId);
  console.log(isNumeric)
  if (isNumeric) {
    const q = query(moviesCollection, where("id", "==", Number(videoId)));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]; // Get the first document
      return { id: doc.id, ...doc.data() };
    }

    return null; // Return null if no document found
  }
  else {
    return await fetchDocumentById('movies', videoId)
  }
};

export const fetchAllMovies = async () => {
  try {
    const moviesCollection = collection(db, "movies"); // Reference to "movies" collection
    const moviesSnapshot = await getDocs(moviesCollection);

    // Map through Firestore documents and return movie data
    const movies = moviesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return movies;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
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

export const subscribe = async (id) => {
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

  return querySnapshot.docs.map((doc) => { console.log(doc); return ({ id: doc.id, ...doc.data() }) });
};

// Fetch Trending Movies (Sort by Popularity)
export const getTrendingMovies = async () => {
  const moviesRef = collection(db, "movies");
  const q = query(moviesRef, where("category", "==", "trending"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => { console.log(doc); return ({ id: doc.id, ...doc.data() }) });
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