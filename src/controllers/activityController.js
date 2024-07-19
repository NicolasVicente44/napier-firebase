// src/controllers/activityController.js
import { db } from "../firebase/firebase"; // Ensure the path to your Firebase config is correct

export async function fetchRecentActivity() {
  try {
    const snapshot = await db.collection("recentActivity").get();
    const activitiesList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return activitiesList;
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return [];
  }
}
