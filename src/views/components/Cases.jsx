import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { fetchNois } from "../../controllers/noisController";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  FaIdBadge,
  FaUser,
  FaCar,
  FaCalendar,
  FaMoneyBillWave,
} from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import Fuse from "fuse.js";

const Cases = ({ user }) => {
  const [nois, setNois] = useState([]);
  const [filteredNois, setFilteredNois] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNois = async () => {
      try {
        const fetchedNois = await fetchNois();
        setNois(fetchedNois);
        setFilteredNois(fetchedNois);
      } catch (error) {
        console.error("Error loading NOIs: ", error);
      } finally {
        setLoading(false);
      }
    };
    loadNois();
  }, []);

  const fuseOptions = {
    keys: Object.keys(nois[0] || {}), // keys to search
    includeScore: true,
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim() === "") {
      setFilteredNois(nois);
    } else {
      const fuse = new Fuse(nois, fuseOptions);
      const results = fuse.search(searchTerm);
      setFilteredNois(results.map((result) => result.item));
    }
  };

  const handleCreate = () => {
    // Handle create NOI case logic here
    console.log("Create NOI Case");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-80">
        <Header onSearch={handleSearch} onCreate={handleCreate} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white pb-10 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">NOI Case List</h2>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <CircularProgress />
                </div>
              ) : (
                <>
                  <div className="hidden md-custom:block">
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Client Name</TableCell>
                            <TableCell>Asset Make</TableCell>
                            <TableCell>Asset Model</TableCell>
                            <TableCell>Date NOI Sent</TableCell>
                            <TableCell>Amount of Arrears</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredNois.length > 0 ? (
                            filteredNois.map((noi) => (
                              <TableRow
                                key={noi.id}
                                sx={{
                                  "&:nth-of-type(odd)": {
                                    backgroundColor: "#f9f9f9",
                                  },
                                  "&:nth-of-type(even)": {
                                    backgroundColor: "#ffffff",
                                  },
                                  marginBottom: "8px",
                                  // Add padding here
                                  padding: "24px 0",
                                  "& td": {
                                    padding: "22px 16px", // Padding inside TableCell
                                  },
                                }}
                              >
                                <TableCell>{noi.id}</TableCell>
                                <TableCell>{noi.clientName}</TableCell>
                                <TableCell>{noi.assetMake}</TableCell>
                                <TableCell>{noi.assetModel}</TableCell>
                                <TableCell>{noi.dateNOISent}</TableCell>
                                <TableCell>{noi.amountOfArrears}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center">
                                No NOIs found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                  <div className="block  md-custom:hidden">
                    {filteredNois.length > 0 ? (
                      filteredNois.map((noi) => (
                        <div
                          key={noi.id}
                          className="bg-white my-6  shadow-xl rounded-lg p-4  transition-transform transform hover:scale-105"
                        >
                          <p className="flex items-center mb-2">
                            <FaIdBadge className="mr-2 text-blue-500" />
                            <span className="font-semibold">ID: </span> {noi.id}
                          </p>
                          <p className="flex items-center mb-2">
                            <FaUser className="mr-2 text-green-500" />
                            <span className="font-semibold">
                              Client Name:{" "}
                            </span>{" "}
                            {noi.clientName}
                          </p>
                          <p className="flex items-center mb-2">
                            <FaCar className="mr-2 text-red-500" />
                            <span className="font-semibold">
                              Asset Make:{" "}
                            </span>{" "}
                            {noi.assetMake}
                          </p>
                          <p className="flex items-center mb-2">
                            <FaCar className="mr-2 text-red-500" />
                            <span className="font-semibold">
                              Asset Model:{" "}
                            </span>{" "}
                            {noi.assetModel}
                          </p>
                          <p className="flex items-center mb-2">
                            <FaCalendar className="mr-2 text-yellow-500" />
                            <span className="font-semibold">
                              Date NOI Sent:
                            </span>{" "}
                            {noi.dateNOISent}
                          </p>
                          <p className="flex items-center mb-2">
                            <FaMoneyBillWave className="mr-2 text-purple-500" />
                            <span className="font-semibold">
                              Amount of Arrears:
                            </span>{" "}
                            {noi.amountOfArrears}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-700">No NOIs found.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Cases;
