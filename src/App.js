import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.js";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard.js";
import NotificationSystem from "./components/NotificationSystem.js";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background-color text-text-color">
        <NotificationSystem />
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;