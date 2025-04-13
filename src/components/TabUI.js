import React, { useState } from "react";
import EmptyState from "./ui/EmptyState.js";
import ExpandableCard from "./ui/ExpandableCard";
import TabButton from "./ui/TabButton";
import AlertBadge from "./ui/AlertBadge";

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
      <div className="flex rounded-lg overflow-hidden">
        <TabButton
          active={activeTab === "resources"}
          onClick={() => switchTab("resources")}
        >
          External Resources ({libraries.length})
        </TabButton>

        <TabButton
          active={activeTab === "alerts"}
          onClick={() => switchTab("alerts")}
        >
          <div className="flex items-center justify-center">
            JavaScript Alerts
            {alerts.length > 0 && <AlertBadge count={alerts.length} />}
          </div>
        </TabButton>
      </div>

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
                    icon={{
                      className: "text-[#40a02b] dark:text-[#a6e3a1]",
                      emoji: ":white_check_mark:",
                    }}
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
                  icon={{
                    className: "text-[#f38ba8]",
                    emoji: ":warning:",
                  }}
                  content={alert.code}
                  expanded={expanded}
                  toggleExpand={toggleExpand}
                  language="javascript"
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
