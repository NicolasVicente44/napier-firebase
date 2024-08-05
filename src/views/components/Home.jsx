import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EmptyHeader from "../components/EmptyHeader";
import Sidebar from "../components/Sidebar";
import { fetchRecentActivity } from "../../controllers/activityController"; // Ensure the import path is correct

const Home = ({ user }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const fetchedActivities = await fetchRecentActivity();
        setActivities(fetchedActivities);
      } catch (error) {
        console.error("Error loading activities: ", error);
      }
    };
    loadActivities();
  }, []);

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
                  <h2 className="text-xl font-semibold mb-2">Quick Links</h2>
                  <ul>
                    <li>
                      <Link
                        to="/cases"
                        className="text-blue-600 hover:underline"
                      >
                        View NOIs
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/reporting"
                        className="text-blue-600 hover:underline"
                      >
                        View Reports
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/settings"
                        className="text-blue-600 hover:underline"
                      >
                        Settings
                      </Link>
                    </li>
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
                            {activity.description}{" "}
                            {/* Display the detailed description */}
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
    </div>
  );
};

export default Home;
