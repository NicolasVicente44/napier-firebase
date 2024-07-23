import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Typography,
  MenuItem,
  List,
  ListItemText,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmptyHeader from "../components/EmptyHeader";
import Sidebar from "../components/Sidebar";
import { createNOI } from "../../controllers/noisController";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

// Function to get latitude and longitude from address using Map Maker Geocoding API
export async function getCoordinatesFromAddress(address) {
  const apiKey = process.env.LOCATION_API_KEY;
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

// Function to get address suggestions (replace with actual API or data source)
export async function getAddressSuggestions(query) {
  const apiKey = process.env.LOCATION_API_KEY;
  try {
    const response = await fetch(
      `https://geocode.maps.co/search?q=${encodeURIComponent(
        query
      )}&api_key=${apiKey}`
    );

    if (!response.ok) {
      console.error("Network response was not ok:", response.statusText);
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    // Deduplicate suggestions
    const uniqueSuggestions = Array.from(
      new Set(data.map((item) => item.display_name))
    );
    return uniqueSuggestions;
  } catch (error) {
    console.error("Error fetching address suggestions:", error);
    return [];
  }
}

const NOICreate = ({ user }) => {
  const [formData, setFormData] = useState({
    clientName: "",
    clientAddress: "",
    assetYear: "",
    assetMake: "",
    assetModel: "",
    assetColour: "",
    VIN_serialNum: "",
    licensePlate: "",
    licenseExpiry: "",
    registeredOwner: "",
    lienHolder: "",
    lienHolderCont: "",
    daysOfStorage: "",
    storageRate: "",
    amountOfArrears: "",
    bailiffCosts: "",
    towingCost: "",
    storageCosts: "",
    NOICosts: "",
    HSTOnCosts: "",
    formDate: "",
    totalOfStorageRate: "",
    dateOfAdditionalCharges: "",
    repoDate: "",
    dateNOISent: "",
    registeredOwnerCont: "",
    location: "",
    locationDescription: "",
  });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vinError, setVinError] = useState("");

  const navigate = useNavigate();
  const suggestionsRef = useRef(null);

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

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (formData.location) {
        const results = await getAddressSuggestions(formData.location);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [formData.location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate VIN length
    if (name === "VIN_serialNum" && value.length !== 17) {
      setVinError("VIN/Serial Number must be exactly 17 characters.");
    } else {
      setVinError("");
    }
  };
  const handleAddressSelect = async (address) => {
    setFormData((prevData) => ({
      ...prevData,
      location: address,
    }));
    const coordinates = await getCoordinatesFromAddress(address);
    if (coordinates) {
      setSelectedLocation(coordinates);
      setError(null); // Clear error if coordinates are fetched successfully
    } else {
      setError("Unable to get coordinates for the address.");
      setSelectedLocation(null);
    }
    setSuggestions([]); // Clear suggestions after selection
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
        clientAddress: "",
        assetYear: "",
        assetMake: "",
        assetModel: "",
        assetColour: "",
        VIN_serialNum: "",
        licensePlate: "",
        licenseExpiry: "",
        registeredOwner: "",
        lienHolder: "",
        lienHolderCont: "",
        daysOfStorage: "",
        storageRate: "",
        amountOfArrears: "",
        bailiffCosts: "",
        towingCost: "",
        storageCosts: "",
        NOICosts: "",
        HSTOnCosts: "",
        formDate: "",
        totalOfStorageRate: "",
        dateOfAdditionalCharges: "",
        repoDate: "",
        dateNOISent: "",
        registeredOwnerCont: "",

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
            <div className="bg-white p-6 rounded-lg shadow-md relative">
              <Typography className="text-center" variant="h4" gutterBottom>
                Create New NOI Case
              </Typography>
              <form
                onSubmit={handleSubmit}
                className="space-y-4 lg:max-w-[60%] md-custom:max-w-[50%] w-full mx-auto"
              >
                <Typography variant="h5">Client Info</Typography>
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
                  label="Client Address"
                  name="clientAddress"
                  value={formData.clientAddress}
                  onChange={handleChange}
                  variant="outlined"
                />
                <Typography variant="h5">Asset Info</Typography>
                <TextField
                  fullWidth
                  label="Asset Year"
                  name="assetYear"
                  value={formData.assetYear}
                  onChange={handleChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Asset Make"
                  name="assetMake"
                  value={formData.assetMake}
                  onChange={handleChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Asset Model"
                  name="assetModel"
                  value={formData.assetModel}
                  onChange={handleChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Asset Colour"
                  name="assetColour"
                  value={formData.assetColour}
                  onChange={handleChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  required
                  label="VIN/Serial Number"
                  name="VIN_serialNum"
                  value={formData.VIN_serialNum}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!vinError}
                  helperText={vinError}
                />
                <TextField
                  fullWidth
                  label="License Plate"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="License Expiry"
                  name="licenseExpiry"
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
                <Typography variant="h5">Owner Info</Typography>
                <TextField
                  fullWidth
                  label="Registered Owner"
                  name="registeredOwner"
                  value={formData.registeredOwner}
                  onChange={handleChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Lien Holder"
                  name="lienHolder"
                  value={formData.lienHolder}
                  onChange={handleChange}
                  variant="outlined"
                />
                <Typography variant="h5">Costs Info</Typography>
                <TextField
                  fullWidth
                  label="Days of Storage"
                  name="daysOfStorage"
                  type="number"
                  value={formData.daysOfStorage}
                  onChange={handleChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Storage Rate"
                  name="storageRate"
                  type="number"
                  value={formData.storageRate}
                  onChange={handleChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Amount of Arrears"
                  name="amountOfArrears"
                  type="number"
                  value={formData.amountOfArrears}
                  onChange={handleChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Bailiff Costs"
                  name="bailiffCosts"
                  type="number"
                  value={formData.bailiffCosts}
                  onChange={handleChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Towing Cost"
                  name="towingCost"
                  type="number"
                  value={formData.towingCost}
                  onChange={handleChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Storage Costs"
                  name="storageCosts"
                  type="number"
                  value={formData.storageCosts}
                  onChange={handleChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="NOI Costs"
                  name="NOICosts"
                  type="number"
                  value={formData.NOICosts}
                  onChange={handleChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="HST on Costs"
                  name="HSTOnCosts"
                  type="number"
                  value={formData.HSTOnCosts}
                  onChange={handleChange}
                  variant="outlined"
                />
                <Typography variant="h5">Date Info</Typography>
                <TextField
                  fullWidth
                  label="Form Date"
                  name="formDate"
                  type="date"
                  value={formData.formDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Total of Storage Rate"
                  name="totalOfStorageRate"
                  type="number"
                  value={formData.totalOfStorageRate}
                  onChange={handleChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Date of Additional Charges"
                  name="dateOfAdditionalCharges"
                  type="date"
                  value={formData.dateOfAdditionalCharges}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Repo Date"
                  name="repoDate"
                  type="date"
                  value={formData.repoDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Date NOI Sent"
                  name="dateNOISent"
                  type="date"
                  value={formData.dateNOISent}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />

                <Typography variant="h5">Location Info</Typography>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  onFocus={() => setSuggestions([])} // Hide suggestions on focus
                  onBlur={() => setSuggestions([])} // Hide suggestions on blur
                  variant="outlined"
                />
                {suggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className=" mb-8 bg-white border border-gray-300 rounded mt-1"
                  >
                    <List>
                      {suggestions.map((suggestion, index) => (
                        <MenuItem
                          key={index}
                          onClick={() => handleAddressSelect(suggestion)}
                        >
                          <ListItemText primary={suggestion} />
                        </MenuItem>
                      ))}
                    </List>
                  </div>
                )}
                <TextField
                  fullWidth
                  label="Location Description"
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
                  disabled={!!vinError || formData.VIN_serialNum.length !== 17}
                >
                  Submit
                </Button>
                {error && (
                  <Typography color="error" className="mt-4 text-center">
                    {error}
                  </Typography>
                )}
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NOICreate;
