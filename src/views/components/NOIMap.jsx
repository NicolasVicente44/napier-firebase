import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EmptyHeader from "../components/EmptyHeader";
import Sidebar from "../components/Sidebar";
import AggregateMap from "../components/AggregateMap"; // Update the import
import { fetchNois } from "../../controllers/noisController";
import CircularProgress from "@mui/material/CircularProgress";

const NOIMap = ({ user }) => {
  const [nois, setNois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const loadNois = async () => {
      try {
        const fetchedNois = await fetchNois();
        setNois(fetchedNois);
      } catch (error) {
        console.error("Error fetching NOIs: ", error);
      } finally {
        setLoading(false);
      }
    };
    loadNois();

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1075);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const effectiveViewMode = isMobile ? "card" : "map";

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-80">
        <EmptyHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 relative">
          <div className="container mx-auto px-6 py-8 relative z-10">
            <div className="bg-white p-6 rounded-lg shadow-md relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold mb-6">NOI All Case Map</h1>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <CircularProgress />
                </div>
              ) : nois.length === 0 ? (
                <div className="flex h-screen items-center justify-center bg-gray-100">
                  <p className="text-xl text-gray-700">
                    No NOIs cases available.
                  </p>
                </div>
              ) : (
                <div className="relative h-[600px] bg-gray-200 rounded-lg overflow-hidden z-10">
                  <AggregateMap
                    locations={nois
                      .map((noi) => noi.NOILocation)
                      .filter((location) => location)}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NOIMap;
