import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase"; // Adjust the import path according to your project structure
import { logCRUDActivity } from "./activityController"; // Adjust the import path to your activityController

// Add a favorite NOI for a user
export const addFavorite = async (userId, noiId) => {
  try {
    const favoritesRef = collection(db, "favorites");
    const docRef = await addDoc(favoritesRef, {
      userId,
      noiId,
    });

    // Log the activity
    await logCRUDActivity("ADD", "favorites", docRef.id, userId, { noiId });
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

    // Log the activity for each document found
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      await logCRUDActivity("REMOVE", "favorites", doc.id, userId, { noiId });
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

    // Log the activity
    await logCRUDActivity("CHECK", "favorites", "N/A", userId, { noiId });

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

    // Log the activity
    await logCRUDActivity("FETCH", "favorites", "N/A", userId);

    return querySnapshot.docs.map((doc) => doc.data().noiId);
  } catch (error) {
    console.error("Error fetching favorites: ", error);
    throw error;
  }
};
