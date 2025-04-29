import React, { useState } from "react";
import { FiChevronDown, FiChevronRight, FiLayout, FiInfo } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const SemanticHTMLCard = ({ semanticElements = [], semanticScore }) => {
  const [expanded, setExpanded] = useState(false);
  console.log("Rendering SemanticHTMLCard with", semanticElements.length, "elements");
  console.log("Semantic score:", semanticScore);

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

  // Get unique tag types and their counts
  const tagCounts = Object.keys(groupedElements).map(tagName => ({
    tagName,
    count: groupedElements[tagName].length
  }));

  // Score color based on value
  const getScoreColor = (score) => {
    if (score >= 75) return "text-green-500 dark:text-green-400";
    if (score >= 50) return "text-blue-500 dark:text-blue-400";
    if (score >= 25) return "text-yellow-500 dark:text-yellow-400";
    return "text-red-500 dark:text-red-400";
  };

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
          
          {semanticScore && (
            <div className="ml-3 flex items-center">
              <div className={`text-sm font-bold ${getScoreColor(semanticScore.score)}`}>
                {semanticScore.score}/100
              </div>
            </div>
          )}
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
          {/* Score and Analysis */}
          {semanticScore && (
            <div className="px-4 py-3 border-t border-[#c9cacf] dark:border-[#343b58] bg-[#d1d5e3] dark:bg-[#363b54]">
              <div className="flex items-start">
                <FiInfo className="mt-1 mr-2 text-[#343b58] dark:text-[#9aa5ce]" />
                <div>
                  <h3 className="text-sm font-medium text-[#343b58] dark:text-[#e6e7ed] mb-1">
                    Analysis
                  </h3>
                  <p className="text-sm text-[#343b58] dark:text-[#9aa5ce]">
                    {semanticScore.analysis}
                  </p>
                  <div className="mt-2 text-xs text-[#343b58] dark:text-[#9aa5ce]">
                    {semanticScore.elementCount?.semantic || semanticElements.length} semantic elements out of {semanticScore.elementCount?.total || "unknown"} total elements
                  </div>
                </div>
              </div>
              
              {/* Score visualization */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#343b58] dark:text-[#9aa5ce]">Poor</span>
                  <span className="text-[#343b58] dark:text-[#9aa5ce]">Excellent</span>
                </div>
                <div className="h-2 w-full bg-[#c9cacf] dark:bg-[#1a1b26] rounded overflow-hidden">
                  <div 
                    className={`h-full ${
                      semanticScore.score >= 75 ? "bg-green-500" : 
                      semanticScore.score >= 50 ? "bg-blue-500" : 
                      semanticScore.score >= 25 ? "bg-yellow-500" : 
                      "bg-red-500"
                    }`}
                    style={{ width: `${semanticScore.score}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Summary of tags */}
          <div className="px-4 py-2 border-t border-[#c9cacf] dark:border-[#343b58] bg-[#d1d5e3] dark:bg-[#363b54]">
            <h3 className="text-sm font-medium text-[#343b58] dark:text-[#e6e7ed] mb-2">Tag Summary</h3>
            <div className="flex flex-wrap gap-2">
              {tagCounts.map(({ tagName, count }) => (
                <div key={tagName} className="bg-[#343b58] dark:bg-[#1a1b26] text-[#e6e7ed] px-2 py-1 rounded text-xs">
                  <span className="font-mono">&lt;{tagName}&gt;</span>: {count}
                </div>
              ))}
            </div>
          </div>

          {/* Content Display */}
          <div className="max-h-96 overflow-y-auto">
            {Object.entries(groupedElements).map(([tagName, elements]) => (
              <SemanticTagGroup key={tagName} tagName={tagName} elements={elements} />
            ))}
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

// Semantic Tag Group Component
const SemanticTagGroup = ({ tagName, elements }) => {
  const [groupExpanded, setGroupExpanded] = useState(false);

  return (
    <div className="border-t border-[#c9cacf] dark:border-[#343b58]">
      <div
        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-[#d1d5e3] dark:hover:bg-[#363b54]"
        onClick={() => setGroupExpanded(!groupExpanded)}
      >
        <div className="flex items-center">
          <span className="text-[#343b58] dark:text-[#e6e7ed] font-medium font-mono">
            &lt;{tagName}&gt;
          </span>
          <span className="ml-2 text-[#6c6e75] dark:text-[#9aa5ce] text-sm">
            ({elements.length})
          </span>
        </div>
        <div>
          {groupExpanded ? (
            <FiChevronDown className="text-[#343b58] dark:text-[#9aa5ce]" />
          ) : (
            <FiChevronRight className="text-[#343b58] dark:text-[#9aa5ce]" />
          )}
        </div>
      </div>

      {groupExpanded && (
        <div>
          {elements.map((element, index) => (
            <SemanticElementItem key={`${tagName}-${index}`} element={element} />
          ))}
        </div>
      )}
    </div>
  );
};

// Individual Semantic Element Item Component
const SemanticElementItem = ({ element }) => {
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  
  // Format element display content
  const getDisplayContent = () => {
    // Show a preview of the element content or text
    if (element.content) {
      // Truncate content if it's too long
      return element.content.length > 50
        ? `${element.content.substring(0, 50)}...`
        : element.content;
    }
    return null;
  };

  // Determine if element has attributes to show
  const hasAttributes = element.attributes && Object.keys(element.attributes).length > 0;

  return (
    <div className="border-t border-[#c9cacf] dark:border-[#343b58]">
      <div
        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-[#d1d5e3] dark:hover:bg-[#363b54] pl-8"
        onClick={() => setDetailsExpanded(!detailsExpanded)}
      >
        <div className="flex-grow">
          <div className="flex items-center">
            <span className="text-[#343b58] dark:text-[#e6e7ed] font-medium">
              Element {element.id || ""}
            </span>
          </div>
          {getDisplayContent() && (
            <div className="text-xs text-[#6c6e75] dark:text-[#9aa5ce] mt-1">
              <span className="text-[#2e5916] dark:text-[#9ece6a]">
                {getDisplayContent()}
              </span>
            </div>
          )}
          {hasAttributes && (
            <div className="text-xs text-[#6c6e75] dark:text-[#9aa5ce] mt-1">
              {Object.keys(element.attributes).length} attribute(s)
            </div>
          )}
          <div className="text-xs text-[#6c6e75] dark:text-[#9aa5ce]">
            Line {element.lineNumber || "Unknown"}
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
          {hasAttributes && (
            <div className="mb-2 px-2">
              <div className="text-xs font-medium text-[#e6e7ed] dark:text-[#c0caf5] mb-1">Attributes:</div>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(element.attributes).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="text-[#7aa2f7] dark:text-[#7aa2f7]">{key}</span>
                    <span className="text-[#e6e7ed] dark:text-[#e6e7ed]">=</span>
                    <span className="text-[#9ece6a] dark:text-[#9ece6a]">"{value}"</span>
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
            {element.element}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};

export default SemanticHTMLCard;