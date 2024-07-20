import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { fetchNoiById } from "../../controllers/noisController";
import Map from "../components/Map";
import CircularProgress from "@mui/material/CircularProgress";

const NOIDetails = ({ user }) => {
  const { id } = useParams();
  const [noi, setNoi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNoi = async () => {
      try {
        const fetchedNoi = await fetchNoiById(id);
        setNoi(fetchedNoi);
      } catch (error) {
        console.error("Error fetching NOI details: ", error);
      } finally {
        setLoading(false);
      }
    };
    loadNoi();
  }, [id]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <CircularProgress />
      </div>
    );

  if (!noi)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">No data available.</p>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} /> {/* Sidebar should have higher z-index */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-80">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-3xl font-bold mb-6">NOI Details</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-lg mb-2">
                    <strong>ID:</strong> {noi.id || "N/A"}
                  </p>
                  <p className="text-lg mb-2">
                    <strong>Client Name:</strong> {noi.clientName || "N/A"}
                  </p>
                  <p className="text-lg mb-2">
                    <strong>Asset Make:</strong> {noi.assetMake || "N/A"}
                  </p>
                  <p className="text-lg mb-2">
                    <strong>Asset Model:</strong> {noi.assetModel || "N/A"}
                  </p>
                  <p className="text-lg mb-2">
                    <strong>Date NOI Sent:</strong> {noi.dateNOISent || "N/A"}
                  </p>
                  <p className="text-lg mb-2">
                    <strong>Amount of Arrears:</strong>{" "}
                    {noi.amountOfArrears || "N/A"}
                  </p>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold mb-4">
                    Location/Mapping
                  </h2>
                  <div className="relative h-80 bg-gray-200 rounded-lg overflow-hidden z-10">
                    <Map location={noi.NOILocation} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NOIDetails;
