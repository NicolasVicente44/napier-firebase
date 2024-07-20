import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmptyHeader from "../components/EmptyHeader";
import Sidebar from "../components/Sidebar";

const NOICreate = ({ user }) => {
  const [formData, setFormData] = useState({
    clientName: "",
    assetMake: "",
    assetModel: "",
    dateNOISent: "",
    amountOfArrears: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form Data Submitted:", formData);
    // Redirect to another page after submission
    navigate("/cases");
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
                Create New NOI Case
              </Typography>
              <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                  fullWidth
                  label="Client Name"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Asset Make"
                  name="assetMake"
                  value={formData.assetMake}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Asset Model"
                  name="assetModel"
                  value={formData.assetModel}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Date NOI Sent"
                  name="dateNOISent"
                  type="date"
                  value={formData.dateNOISent}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Amount of Arrears"
                  name="amountOfArrears"
                  type="number"
                  value={formData.amountOfArrears}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Submit
                </Button>
              </form>
            </div>
          </Container>
        </main>
      </div>
    </div>
  );
};

export default NOICreate;
