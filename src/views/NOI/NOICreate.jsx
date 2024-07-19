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
    // You can handle form submission here, e.g., send data to API or Firestore
    console.log("Form Data Submitted:", formData);
    // Redirect to the cases list or another page after submission
    navigate("/cases");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-80">
        <EmptyHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container text-center mx-auto  px-6 py-8">
            <div className="bg-white pb-10 pt-8 p-6 rounded-lg shadow-md">
              <Typography variant="h4" gutterBottom>
                Create New NOI Case
              </Typography>
              <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                  className="w-full lg:w-2/3"
                  label="Client Name"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                />
                <TextField
                  className="w-full lg:w-2/3"
                  label="Asset Make"
                  name="assetMake"
                  value={formData.assetMake}
                  onChange={handleChange}
                  required
                />
                <TextField
                  className="w-full lg:w-2/3"
                  label="Asset Model"
                  name="assetModel"
                  value={formData.assetModel}
                  onChange={handleChange}
                  required
                />
                <TextField
                  className="w-full lg:w-2/3"
                  label="Date NOI Sent"
                  name="dateNOISent"
                  type="date"
                  value={formData.dateNOISent}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  className="w-full lg:w-2/3"
                  label="Amount of Arrears"
                  name="amountOfArrears"
                  type="number"
                  value={formData.amountOfArrears}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="w-full lg:w-2/3"
                >
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NOICreate;
