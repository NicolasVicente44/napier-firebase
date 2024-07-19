import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const Home = ({ user }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-80">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-3xl font-bold mb-4">
                Welcome, {user ? user.email.split("@")[0] : "User"}!
              </h1>
              <p className="text-lg mb-6">
                Welcome to the Napier NOI Flow application. Here you can manage
                NOIs, view detailed reports, and more.
              </p>
              <div className="space-y-4">
                <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
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
                  <p className="text-gray-700">
                    No recent activity to display.
                  </p>
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
