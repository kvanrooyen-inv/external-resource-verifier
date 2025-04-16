import React from "react";
import { ThemeProvider } from "./context/ThemeContext.js";
import Dashboard from "./components/Dashboard";
import NotificationSystem from "./components/NotificationSystem.js";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background-color text-text-color">
        <NotificationSystem />
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;
