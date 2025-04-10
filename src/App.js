import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ThemeToggle from './components/ThemeToggle';
import StandardUI from './components/StandardUI';
import ReportPage from './components/ReportPage';
import NotificationSystem from './components/NotificationSystem.js';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background-color text-text-color">
        <ThemeToggle />
        <NotificationSystem />
        <Routes>
          <Route path="/" element={<StandardUI />} />
          <Route path="/report/:reportId" element={<ReportPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
