import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import EmptyHeader from "../components/EmptyHeader";
import Sidebar from "../components/Sidebar";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase/firebase"; // Adjust this import based on your Firebase setup
import { toast } from "react-toastify";

const Settings = ({ user }) => {
  const [username, setUsername] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        toast.error("No user is currently signed in.");
        return;
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

   

      // Update email if changed
      if (email !== currentUser.email) {
        await updateEmail(currentUser, email);
      }

      // Update password if provided
      if (password) {
        await updatePassword(currentUser, password);
      }

      toast.success("Settings updated successfully!");
      setPassword("");
      setCurrentPassword("");
    } catch (error) {
      toast.error(`Error updating settings: ${error.message}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-80">
        <EmptyHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <Container maxWidth="sm" className="py-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Typography variant="h4" gutterBottom>
                Settings
              </Typography>
              <form onSubmit={handleSaveChanges} className="space-y-4">
             
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
                  label="New Password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                />
                <Typography variant="body2" className="mt-1 text-gray-500">
                  Leave empty to keep current password.
                </Typography>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  variant="outlined"
                  required
                />
                <Typography variant="body2" className="mt-1 text-gray-500">
                  Required to confirm changes.
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
