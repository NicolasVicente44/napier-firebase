import {
  db,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "../firebase/firebase";

const linksCollection = collection(db, "links");

export const fetchLinks = async () => {
  const snapshot = await getDocs(linksCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addLink = async (alias, url) => {
  const newLink = { alias, url };
  const docRef = await addDoc(linksCollection, newLink);
  return { id: docRef.id, ...newLink };
};

export const deleteLink = async (id) => {
  const linkDoc = doc(db, "links", id);
  await deleteDoc(linkDoc);
};
