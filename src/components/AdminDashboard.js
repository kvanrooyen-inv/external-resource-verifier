import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [rawData, setRawData] = useState(null);
  const [processedStats, setProcessedStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/.netlify/functions/get-stats");

      if (!response.ok) {
        throw new Error("Failed to fetch statistics");
      }

      const data = await response.json();
      setRawData(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Unable to load dashboard statistics. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Process raw data into the stats we need
  useEffect(() => {
    if (!rawData) return;

    try {
      // Process raw data into enhanced stats
      const totalSites = rawData.totalSites || 0;

      // Get the alert stats
      const sitesWithAlerts = rawData.alertStats?.sitesWithAlerts || 0;
      const percentageWithAlerts = rawData.alertStats?.percentageWithAlerts || "0.0";

      // Get ARIA stats
      const sitesWithAria = rawData.ariaStats?.sitesWithAria || 0;
      const percentageWithAria = rawData.ariaStats?.percentageWithAria || "0.0";

      // Get form validation stats
      const sitesWithValidation = rawData.formValidationStats?.sitesWithValidation || 0;
      const percentageWithValidation = rawData.formValidationStats?.percentageWithValidation || "0.0";

      // Get libraries directly from the API response
      const topLibraries = rawData.topLibraries || [];

      const stats = {
        totalSites,
        lastUpdated: rawData.lastUpdated || new Date().toISOString(),
        alertStats: {
          sitesWithAlerts,
          percentageWithAlerts,
        },
        ariaStats: {
          sitesWithAria,
          percentageWithAria,
        },
        formValidationStats: {
          sitesWithValidation,
          percentageWithValidation,
        },
        topLibraries,
      };

      setProcessedStats(stats);
    } catch (err) {
      console.error("Error processing data:", err);
      setError("Error processing dashboard data. Please try again later.");
    }
  }, [rawData]);

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading statistics...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchData}>Retry</Button>
      </div>
    );
  }

  if (!processedStats) {
    return <div className="p-8 text-center">Preparing dashboard...</div>;
  }

  // Prepare data for charts
  const libraryData = processedStats.topLibraries.slice(0, 5);

  return (
    <div className="mx-auto w-4/5 max-w-5xl pt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={fetchData}>Refresh Stats</Button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Total Sites</h2>
          <p className="text-3xl font-bold">{processedStats.totalSites}</p>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Using Alerts</h2>
          <p className="text-3xl font-bold">
            {processedStats.alertStats.sitesWithAlerts}
          </p>
          <p className="text-sm text-gray-500">
            {processedStats.alertStats.percentageWithAlerts}%
          </p>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">With ARIA</h2>
          <p className="text-3xl font-bold">
            {processedStats.ariaStats.sitesWithAria}
          </p>
          <p className="text-sm text-gray-500">
            {processedStats.ariaStats.percentageWithAria}%
          </p>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">With Form Validation</h2>
          <p className="text-3xl font-bold">
            {processedStats.formValidationStats.sitesWithValidation}
          </p>
          <p className="text-sm text-gray-500">
            {processedStats.formValidationStats.percentageWithValidation}%
          </p>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="max-w-full">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Top Libraries</h2>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={libraryData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="1 1" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Sites Using" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <p className="text-sm text-gray-500 mt-8">
        Last updated: {new Date(processedStats.lastUpdated).toLocaleString()}
      </p>
    </div>
  );
};

export default AdminDashboard;