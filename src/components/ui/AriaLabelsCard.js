import React, { useState, useEffect } from "react";
import { FiChevronDown, FiChevronRight, FiTag } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const SimplifiedAriaLabelsCard = ({ ariaLabels = [] }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-[#e6e7ed] dark:bg-[#414868] rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <span className="mr-3 text-[#5a3e8e] dark:text-[#bb9af7]">
            <FiTag />
          </span>
          <span className="text-[#343b58] dark:text-[#e6e7ed] font-semibold">ARIA Attributes</span>
        </div>
        <div className="flex items-center">
          <span className="bg-[#6c6e75] dark:bg-[#1a1b26] text-[#e6e7ed] dark:text-[#c0caf5] px-2 py-1 rounded-full text-xs mr-3 font-semibold">
            {ariaLabels.length}
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
            {ariaLabels.length > 0 ? (
              <SimplifiedListView ariaLabels={ariaLabels} />
            ) : (
              <div className="px-4 py-3 text-[#343b58] dark:text-[#e6e7ed]">
                No ARIA attributes found on this page.
              </div>
            )}
          </div>
          
          {/* Summary Footer */}
          <div className="px-4 py-2 border-t border-[#c9cacf] dark:border-[#343b58] text-sm text-[#343b58] dark:text-[#9aa5ce]">
            {ariaLabels.length} attributes displayed
          </div>
        </>
      )}
    </div>
  );
};

// Simplified List View Component
const SimplifiedListView = ({ ariaLabels }) => {
  return (
    <div>
      {ariaLabels.map(item => (
        <AttributeItem key={item.id} item={item} />
      ))}
    </div>
  );
};

// Individual Attribute Item Component
const AttributeItem = ({ item }) => {
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  
  const elementType = item.elementType || item.element.match(/<([a-z0-9]+)/i)?.[1] || 'element';
  const attributeName = item.attribute;
  const attributeValue = item.value || '';
  
  return (
    <div className="border-t border-[#c9cacf] dark:border-[#343b58]">
      <div
        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-[#d1d5e3] dark:hover:bg-[#363b54]"
        onClick={() => setDetailsExpanded(!detailsExpanded)}
      >
        <div className="flex-grow">
          <div className="flex items-center">
            <span className="text-[#7e3992] dark:text-[#bb9af7]">
              {attributeName}
            </span>
            <span className="mx-1 text-[#343b58] dark:text-[#e6e7ed]">=</span>
            <span className="text-[#2e5916] dark:text-[#9ece6a] truncate max-w-[200px]">
              "{attributeValue}"
            </span>
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

export default SimplifiedAriaLabelsCard;