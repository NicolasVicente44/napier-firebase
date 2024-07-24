import {
  db,
  Timestamp,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  deleteDoc,
  writeBatch,
} from "../firebase/firebase"; // Adjust path

const MAX_LOG_COUNT = 1; // Maximum number of logs to keep

// Manage log count by deleting oldest logs if exceeding the limit
const manageLogCount = async () => {
  try {
    const activityRef = collection(db, "activityLogs");
    const q = query(
      activityRef,
      orderBy("timestamp"),
      limit(MAX_LOG_COUNT + 1)
    );
    const querySnapshot = await getDocs(q);


    if (querySnapshot.size > MAX_LOG_COUNT) {
  
      const batch = writeBatch(db); // Use writeBatch

      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    }
  } catch (error) {
    console.error("Error managing log count: ", error);
  }
};

// Log an activity
export const logActivity = async (
  activityType,
  userId,
  description,
  additionalData = {}
) => {
  try {
    const activityLog = {
      activityType,
      userId,
      description,
      additionalData,
      timestamp: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, "activityLogs"), activityLog);

    // Manage log count after adding a new log
    await manageLogCount();

    return docRef.id;
  } catch (error) {
    console.error("Error logging activity: ", error);
    throw error;
  }
};

// Log CRUD activities
export const logCRUDActivity = async (
  action,
  collectionName,
  documentId,
  userId,
  additionalData = {}
) => {
  const description = `${action} performed on ${collectionName} with ID ${documentId}`;
  await logActivity("CRUD", userId, description, additionalData);
};

// Log user authentication activities
export const logAuthActivity = async (action, userId, additionalData = {}) => {
  const description = `${action} performed by user with ID ${userId}`;
  await logActivity("AUTH", userId, description, additionalData);
};

// Fetch recent activity
export const fetchRecentActivity = async () => {
  try {
    const activityRef = collection(db, "activityLogs");
    const q = query(activityRef, orderBy("timestamp", "desc"), limit(10));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error fetching recent activity: ", error);
    throw error;
  }
};
