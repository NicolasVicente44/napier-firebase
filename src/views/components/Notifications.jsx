import React, { useState, useEffect } from "react";
import MessageController from "../../controllers/messageController"; // Adjust the path as necessary
import EmptyHeader from "../components/EmptyHeader";
import Sidebar from "../components/Sidebar";

const Notifications = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await MessageController.getMessages();
        console.log("Fetched messages:", data);

        const formattedMessages = data.map((doc) => ({
          id: doc.id,
          content: doc.content,
          author: doc.author,
          timestamp: doc.timestamp ? doc.timestamp.toDate() : null, // Convert Firestore Timestamp to Date
          updatedAt: doc.updatedAt ? doc.updatedAt.toDate() : null, // Convert Firestore Timestamp to Date
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, []);

  const handleAddMessage = async () => {
    if (!newMessage.trim()) {
      // Prevent adding empty messages
      console.error("Message cannot be empty.");
      return;
    }
    try {
      const addedMessage = await MessageController.addMessage(
        newMessage,
        user.email
      );
      setMessages([addedMessage, ...messages]);
      setNewMessage("");
    } catch (error) {
      console.error("Error adding message: ", error);
    }
  };

  const handleEditMessage = async () => {
    if (!editId || !editContent.trim()) return;
    try {
      await MessageController.updateMessage(editId, editContent);
      // Refresh messages after updating
      fetchMessages();
      setEditId(null);
      setEditContent("");
    } catch (error) {
      console.error("Error updating message: ", error);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await MessageController.deleteMessage(id);
      setMessages(messages.filter((msg) => msg.id !== id));
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
  };

  // Re-fetch messages after an update
  const fetchMessages = async () => {
    try {
      const data = await MessageController.getMessages();
      console.log("Fetched messages:", data);

      const formattedMessages = data.map((doc) => ({
        id: doc.id,
        content: doc.content,
        author: doc.author,
        timestamp: doc.timestamp ? doc.timestamp.toDate() : null, // Convert Firestore Timestamp to Date
        updatedAt: doc.updatedAt ? doc.updatedAt.toDate() : null, // Convert Firestore Timestamp to Date
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-80">
        <EmptyHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-3xl font-bold mb-6">Notifications</h1>
              <div className="mb-4">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Write a new message..."
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={handleAddMessage}
                  className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Add Message
                </button>
              </div>
              <div>
                {messages.length > 0 ? (
                  <ul>
                    {messages.map((message) => (
                      <li key={message.id} className="border-b py-2">
                        <div>
                          <strong>{message.author}</strong> -{" "}
                          {message.timestamp
                            ? new Date(message.timestamp).toLocaleString()
                            : "No timestamp"}
                        </div>
                        <p>{message.content}</p>
                        {user.email === message.author && (
                          <div>
                            <button
                              onClick={() => {
                                setEditId(message.id);
                                setEditContent(message.content);
                              }}
                              className="mr-2 bg-yellow-500 text-white py-1 px-2 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(message.id)}
                              className="bg-red-500 text-white py-1 px-2 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No messages yet.</p>
                )}
              </div>
              {editId && (
                <div className="mt-4">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <button
                    onClick={handleEditMessage}
                    className="mt-2 bg-green-500 text-white py-2 px-4 rounded"
                  >
                    Update Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
