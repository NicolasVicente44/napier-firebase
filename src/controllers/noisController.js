import { db } from "../firebase/firebase"; // Ensure Firebase is properly configured and exported
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

// Fetch all NOIs
export const fetchNois = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "nois"));
    const nois = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Fetched NOI data:", { id: doc.id, ...data });
      return { id: doc.id, ...data };
    });
    return nois;
  } catch (error) {
    console.error("Error fetching NOIs: ", error);
    throw error;
  }
};

// Fetch a single NOI by ID
export const fetchNoiById = async (id) => {
  try {
    const docRef = doc(db, "nois", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching NOI by ID: ", error);
    throw error;
  }
};

// Add a new NOI
export const addNoi = async (templateName, templateFileUrl) => {
  try {
    await addDoc(collection(db, "nois"), { templateName, templateFileUrl });
  } catch (error) {
    console.error("Error adding NOI: ", error);
    throw error;
  }
};

// Update an existing NOI
export const updateNoiById = async (id, data) => {
  try {
    const docRef = doc(db, "nois", id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating NOI: ", error);
    throw error;
  }
};

// Delete an existing NOI
export const deleteNoiById = async (id) => {
  try {
    const docRef = doc(db, "nois", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting NOI: ", error);
    throw error;
  }
};

// Close an existing NOI case (set a boolean field 'closed' to true)
export const closeNoiById = async (id) => {
  try {
    const docRef = doc(db, "nois", id);
    await updateDoc(docRef, { closed: true });
  } catch (error) {
    console.error("Error closing NOI case: ", error);
    throw error;
  }
};

// Reopen an existing NOI case (set a boolean field 'closed' to false)
export const reopenNoiById = async (id) => {
  try {
    const docRef = doc(db, "nois", id);
    await updateDoc(docRef, { closed: false });
  } catch (error) {
    console.error("Error reopening NOI case: ", error);
    throw error;
  }
};

// Add a NOI to user's favourites
export const addFavourite = async (userId, noiId) => {
  try {
    const userRef = doc(db, "favourites", userId);
    await updateDoc(userRef, {
      favouriteNois: arrayUnion(noiId),
    });
  } catch (error) {
    console.error("Error adding favourite: ", error);
    throw error;
  }
};

// Remove a NOI from user's favourites
export const removeFavourite = async (userId, noiId) => {
  try {
    const userRef = doc(db, "favourites", userId);
    await updateDoc(userRef, {
      favouriteNois: arrayRemove(noiId),
    });
  } catch (error) {
    console.error("Error removing favourite: ", error);
    throw error;
  }
};

// Fetch user's favourite NOIs
export const fetchFavourites = async (userId) => {
  try {
    const userRef = doc(db, "favourites", userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data().favouriteNois || [];
    } else {
      console.log("No favourites found for user.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching favourites: ", error);
    throw error;
  }
};

// Toggle favorite status
export const toggleFavoriteStatus = async (id, isFavorite) => {
  try {
    const docRef = doc(db, "nois", id);
    await updateDoc(docRef, { isFavorite });
  } catch (error) {
    throw new Error("Error updating favorite status: " + error.message);
  }
};
