import {
  collection,
  query,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

// Fetch tasks from Firestore
export const fetchTasks = (callback) => {
  const q = query(collection(db, "tasks"));
  return onSnapshot(q, (querySnapshot) => {
    const tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    callback(tasks);
  });
};

// Update a task's status in Firestore
export const updateTaskStatus = async (taskId, status) => {
  const taskDoc = doc(db, "tasks", taskId);
  await updateDoc(taskDoc, { status });
};

// Add a new task to Firestore
export const addTask = async (task) => {
  await addDoc(collection(db, "tasks"), task);
};

// Delete a task from Firestore
export const deleteTask = async (taskId) => {
  const taskDoc = doc(db, "tasks", taskId);
  await deleteDoc(taskDoc);
};
export const updateTask = async (taskId, updatedTask) => {
  const taskDoc = doc(db, "tasks", taskId);
  await updateDoc(taskDoc, updatedTask);
};
