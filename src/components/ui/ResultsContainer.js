import React from "react";
import ResourcesCard from "./ResourcesCard";
import AlertsCard from "./AlertsCard";

const ResultsContainer = ({ libraries, alerts }) => {
  const hasResults = libraries.length > 0 || alerts.length > 0;
  
  if (!hasResults) {
    return (
      <div className="bg-[#1a202c] rounded-lg p-10 text-gray-400 text-center">
        <p>No external resources or JavaScript alerts were detected on this website.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-white text-xl font-medium mb-2 mt-2">Results</h2>
      
      {/* External Resources Section */}
      {libraries.length > 0 && (
        <ResourcesCard libraries={libraries} />
      )}
      
      {/* JavaScript Alerts Section */}
      {alerts.length > 0 && (
        <AlertsCard alerts={alerts} />
      )}
    </div>
  );
};

export default ResultsContainer;
