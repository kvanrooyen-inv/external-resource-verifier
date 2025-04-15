import React from "react";
import ThemeToggle from "./components/ThemeToggle";
import Dashboard from "./components/Dashboard";
import NotificationSystem from "./components/NotificationSystem.js";

function App() {
  return (
    <div className="min-h-screen bg-background-color text-text-color">
      <ThemeToggle />
      <NotificationSystem />
      <Dashboard />
    </div>
  );
}

export default App;
