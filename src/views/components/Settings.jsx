import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import EmptyHeader from "../components/EmptyHeader";
import Sidebar from "../components/Sidebar";

const Settings = ({ user }) => {
  const [username, setUsername] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  const handleSaveChanges = (e) => {
    e.preventDefault();
    // Handle saving settings logic here
    console.log("Settings saved", { username, email, password });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-80">
        <EmptyHeader /> {/* Empty handlers */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <Container maxWidth="sm" className="py-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Typography variant="h4" gutterBottom>
                Settings
              </Typography>
              <form onSubmit={handleSaveChanges} className="space-y-4">
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  variant="outlined"
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  required
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                />
                <Typography variant="body2" className="mt-1 text-gray-500">
                  Leave empty to keep current password.
                </Typography>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Save Changes
                </Button>
              </form>
            </div>
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Settings;
