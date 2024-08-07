import {
  db,
  Timestamp,
  collection,
  addDoc,
  query,
  getDocs,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "../firebase/firebase"; // Adjust the path as necessary

class MessageController {
  static async addMessage(content, author) {
    try {
      const newMessage = {
        content,
        author,
        timestamp: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, "messages"), newMessage);
      return { id: docRef.id, ...newMessage };
    } catch (error) {
      console.error("Error adding message: ", error);
      throw new Error("Failed to add message");
    }
  }

  static async getMessages() {
    try {
      const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting messages: ", error);
      throw new Error("Failed to get messages");
    }
  }

  static async updateMessage(id, newContent) {
    try {
      console.log("Attempting to update message...");
      console.log("Message ID:", id);
      console.log("New Content:", newContent);
  
      const messageRef = doc(db, "messages", id);
      await updateDoc(messageRef, {
        content: newContent,
        updatedAt: Timestamp.now()
      });
  
      console.log("Message updated successfully");
      return { id, content: newContent };
    } catch (error) {
      console.error("Error updating message:", error);
      throw new Error("Failed to update message");
    }
  }
  

  static async deleteMessage(id) {
    try {
      const messageRef = doc(db, "messages", id);
      await deleteDoc(messageRef);
    } catch (error) {
      console.error("Error deleting message: ", error);
      throw new Error("Failed to delete message");
    }
  }
}

export default MessageController;
