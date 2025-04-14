import React, { useState } from "react";
import EmptyState from "./ui/EmptyState.js";
import ExpandableCard from "./ui/ExpandableCard";
import TabSelector from "./ui/TabSelector.js";

const TabUI = ({
  libraries = [],
  alerts = [],
  expanded,
  toggleExpand,
  handleShare,
  copyStatus,
}) => {
  const [activeTab, setActiveTab] = useState("resources");

  // Handle tab switching
  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {/* Tab selector */}
      <TabSelector
        activeTab={activeTab}
        onTabChange={switchTab}
        librariesCount={libraries.length}
        alertsCount={alerts.length}
      />
      {/* Libraries content */}
      {activeTab === "resources" && (
        <div>
          {libraries.length === 0 ? (
            <EmptyState message="No libraries detected" />
          ) : (
            libraries.map((lib, index) => {
              // Remove leading whitespace from each line
              const cleanedLines = lib.lines
                .map((line) => line.trimStart())
                .join("\n");

              return (
                <ExpandableCard
                  key={index}
                  itemName={lib.name}
                  displayName={lib.name}
                  content={cleanedLines}
                  expanded={expanded}
                  toggleExpand={toggleExpand}
                  language={lib.syntaxHighlightType}
                />
              );
            })
          )}
        </div>
      )}

      {/* Alerts content */}
      {activeTab === "alerts" && (
        <div>
          {alerts.length === 0 ? (
            <EmptyState message="No alerts detected" />
          ) : (
            alerts.map((alert, index) => (
              <ExpandableCard
                key={index}
                itemName={`alert-${alert.id}`}
                displayName={alert.name}
                content={alert.code}
                expanded={expanded}
                toggleExpand={toggleExpand}
                language="javascript"
                type="alert"
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TabUI;
