import React from "react";
import EmptyHeader from "../components/EmptyHeader";
import Sidebar from "../components/Sidebar";

// Example notifications data. Replace with actual data fetching logic.
const notifications = [
  { id: 1, message: "You have a new message from admin." },
  { id: 2, message: "Your account settings have been updated." },
  { id: 3, message: "New features are available in your dashboard." },
];

const Notifications = ({ user }) => {
  const handleSearch = (searchTerm) => {
    // Implement search logic if needed
  };

  const handleCreate = () => {
    // Handle create notification logic if needed
    console.log("Create Notification");
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
              {notifications.length > 0 ? (
                <ul>
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className="border-b py-2 text-gray-700"
                    >
                      {notification.message}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No notifications at the moment.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
