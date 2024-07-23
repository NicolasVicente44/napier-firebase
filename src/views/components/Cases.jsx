import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  FaSort,
  FaTable,
  FaThLarge,
} from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import Fuse from "fuse.js";

const ViewToggleButton = ({ viewMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="ml-4 p-2 text-blue-500 hover:text-blue-600 transition-colors"
    >
      {viewMode === "table" ? <FaThLarge size={20} /> : <FaTable size={20} />}
    </button>
  );
};

const Cases = ({ user }) => {
  const [nois, setNois] = useState([]);
  const [filteredNois, setFilteredNois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortColumn, setSortColumn] = useState("id");
  const [viewMode, setViewMode] = useState("table");
  const [isMobile, setIsMobile] = useState(false);

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

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1075); // Adjust this value to match your custom breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fuseOptions = {
    keys: Object.keys(nois[0] || {}),
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
    console.log("Create NOI Case");
  };

  const handleSort = (column) => {
    const direction =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(direction);
    setSortColumn(column);

    const sortedNois = [...filteredNois].sort((a, b) => {
      const getValue = (item) =>
        item[column] === "N/A" || item[column] === undefined
          ? Infinity
          : item[column];
      const valueA = getValue(a);
      const valueB = getValue(b);

      if (valueA === Infinity && valueB !== Infinity) return 1;
      if (valueB === Infinity && valueA !== Infinity) return -1;

      if (typeof valueA === "number" && typeof valueB === "number") {
        return direction === "asc" ? valueA - valueB : valueB - valueA;
      } else if (Date.parse(valueA) && Date.parse(valueB)) {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        const valA = (valueA || "").toString().toLowerCase();
        const valB = (valueB || "").toString().toLowerCase();
        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
      }
    });

    setFilteredNois(sortedNois);
  };

  const effectiveViewMode = isMobile ? "card" : viewMode;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-80">
        <Header onSearch={handleSearch} onCreate={handleCreate} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white pb-10 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">NOI Case List</h2>
                {!isMobile && (
                  <ViewToggleButton
                    viewMode={viewMode}
                    onToggle={() =>
                      setViewMode(viewMode === "table" ? "card" : "table")
                    }
                  />
                )}
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <CircularProgress />
                </div>
              ) : (
                <>
                  {/* Table View */}
                  {effectiveViewMode === "table" && (
                    <div className="hidden md:block">
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <div className="flex items-center">
                                  ID
                                  <button
                                    onClick={() => handleSort("id")}
                                    className="ml-2"
                                  >
                                    <FaSort
                                      className={`text-gray-500 ${
                                        sortColumn === "id"
                                          ? sortDirection === "asc"
                                            ? ""
                                            : "rotate-180"
                                          : ""
                                      }`}
                                    />
                                  </button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  Client Name
                                  <button
                                    onClick={() => handleSort("clientName")}
                                    className="ml-2"
                                  >
                                    <FaSort
                                      className={`text-gray-500 ${
                                        sortColumn === "clientName"
                                          ? sortDirection === "asc"
                                            ? ""
                                            : "rotate-180"
                                          : ""
                                      }`}
                                    />
                                  </button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  Asset Make
                                  <button
                                    onClick={() => handleSort("assetMake")}
                                    className="ml-2"
                                  >
                                    <FaSort
                                      className={`text-gray-500 ${
                                        sortColumn === "assetMake"
                                          ? sortDirection === "asc"
                                            ? ""
                                            : "rotate-180"
                                          : ""
                                      }`}
                                    />
                                  </button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  Asset Model
                                  <button
                                    onClick={() => handleSort("assetModel")}
                                    className="ml-2"
                                  >
                                    <FaSort
                                      className={`text-gray-500 ${
                                        sortColumn === "assetModel"
                                          ? sortDirection === "asc"
                                            ? ""
                                            : "rotate-180"
                                          : ""
                                      }`}
                                    />
                                  </button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  Date NOI Sent
                                  <button
                                    onClick={() => handleSort("dateNOISent")}
                                    className="ml-2"
                                  >
                                    <FaSort
                                      className={`text-gray-500 ${
                                        sortColumn === "dateNOISent"
                                          ? sortDirection === "asc"
                                            ? ""
                                            : "rotate-180"
                                          : ""
                                      }`}
                                    />
                                  </button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  Amount of Arrears
                                  <button
                                    onClick={() =>
                                      handleSort("amountOfArrears")
                                    }
                                    className="ml-2"
                                  >
                                    <FaSort
                                      className={`text-gray-500 ${
                                        sortColumn === "amountOfArrears"
                                          ? sortDirection === "asc"
                                            ? ""
                                            : "rotate-180"
                                          : ""
                                      }`}
                                    />
                                  </button>
                                </div>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredNois.length > 0 ? (
                              filteredNois.map((noi) => (
                                <TableRow
                                  key={noi.id}
                                  className="hover:bg-gray-200"
                                  sx={{
                                    "&:nth-of-type(odd)": {
                                      backgroundColor: "#f9f9f9",
                                    },
                                    "&:nth-of-type(even)": {
                                      backgroundColor: "#ffffff",
                                    },
                                    marginBottom: "8px",
                                    padding: "24px 0",
                                    "& td": {
                                      padding: "22px 16px",
                                    },
                                  }}
                                  component={Link}
                                  to={`/noidetails/${noi.id}`}
                                >
                                  <TableCell>{noi.id || "N/A"}</TableCell>
                                  <TableCell>
                                    {noi.clientName || "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    {noi.assetMake || "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    {noi.assetModel || "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    {noi.dateNOISent || "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    {noi.amountOfArrears || "N/A"}
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                  No NOIs found. Check internet connection or
                                  try again.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  )}

                  {/* Card View */}
                  {effectiveViewMode === "card" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredNois.length > 0 ? (
                        filteredNois.map((noi) => (
                          <Link
                            key={noi.id}
                            to={`/noidetails/${noi.id}`}
                            className="block"
                          >
                            <div className="bg-white my-6 shadow-xl rounded-lg p-4 transition-transform transform hover:scale-105">
                              <p className="flex items-center mb-2">
                                <FaIdBadge className="mr-2 text-blue-500" />
                                <span className="font-semibold">ID: </span>{" "}
                                {noi.id || "N/A"}
                              </p>
                              <p className="flex items-center mb-2">
                                <FaUser className="mr-2 text-green-500" />
                                <span className="font-semibold">
                                  Client Name:{" "}
                                </span>{" "}
                                {noi.clientName || "N/A"}
                              </p>
                              <p className="flex items-center mb-2">
                                <FaCar className="mr-2 text-red-500" />
                                <span className="font-semibold">
                                  Asset Make:{" "}
                                </span>{" "}
                                {noi.assetMake || "N/A"}
                              </p>
                              <p className="flex items-center mb-2">
                                <FaCar className="mr-2 text-red-500" />
                                <span className="font-semibold">
                                  Asset Model:{" "}
                                </span>{" "}
                                {noi.assetModel || "N/A"}
                              </p>
                              <p className="flex items-center mb-2">
                                <FaCalendar className="mr-2 text-yellow-500" />
                                <span className="font-semibold">
                                  Date NOI Sent:{" "}
                                </span>{" "}
                                {noi.dateNOISent || "N/A"}
                              </p>
                              <p className="flex items-center mb-2">
                                <FaMoneyBillWave className="mr-2 text-purple-500" />
                                <span className="font-semibold">
                                  Amount of Arrears:{" "}
                                </span>{" "}
                                {noi.amountOfArrears || "N/A"}
                              </p>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <p className="text-center col-span-full">
                          No NOIs found.
                        </p>
                      )}
                    </div>
                  )}
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
