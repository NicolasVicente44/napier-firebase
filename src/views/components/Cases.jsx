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

const Cases = ({ user }) => {
  const [nois, setNois] = useState([]);

  useEffect(() => {
    const loadNois = async () => {
      try {
        const fetchedNois = await fetchNois();
        setNois(fetchedNois);
      } catch (error) {
        console.error("Error loading NOIs: ", error);
      }
    };
    loadNois();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-80">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">NOI Case List</h2>
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
                    {nois.length > 0 ? (
                      nois.map((noi) => (
                        <TableRow key={noi.id}>
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default Cases;
