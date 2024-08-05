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
import { FaChartLine, FaDollarSign } from "react-icons/fa";
import { FiPieChart, FiBarChart } from "react-icons/fi";
import { AiOutlineDollar, AiOutlineCalendar } from "react-icons/ai";
import { MdStar } from "react-icons/md";
import { fetchNois } from "../../controllers/noisController"; // Adjust the path to your noicontroller file
import { format, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns";

const Reporting = ({ user }) => {
  const [data, setData] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [averageNois, setAverageNois] = useState(0);
  const [maxNois, setMaxNois] = useState(0);
  const [minNois, setMinNois] = useState(0);
  const [maxNoisMonth, setMaxNoisMonth] = useState("");
  const [minNoisMonth, setMinNoisMonth] = useState("");
  const [stdDevNois, setStdDevNois] = useState(0);
  const [totalTowingCosts, setTotalTowingCosts] = useState(0);
  const [totalStorageCosts, setTotalStorageCosts] = useState(0);
  const [totalBailiffCosts, setTotalBailiffCosts] = useState(0);
  const [averageDaysOfStorage, setAverageDaysOfStorage] = useState(0);

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

        // Initialize objects and variables for calculations
        const monthlyData = {};
        const towingCosts = [];
        const storageCosts = [];
        const bailiffCosts = [];
        let totalDaysOfStorage = 0;

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

            // Collect cost data
            if (item.towingCost) towingCosts.push(parseFloat(item.towingCost) || 0);
            if (item.storageCosts) storageCosts.push(parseFloat(item.storageCosts) || 0);
            if (item.bailiffCosts) bailiffCosts.push(parseFloat(item.bailiffCosts) || 0);
            if (item.daysOfStorage) totalDaysOfStorage += parseFloat(item.daysOfStorage) || 0;
          }
        });

        // Convert monthlyData to array format for Recharts
        const processedData = Object.keys(monthlyData).map((key) => ({
          date: key,
          nois: monthlyData[key],
        }));

        // Filter out months with zero NOIs
        const monthsWithNois = processedData.filter(item => item.nois > 0);

        // Find max and min NOIS and their corresponding months
        const maxNoisItem = monthsWithNois.reduce((max, item) => (item.nois > max.nois ? item : max), { nois: 0 });
        const minNoisItem = monthsWithNois.reduce((min, item) => (item.nois < min.nois ? item : min), { nois: Infinity });

        // Calculate statistics
        const totalPoints = processedData.length;
        const totalNois = processedData.reduce((acc, cur) => acc + cur.nois, 0);
        const averageNois = monthsWithNois.length > 0 ? totalNois / monthsWithNois.length : 0;
        const maxNois = monthsWithNois.length > 0 ? maxNoisItem.nois : 0;
        const minNois = monthsWithNois.length > 0 ? minNoisItem.nois : 0;

        // Set month names for max and min NOIS
        setMaxNoisMonth(maxNoisItem.date);
        setMinNoisMonth(minNoisItem.date);

        // Calculate standard deviation
        const meanNois = averageNois;
        const variance = processedData.reduce((acc, cur) => acc + Math.pow(cur.nois - meanNois, 2), 0) / totalPoints;
        const stdDevNois = Math.sqrt(variance);

        // Calculate total costs
        const totalTowingCosts = towingCosts.reduce((acc, cost) => acc + cost, 0);
        const totalStorageCosts = storageCosts.reduce((acc, cost) => acc + cost, 0);
        const totalBailiffCosts = bailiffCosts.reduce((acc, cost) => acc + cost, 0);

        // Calculate average days of storage
        const averageDaysOfStorage = monthsWithNois.length > 0 ? totalDaysOfStorage / monthsWithNois.length : 0;

        setData(processedData);
        setTotalPoints(totalPoints);
        setAverageNois(averageNois);
        setMaxNois(maxNois);
        setMinNois(minNois);
        setMaxNoisMonth(maxNoisItem.date);
        setMinNoisMonth(minNoisItem.date);
        setStdDevNois(stdDevNois);
        setTotalTowingCosts(totalTowingCosts);
        setTotalStorageCosts(totalStorageCosts);
        setTotalBailiffCosts(totalBailiffCosts);
        setAverageDaysOfStorage(averageDaysOfStorage);
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                    <FiPieChart size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Average NOIS per Month</h3>
                    <p className="text-2xl font-bold">{averageNois.toFixed(2)}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
                  <div className="mr-4 text-yellow-600">
                    <MdStar size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Maximum NOIS in a Month</h3>
                    <p className="text-2xl font-bold">{maxNoisMonth} ({maxNois})</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
                  <div className="mr-4 text-red-600">
                    <FiBarChart size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Minimum Non-Zero NOIS in a Month</h3>
                    <p className="text-2xl font-bold">{minNoisMonth} ({minNois})</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
                  <div className="mr-4 text-orange-600">
                    <AiOutlineDollar size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Total Towing Costs</h3>
                    <p className="text-2xl font-bold">${totalTowingCosts.toFixed(2)}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
                  <div className="mr-4 text-teal-600">
                    <FaDollarSign size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Total Storage Costs</h3>
                    <p className="text-2xl font-bold">${totalStorageCosts.toFixed(2)}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
                  <div className="mr-4 text-indigo-600">
                    <FaDollarSign size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Total Bailiff Costs</h3>
                    <p className="text-2xl font-bold">${totalBailiffCosts.toFixed(2)}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
                  <div className="mr-4 text-gray-600">
                    <AiOutlineCalendar size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Average Days of Storage</h3>
                    <p className="text-2xl font-bold">{averageDaysOfStorage.toFixed(2)}</p>
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
