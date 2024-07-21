import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase"; // Adjust the import path according to your project structure

// Add a favorite NOI for a user
export const addFavorite = async (userId, noiId) => {
  try {
    const favoritesRef = collection(db, "favorites");
    await addDoc(favoritesRef, {
      userId,
      noiId,
    });
  } catch (error) {
    console.error("Error adding favorite: ", error);
    throw error;
  }
};

// Remove a favorite NOI for a user
export const removeFavorite = async (userId, noiId) => {
  try {
    const favoritesRef = collection(db, "favorites");
    const q = query(
      favoritesRef,
      where("userId", "==", userId),
      where("noiId", "==", noiId)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error("Error removing favorite: ", error);
    throw error;
  }
};

// Check if a NOI is favorited by the user
export const isFavorite = async (userId, noiId) => {
  try {
    const favoritesRef = collection(db, "favorites");
    const q = query(
      favoritesRef,
      where("userId", "==", userId),
      where("noiId", "==", noiId)
    );
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking favorite status: ", error);
    throw error;
  }
};

// Fetch user's favorite NOIs
export const fetchFavorites = async (userId) => {
  try {
    const favoritesRef = collection(db, "favorites");
    const q = query(favoritesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data().noiId);
  } catch (error) {
    console.error("Error fetching favorites: ", error);
    throw error;
  }
};
