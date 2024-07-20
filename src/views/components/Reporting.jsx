import React from "react";
import EmptyHeader from "../components/EmptyHeader";
import Sidebar from "../components/Sidebar";

const Reporting = ({ user }) => {
  const handleSearch = (searchTerm) => {
    // Implement search logic if needed
  };

  const handleCreate = () => {
    // Handle create reporting logic if needed
    console.log("Create Report");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-80">
        <EmptyHeader onSearch={handleSearch} onCreate={handleCreate} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-3xl font-bold mb-6">Reporting</h1>
              <p className="text-gray-700">
                Content for the reporting page will go here.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reporting;
