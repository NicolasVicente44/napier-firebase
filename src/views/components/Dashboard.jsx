// views/components/Dashboard.js
import React from "react";

const Dashboard = ({ user }) => {
  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
    </div>
  );
};

export default Dashboard;
