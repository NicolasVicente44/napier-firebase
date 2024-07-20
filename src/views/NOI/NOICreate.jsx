import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmptyHeader from "../components/EmptyHeader";
import Sidebar from "../components/Sidebar";
import { db } from "../../firebase/firebase"; // Adjust import path if needed

// Function to get coordinates from an address using OpenStreetMap's Nominatim
const getCoordinates = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address
      )}&format=json`
    );
    const data = await response.json();
    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    } else {
      throw new Error("Location not found");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

const NOICreate = ({ user }) => {
  const [formData, setFormData] = useState({
    clientName: "",
    assetMake: "",
    assetModel: "",
    dateNOISent: "",
    amountOfArrears: "",
    location: "",
    locationDescription: "",
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

    try {
      const { location, ...otherData } = formData;
      const coordinates = await getCoordinates(location);

      if (coordinates) {
        const newNOI = {
          ...otherData,
          NOILocation: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          },
          locationDescription: formData.locationDescription,
        };

        await db.collection("NOIs").add(newNOI); // Save data to Firestore

        console.log("Form Data Submitted:", newNOI);
        navigate("/cases");
      } else {
        console.error("Unable to get coordinates for the provided location.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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
                <TextField
                  fullWidth
                  label="Location (Address)"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="NOI Location Description"
                  name="locationDescription"
                  value={formData.locationDescription}
                  onChange={handleChange}
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
