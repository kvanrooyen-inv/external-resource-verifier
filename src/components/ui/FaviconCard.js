import React, { useState } from "react";
import { FiChevronDown, FiChevronRight, FiImage } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const FaviconCard = ({ favicon = { exists: false, icons: [] } }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Don't render the component if no favicon exists
  if (!favicon.exists || favicon.icons.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-[#e6e7ed] dark:bg-[#414868] rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <span className="mr-3 text-[#006c86] dark:text-[#2ac3de]">
            <FiImage />
          </span>
          <span className="text-[#343b58] dark:text-[#e6e7ed] font-semibold">Favicon</span>
        </div>
        <div className="flex items-center">
        <span className="bg-[#6c6e75] dark:bg-[#1a1b26] text-[#e6e7ed] dark:text-[#c0caf5] px-2 py-1 rounded-full text-xs mr-3 font-semibold">
            {favicon.icons.length}
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
            <FaviconList icons={favicon.icons} />
          </div>
          
          {/* Summary Footer */}
          <div className="px-4 py-2 border-t border-[#c9cacf] dark:border-[#343b58] text-sm text-[#343b58] dark:text-[#9aa5ce]">
            {`${favicon.icons.length} favicon element${favicon.icons.length !== 1 ? 's' : ''} found`}
          </div>
        </>
      )}
    </div>
  );
};

// Favicon List Component
const FaviconList = ({ icons }) => {
  return (
    <div>
      {icons.map(item => (
        <FaviconItem key={item.id} item={item} />
      ))}
    </div>
  );
};

// Individual Favicon Item Component
const FaviconItem = ({ item }) => {
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  
  return (
    <div className="border-t border-[#c9cacf] dark:border-[#343b58]">
      <div
        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-[#d1d5e3] dark:hover:bg-[#363b54]"
        onClick={() => setDetailsExpanded(!detailsExpanded)}
      >
        <div className="flex-grow">
          <div className="flex items-center">
            <span className="text-[#343b58] dark:text-[#e6e7ed] font-medium">
              {item.name}
            </span>
          </div>
          <div className="text-xs text-[#6c6e75] dark:text-[#9aa5ce] mt-1">
            <span className="text-[#2e5916] dark:text-[#9ece6a]">{item.href}</span>
          </div>
          <div className="text-xs text-[#6c6e75] dark:text-[#9aa5ce]">
            Line {item.lineNumber}
          </div>
        </div>
        <div className="flex items-center ml-2">
          {detailsExpanded ? (
            <FiChevronDown className="text-[#343b58] dark:text-[#9aa5ce]" />
          ) : (
            <FiChevronRight className="text-[#343b58] dark:text-[#9aa5ce]" />
          )}
        </div>
      </div>

      {detailsExpanded && (
        <div className="bg-[#343b58] dark:bg-[#24283b] p-2">
          <SyntaxHighlighter
            language="html"
            style={dracula}
            customStyle={{
              backgroundColor: "transparent",
              paddingTop: "1em",
              paddingBottom: "1em",
              fontSize: "0.875rem",
            }}
          >
            {item.element}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};

export default FaviconCard;