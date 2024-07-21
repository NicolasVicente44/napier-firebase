// noisController.js

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
  query,
  where,
  FieldPath,
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

// noisController.js
export async function createNOI(data) {
  try {
    const docRef = await addDoc(collection(db, "nois"), {
      ...data,
      createdAt: new Date(),
      closed: false,
    });
    console.log("Document written with ID:", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document:", e);
    throw e;
  }
}
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

// Add a favorite NOI for a user
