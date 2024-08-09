import { db } from "../firebase/firebase"; // Ensure Firebase is properly configured and exported
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { logCRUDActivity } from "../controllers/activityController";

// Fetch all NOIs
export const fetchNois = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "nois"));
    const nois = querySnapshot.docs.map((doc) => {
      const data = doc.data();
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

// Create a new NOI
export const createNOI = async (data) => {
  try {
    console.log("Data to be saved:", data); // Log the data
    const docRef = await addDoc(collection(db, "nois"), {
      ...data,
      createdAt: new Date(),
      closed: false,
    });
    console.log("Document written with ID:", docRef.id);

    // Log activity for creating an NOI
    await logCRUDActivity("create", "nois", docRef.id);

    return docRef.id;
  } catch (e) {
    console.error("Error adding document:", e);
    throw e;
  }
};

// Update an existing NOI
export const updateNoiById = async (id, data) => {
  try {
    const docRef = doc(db, "nois", id);
    await updateDoc(docRef, data);

    // Log activity for updating an NOI
    await logCRUDActivity("update", "nois", id);
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

    // Log activity for deleting an NOI
    await logCRUDActivity("delete", "nois", id);
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

    // Log activity for closing an NOI
    await logCRUDActivity("update", "nois", id);
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

    // Log activity for reopening an NOI
    await logCRUDActivity("update", "nois", id);
  } catch (error) {
    console.error("Error reopening NOI case: ", error);
    throw error;
  }
};
