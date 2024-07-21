import React, { useState, useEffect } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmptyHeader from "../components/EmptyHeader";
import Sidebar from "../components/Sidebar";
import { createNOI } from "../../controllers/noisController";

// Function to get latitude and longitude from address using Map Maker Geocoding API
async function getCoordinatesFromAddress(address) {
  const apiKey = "669d4aca22579710523104lmr1e3e1f";
  try {
    const response = await fetch(
      `https://geocode.maps.co/search?q=${encodeURIComponent(
        address
      )}&api_key=${apiKey}`
    );

    if (!response.ok) {
      console.error("Network response was not ok:", response.statusText);
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Geocoding API Response:", data); // Debugging line
    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    } else {
      console.error("No results found for the address.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching address coordinates:", error);
    return null;
  }
}

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

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (formData.location) {
        setIsLoading(true);
        const coordinates = await getCoordinatesFromAddress(formData.location);
        setIsLoading(false);
        if (coordinates) {
          setSelectedLocation(coordinates);
          setError(null); // Clear error if coordinates are fetched successfully
        } else {
          setError("Unable to get coordinates for the address.");
          setSelectedLocation(null);
        }
      }
    };

    fetchCoordinates();
  }, [formData.location]);

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
      const newNOI = {
        ...formData,
        NOILocation: selectedLocation,
      };

      console.log("New NOI Data:", newNOI); // Debugging line

      await createNOI(newNOI);

      // Clear form and navigate after successful submission
      setFormData({
        clientName: "",
        assetMake: "",
        assetModel: "",
        dateNOISent: "",
        amountOfArrears: "",
        location: "",
        locationDescription: "",
      });
      setSelectedLocation(null);
      navigate("/cases");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit form. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-80">
        <EmptyHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Typography className="text-center" variant="h4" gutterBottom>
                Create New NOI Case
              </Typography>
              <form
                onSubmit={handleSubmit}
                className="space-y-4 lg:max-w-[60%] md-custom:max-w-[50%] w-full mx-auto"
              >
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
                  variant="outlined"
                  error={!!error}
                  helperText={isLoading ? "Fetching coordinates..." : error}
                />
                <TextField
                  fullWidth
                  label="Location Preview"
                  value={
                    selectedLocation
                      ? `Lat: ${selectedLocation.latitude}, Lon: ${selectedLocation.longitude}`
                      : "No location selected"
                  }
                  variant="outlined"
                  disabled
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default NOICreate;
