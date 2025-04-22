import React, { useState } from "react";
import { FiChevronDown, FiChevronRight, FiAlertTriangle } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const AlertsCard = ({ alerts }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#e6e7ed] dark:bg-[#414868] rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <span className="mr-3 text-[#8c4351] dark:text-[#f7768e]">
            <FiAlertTriangle />
          </span>
          <span className="text-[#343b58] dark:text-[#e6e7ed] font-semibold">JavaScript Alerts</span>
        </div>
        <div className="flex items-center">
          <span className="bg-[#6c6e75] dark:bg-[#1a1b26] text-[#e6e7ed] dark:text-[#c0caf5] px-2 py-1 rounded-full text-xs mr-3 font-semibold">
            {alerts.length}
          </span>
          {expanded ? (
            <FiChevronDown className="text-[#343b58] dark:text-[#9aa5ce]" />
          ) : (
            <FiChevronRight className="text-[#343b58] dark:text-[#9aa5ce]" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <>
          {/* Content Display */}
          <div className="max-h-96 overflow-y-auto">
            {alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <AlertItem key={index} alert={alert} />
              ))
            ) : (
              <div className="px-4 py-3 text-[#343b58] dark:text-[#e6e7ed]">
                No JavaScript alerts found on this page.
              </div>
            )}
          </div>
          
          {/* Summary Footer */}
          <div className="px-4 py-2 border-t border-[#c9cacf] dark:border-[#343b58] text-sm text-[#343b58] dark:text-[#9aa5ce]">
            {alerts.length} alerts displayed
          </div>
        </>
      )}
    </div>
  );
};

const AlertItem = ({ alert }) => {
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  return (
    <div className="border-t border-[#c9cacf] dark:border-[#343b58]">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#d1d5e3] dark:hover:bg-[#363b54]"
        onClick={() => setDetailsExpanded(!detailsExpanded)}
      >
        <div className="flex-grow">
          <span className="text-[#343b58] dark:text-[#e6e7ed]">{alert.name}</span>
          <div className="text-xs text-[#6c6e75] dark:text-[#9aa5ce]">
            Line {alert.lineNumber}
          </div>
        </div>
        <div className="flex items-center">
          {detailsExpanded ? (
            <FiChevronDown className="text-[#343b58] dark:text-[#9aa5ce]" />
          ) : (
            <FiChevronRight className="text-[#343b58] dark:text-[#9aa5ce]" />
          )}
        </div>
      </div>

      {detailsExpanded && (
        <div className="bg-[#343b58] dark:bg-[#24283b] p-2 rounded-b-lg">
          <SyntaxHighlighter
            language="javascript"
            style={dracula}
            customStyle={{
              backgroundColor: "transparent",
              paddingTop: "1em",
              paddingBottom: "1em",
              fontSize: "0.875rem",
            }}
          >
            {alert.code || ''}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};

export default AlertsCard;