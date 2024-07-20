import { db } from "../firebase/firebase"; // Make sure to configure Firebase and export `db` from your Firebase setup
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

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
