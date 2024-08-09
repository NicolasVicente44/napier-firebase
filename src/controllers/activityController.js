import {
  db,
  Timestamp,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  writeBatch,
} from "../firebase/firebase"; // Adjust path

const MAX_LOG_COUNT = 5; // Maximum number of logs to keep

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
      const batch = writeBatch(db);

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
const logActivity = async (activityType, description, additionalData = {}) => {
  try {
    const activityLog = {
      activityType,
      description,
      additionalData,
      timestamp: Timestamp.now(),
    };

    console.log("Logging activity:", activityLog); // Debugging log

    const docRef = await addDoc(collection(db, "activityLogs"), activityLog);
    console.log("Document written with ID:", docRef.id); // Debugging log

    await manageLogCount();

    return docRef.id;
  } catch (error) {
    console.error("Error logging activity: ", error);
    throw error;
  }
};

// Log CRUD activities
// Log CRUD activities
export const logCRUDActivity = async (action, collectionName, documentId) => {
  // Skip logging for the 'favorites' collection
  if (collectionName === "favorites") {
    return;
  }

  const descriptions = {
    create: `A new document was created in ${collectionName}`,
    update: `A document was updated in ${collectionName}`,
    delete: `A document was deleted from ${collectionName}`,
    close: `A document was closed in ${collectionName}`,
    reopen: `A document was reopened in ${collectionName}`,
  };

  const description = descriptions[action];
  await logActivity("CRUD", description);
};

// Log Firebase authentication activities
export const logAuthActivity = async (action, userId, additionalData = {}) => {
  const descriptions = {
    login: `User with ID ${userId} logged in`,
    logout: `User with ID ${userId} logged out`,
    password_change: `User with ID ${userId} changed password`,
    account_creation: `User with ID ${userId} created an account`,
    account_deletion: `User with ID ${userId} deleted their account`,
  };

  const description =
    descriptions[action] ||
    `Performed ${action} action for user with ID ${userId}`;
  await logActivity("AUTH", description, additionalData);
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
