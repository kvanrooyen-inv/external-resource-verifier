import React, { useState } from "react";
import EmptyState from "./ui/EmptyState.js";
import ExpandableCard from "./ui/ExpandableCard";
import TabButton from "./ui/TabButton";
import AlertBadge from "./ui/AlertBadge";
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
    <div className="space-y-4">
      {/* Share button and copied notification */}
      <div className="flex justify-end">
        <button
          onClick={handleShare}
          className="text-[#4c4f69] dark:text-[#cdd6f4] hover:text-[#1e66f5] dark:hover:text-[#89b4fa] text-sm"
          title="Share Results"
        ></button>
      </div>

      {/* Tab selector */}
      <TabSelector
        activeTab={activeTab}
        onTabChange={switchTab}
        librariesCount={libraries.length}
        alertsCount={alerts.length}
      />
      {/* Tab content */}
      <div className="mt-4">
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
    </div>
  );
};

export default TabUI;
