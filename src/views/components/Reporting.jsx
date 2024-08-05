import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import EmptyHeader from "../../views/components/EmptyHeader";
import Sidebar from "../../views/components/Sidebar";
import { FaChartLine, FaStar } from "react-icons/fa";
import { fetchNois } from "../../controllers/noisController"; // Adjust the path to your noicontroller file
import { format, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns";

const Reporting = ({ user }) => {
  const [data, setData] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [averageNois, setAverageNois] = useState(0);
  const [maxNois, setMaxNois] = useState(0);

  useEffect(() => {
    const getMonthLabel = (date) => format(date, "MMM yyyy");

    const fetchData = async () => {
      try {
        const fetchedData = await fetchNois();

        // Get the current date and one year ago date
        const now = new Date();
        const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));

        // Generate an array of all months in the last year
        const allMonths = eachMonthOfInterval({
          start: startOfMonth(oneYearAgo),
          end: endOfMonth(new Date()),
        });

        // Initialize an object to keep track of NOIs by month
        const monthlyData = {};
        allMonths.forEach((month) => {
          const monthKey = getMonthLabel(month);
          monthlyData[monthKey] = 0; // Initialize each month with 0 NOIs
        });

        fetchedData.forEach((item) => {
          const timestamp = item.createdAt.toDate(); // Convert Firestore Timestamp to JavaScript Date
          const itemDate = new Date(timestamp);

          // Check if the item is within the last year
          if (itemDate >= oneYearAgo) {
            const monthKey = getMonthLabel(startOfMonth(itemDate));
            monthlyData[monthKey] += 1;
          }
        });

        // Convert monthlyData to array format for Recharts
        const processedData = Object.keys(monthlyData).map((key) => ({
          date: key,
          nois: monthlyData[key],
        }));

        console.log("Processed Data:", processedData); // Debugging line

        // Calculate statistics
        const totalPoints = processedData.length;
        const totalNois = processedData.reduce((acc, cur) => acc + cur.nois, 0);
        const monthsWithNois = processedData.filter(item => item.nois > 0).length; // Count months with NOIs
        const averageNois = monthsWithNois > 0 ? totalNois / monthsWithNois : 0;
        const maxNois =
          totalPoints > 0
            ? Math.max(...processedData.map((item) => item.nois))
            : 0;

        setData(processedData);
        setTotalPoints(totalPoints);
        setAverageNois(averageNois);
        setMaxNois(maxNois);
      } catch (error) {
        console.error("Error fetching data from NOIs:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-80">
        <EmptyHeader onSearch={() => {}} onCreate={() => {}} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h1 className="text-3xl font-bold mb-6">Reporting</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
                  <div className="mr-4 text-blue-600">
                    <FaChartLine size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Total NOIs</h3>
                    <p className="text-2xl font-bold">{totalPoints}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
                  <div className="mr-4 text-green-600">
                    <FaChartLine size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Average NOIS per Month</h3>
                    <p className="text-2xl font-bold">
                      {averageNois.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
                  <div className="mr-4 text-yellow-600">
                    <FaStar size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Maximum NOIS in a Month</h3>
                    <p className="text-2xl font-bold">{maxNois}</p>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="nois" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reporting;
