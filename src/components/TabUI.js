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
  copyStatus 
}) => {
  const [activeTab, setActiveTab] = useState('resources');
  
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
        > 
        </button>
      </div>
      
      {/* Tab selector */}
      <div className="flex rounded-lg overflow-hidden">
        <button
          onClick={() => switchTab('resources')}
          className={`flex-1 py-3 px-4 ${
            activeTab === 'resources'
              ? 'bg-[#89b4fa] text-white font-medium'
              : 'bg-[#313244] text-[#cdd6f4]'
          }`}
        >
          External Resources ({libraries.length})
        </button>
        <button
          onClick={() => switchTab('alerts')}
          className={`flex-1 py-3 px-4 ${
            activeTab === 'alerts'
              ? 'bg-[#ef9f76] text-white font-medium'
              : 'bg-[#313244] text-[#cdd6f4]'
          }`}
        >
          <div className="flex items-center justify-center">
            JavaScript Alerts
            {alerts.length > 0 && (
              <span className="ml-2 bg-[#f38ba8] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {alerts.length}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {/* Libraries content */}
        {activeTab === 'resources' && (
          <div>
            {libraries.length === 0 ? (
              <div className="text-center text-[#d20f39] dark:text-[#f38ba8] mt-4 flex items-center justify-center">
                <em-emoji shortcodes=":x:" set="apple" size="1em"></em-emoji>
                <span className="ml-2 mt-1">No libraries detected</span>
              </div>
            ) : (
              libraries.map((lib, index) => {
                // Remove leading whitespace from each line
                const cleanedLines = lib.lines.map(line => line.trimStart()).join('\n');


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
            alerts.map((alert, index) => {
              // Try to find the code content in various possible properties
              let content = alert.code;

              if (!content && alert.line) {
                content = alert.line;
              } else if (
                !content &&
                alert.lines &&
                Array.isArray(alert.lines)
              ) {
                content = alert.lines.join("\n");
              } else if (!content) {
                content = "No content available";
              }

              // Make sure we have an ID or use index as fallback
              const itemId = alert.id || index;

              return (
                <ExpandableCard
                  key={index}
                  itemName={`alert-${itemId}`}
                  displayName={alert.name || `Alert ${index + 1}`}
                  content={content}
                  expanded={expanded}
                  toggleExpand={toggleExpand}
                  language="javascript"
                  type="alert"
                />
              );
            })
          )}
        </div>
      )}{" "}

    </div>
  );
};

export default TabUI;
