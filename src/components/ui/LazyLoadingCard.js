import React, { useState } from "react";
import { FiChevronDown, FiChevronRight, FiClock } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const LazyLoadingCard = ({ lazyLoadedElements = [] }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-[#e6e7ed] dark:bg-[#414868] rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <span className="mr-3 text-[#965027] dark:text-[#ff9e64]">
            <FiClock />
          </span>
          <span className="text-[#343b58] dark:text-[#e6e7ed] font-semibold">Lazy Loading</span>
        </div>
        <div className="flex items-center">
          <span className="bg-[#6c6e75] dark:bg-[#1a1b26] text-[#e6e7ed] dark:text-[#c0caf5] px-2 py-1 rounded-full text-xs mr-3 font-semibold">
            {lazyLoadedElements.length}
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
            {lazyLoadedElements.length > 0 ? (
              <LazyLoadingList lazyLoadedElements={lazyLoadedElements} />
            ) : (
              <div className="px-4 py-3 text-[#343b58] dark:text-[#e6e7ed]">
                No lazy loading elements found on this page.
              </div>
            )}
          </div>
          
          {/* Summary Footer */}
          <div className="px-4 py-2 border-t border-[#c9cacf] dark:border-[#343b58] text-sm text-[#343b58] dark:text-[#9aa5ce]">
            {lazyLoadedElements.length} lazy loading elements found
          </div>
        </>
      )}
    </div>
  );
};

// Lazy Loading List Component
const LazyLoadingList = ({ lazyLoadedElements }) => {
  return (
    <div>
      {lazyLoadedElements.map(item => (
        <LazyLoadingItem key={item.id} item={item} />
      ))}
    </div>
  );
};

// Individual Lazy Loading Item Component
const LazyLoadingItem = ({ item }) => {
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  
  const elementType = item.elementType || 'element';
  const lazyType = item.type;
  
  return (
    <div className="border-t border-[#c9cacf] dark:border-[#343b58]">
      <div
        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-[#d1d5e3] dark:hover:bg-[#363b54]"
        onClick={() => setDetailsExpanded(!detailsExpanded)}
      >
        <div className="flex-grow">
          <div className="flex items-center">
            <span className="text-[#343b58] dark:text-[#e6e7ed] font-medium">
              &lt;{elementType}&gt;
            </span>
            <span className="ml-2 text-[#7e3992] dark:text-[#bb9af7]">
              {lazyType === 'native' ? 'loading="lazy"' : 
               lazyType === 'data-src' ? 'data-src' : 
               'IntersectionObserver'}
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

export default LazyLoadingCard;