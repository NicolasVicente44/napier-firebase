import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

// Example user data. Replace this with actual data fetching logic.
const exampleUsers = [
  { id: 1, name: "John Doe", email: "john.doe@example.com" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
  { id: 3, name: "Alice Johnson", email: "alice.johnson@example.com" },
];

const Users = ({ user }) => {
  const [users, setUsers] = useState([]);

  // Simulate data fetching
  useEffect(() => {
    // Replace with actual data fetching logic
    setUsers(exampleUsers);
  }, []);

  const handleSearch = (searchTerm) => {
    // Implement search logic if needed
  };

  const handleCreate = () => {
    // Handle create user logic if needed
    console.log("Create User");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-80">
        <Header onSearch={handleSearch} onCreate={handleCreate} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-3xl font-bold mb-6">Users</h1>
              {users.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b p-4 text-left">ID</th>
                      <th className="border-b p-4 text-left">Name</th>
                      <th className="border-b p-4 text-left">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="border-b p-4">{user.id}</td>
                        <td className="border-b p-4">{user.name}</td>
                        <td className="border-b p-4">{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No users available.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Users;
