import React from "react";
import ResourcesCard from "./ResourcesCard";
import AlertsCard from "./AlertsCard";
import EmptyState from "./EmptyState";

const ResultsContainer = ({ libraries, alerts }) => {
  const hasResults = libraries.length > 0 || alerts.length > 0;
  
  if (!hasResults) {
    return (
      <EmptyState />
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-[#343b58] dark:text-[#c0caf5] text-xl font-medium mb-2 mt-2">Results</h2>
      
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