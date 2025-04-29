import React, { useState } from "react";
import {
  FiChevronDown,
  FiChevronRight,
  FiLayout,
} from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const SemanticHTMLCard = ({ semanticElements = [] }) => {
  const [expanded, setExpanded] = useState(false);

  // Don't render the component if no semantic elements exist
  if (!semanticElements || semanticElements.length === 0) {
    console.log("No semantic elements to display");
    return null;
  }

  // Group elements by tag type
  const groupedElements = semanticElements.reduce((acc, element) => {
    const tagName = element.tagName.toLowerCase();
    if (!acc[tagName]) {
      acc[tagName] = [];
    }
    acc[tagName].push(element);
    return acc;
  }, {});

  return (
    <div className="bg-[#e6e7ed] dark:bg-[#414868] rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <span className="mr-3 text-[#7aa2f7] dark:text-[#7aa2f7]">
            <FiLayout />
          </span>
          <span className="text-[#343b58] dark:text-[#e6e7ed] font-semibold">
            Semantic HTML
          </span>
        </div>
        <div className="flex items-center">
          <span className="bg-[#6c6e75] dark:bg-[#1a1b26] text-[#e6e7ed] dark:text-[#c0caf5] px-2 py-1 rounded-full text-xs mr-3 font-semibold">
            {semanticElements.length}
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
            <SemanticElementsList elements={semanticElements} />
          </div>

          {/* Summary Footer */}
          <div className="px-4 py-2 border-t border-[#c9cacf] dark:border-[#343b58] text-sm text-[#343b58] dark:text-[#9aa5ce]">
            {`${semanticElements.length} semantic element${semanticElements.length !== 1 ? "s" : ""} found across ${Object.keys(groupedElements).length} tag type${Object.keys(groupedElements).length !== 1 ? "s" : ""}`}
          </div>
        </>
      )}
    </div>
  );
};

// Semantic Elements List Component
const SemanticElementsList = ({ elements }) => {
  return (
    <div>
      {elements.map((item) => (
        <SemanticElementItem key={item.id} item={item} />
      ))}
    </div>
  );
};

// Individual Semantic Element Item Component (updated to match MetaTagItem style)
const SemanticElementItem = ({ item }) => {
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  // Determine the display name based on tag name
  const getDisplayName = () => {
    return `<${item.tagName.toLowerCase()}>`;
  };

  // Format element content for display
  const getContentPreview = () => {
    if (item.content) {
      return item.content.length > 50
        ? `${item.content.substring(0, 50)}...`
        : item.content;
    }
    return "";
  };

  return (
    <div className="border-t border-[#c9cacf] dark:border-[#343b58]">
      <div
        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-[#d1d5e3] dark:hover:bg-[#363b54]"
        onClick={() => setDetailsExpanded(!detailsExpanded)}
      >
        <div className="flex-grow">
          <div className="flex items-center">
            <span className="text-[#343b58] dark:text-[#e6e7ed] font-medium font-mono">
              {getDisplayName()}
            </span>
          </div>
          {item.content && (
            <div className="text-xs text-[#6c6e75] dark:text-[#9aa5ce] mt-1">
              <span className="text-[#2e5916] dark:text-[#9ece6a]">
                {getContentPreview()}
              </span>
            </div>
          )}
          <div className="text-xs text-[#6c6e75] dark:text-[#9aa5ce]">
            Line {item.lineNumber || "Unknown"}
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
          {/* Show attributes if available */}
          {item.attributes && Object.keys(item.attributes).length > 0 && (
            <div className="mb-2 px-2">
              <div className="text-xs font-medium text-[#e6e7ed] dark:text-[#c0caf5] mb-1">
                Attributes:
              </div>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(item.attributes).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="text-[#7aa2f7] dark:text-[#7aa2f7]">
                      {key}
                    </span>
                    <span className="text-[#e6e7ed] dark:text-[#e6e7ed]">
                      =
                    </span>
                    <span className="text-[#9ece6a] dark:text-[#9ece6a]">
                      "{value}"
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HTML code display */}
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

export default SemanticHTMLCard;