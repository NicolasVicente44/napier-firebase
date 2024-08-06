import React, { useState, useEffect } from "react";
import EmptyHeader from "../components/EmptyHeader";
import Sidebar from "../components/Sidebar";
import { fetchRecentActivity } from "../../controllers/activityController";
import {
  fetchLinks,
  addLink,
  deleteLink,
} from "../../controllers/linkController";
import Modal from "../components/Modal";

const Home = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [links, setLinks] = useState([]);
  const [newAlias, setNewAlias] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const fetchedActivities = await fetchRecentActivity();
        setActivities(fetchedActivities);
      } catch (error) {
        console.error("Error loading activities: ", error);
      }
    };

    const loadLinks = async () => {
      try {
        const fetchedLinks = await fetchLinks();
        setLinks(fetchedLinks);
      } catch (error) {
        console.error("Error loading links: ", error);
      }
    };

    loadActivities();
    loadLinks();
  }, []);

  const handleAddLink = async () => {
    try {
      // Ensure the URL starts with http:// or https://
      const url =
        newUrl.startsWith("http://") || newUrl.startsWith("https://")
          ? newUrl
          : `http://${newUrl}`;
      const newLink = await addLink(newAlias, url);
      setLinks([...links, newLink]);
      setNewAlias("");
      setNewUrl("");
      setIsModalOpen(false); // Close the modal after adding the link
    } catch (error) {
      console.error("Error adding link: ", error);
    }
  };

  const handleDeleteLink = async (id) => {
    try {
      await deleteLink(id);
      setLinks(links.filter((link) => link.id !== id));
    } catch (error) {
      console.error("Error deleting link: ", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-80">
        <EmptyHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white min-h-96 p-6 rounded-lg shadow-md">
              <h1 className="text-lg sm:text-3xl font-bold mb-4">
                Welcome, {user ? user.email.split("@")[0] : "User"}!
              </h1>
              <p className="text-lg mb-6">
                Welcome to the Napier NOI Flow application. Here you can manage
                NOIs, view detailed reports/data mappings, automate document
                creation, and more.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-100 min-h-80 p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold">Custom Quick Links</h2>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Add Link
                    </button>
                  </div>
                  <ul>
                    {links.map((link) => (
                      <li
                        key={link.id}
                        className="flex justify-between items-center"
                      >
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {link.alias}
                        </a>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="text-red-600 hover:underline ml-4"
                        >
                          x
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-2">
                    Recent Activity
                  </h2>
                  {activities.length > 0 ? (
                    <ul className="space-y-2">
                      {activities.map((activity) => (
                        <li
                          key={activity.timestamp.toMillis()}
                          className="text-gray-700"
                        >
                          <p className="font-semibold">
                            {activity.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(
                              activity.timestamp.seconds * 1000
                            ).toLocaleString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">
                      No recent activity to display.
                    </p>
                  )}
                </div>
                <div className="bg-green-100 p-4 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-2">
                    Important Notifications
                  </h2>
                  <p className="text-gray-700">
                    No important notifications at this time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Add a New Link</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Alias"
            value={newAlias}
            onChange={(e) => setNewAlias(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="URL"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleAddLink}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Link
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
