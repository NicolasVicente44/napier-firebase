import { db } from "../firebase/firebase"; // Make sure to configure Firebase and export `db` from your Firebase setup
import { collection, getDocs } from "firebase/firestore";

export const fetchNois = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "nois"));
    const nois = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return nois;
  } catch (error) {
    console.error("Error fetching NOIs: ", error);
    throw error;
  }
};

// Add a new NOI
export const addNoi = async (templateName, templateFileUrl) => {
  try {
    await db.collection("nois").add({ templateName, templateFileUrl });
  } catch (error) {
    console.error("Error adding NOI: ", error);
    throw error;
  }
};

// Update an existing NOI
export const updateNoi = async (id, templateName, templateFileUrl) => {
  try {
    await db
      .collection("nois")
      .doc(id)
      .update({ templateName, templateFileUrl });
  } catch (error) {
    console.error("Error updating NOI: ", error);
    throw error;
  }
};

// Delete an existing NOI
export const deleteNoi = async (id) => {
  try {
    await db.collection("nois").doc(id).delete();
  } catch (error) {
    console.error("Error deleting NOI: ", error);
    throw error;
  }
};
