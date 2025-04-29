import React, { useState } from "react";
import {
  FiChevronDown,
  FiChevronRight,
  FiGrid,
} from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const GridFlexboxCard = ({ gridFlexboxItems = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const [gridExpanded, setGridExpanded] = useState(false);
  const [flexboxExpanded, setFlexboxExpanded] = useState(false);

  // Don't render the component if no items exist
  if (!gridFlexboxItems || gridFlexboxItems.length === 0) {
    console.log("No Grid/Flexbox elements to display");
    return null;
  }

  // Filter items by type
  const gridItems = gridFlexboxItems.filter(
    (item) => item.type === "grid" || item.type === "grid+flexbox"
  );
  const flexboxItems = gridFlexboxItems.filter(
    (item) => item.type === "flexbox" || item.type === "grid+flexbox"
  );

  // Grid and flexbox counts
  const gridCount = gridItems.length;
  const flexboxCount = flexboxItems.length;

  // Group items by type for summary
  const implementationTypes = gridFlexboxItems.reduce((acc, item) => {
    if (!acc[item.implementation]) {
      acc[item.implementation] = 0;
    }
    acc[item.implementation]++;
    return acc;
  }, {});

  return (
    <div className="bg-[#e6e7ed] dark:bg-[#414868] rounded-lg overflow-hidden">
      {/* Main Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <span className="mr-3 text-[#7aa2f7] dark:text-[#7aa2f7]">
            <FiGrid />
          </span>
          <span className="text-[#343b58] dark:text-[#e6e7ed] font-semibold">
            CSS Grid & Flexbox
          </span>
        </div>
        <div className="flex items-center">
          <span className="bg-[#6c6e75] dark:bg-[#1a1b26] text-[#e6e7ed] dark:text-[#c0caf5] px-2 py-1 rounded-full text-xs mr-3 font-semibold">
            {gridFlexboxItems.length}
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
        <div className="border-t border-[#c9cacf] dark:border-[#343b58]">
          {/* Grid Section */}
          <div className="border-b border-[#c9cacf] dark:border-[#343b58]">
            <div
              className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-[#d1d5e3] dark:hover:bg-[#363b54]"
              onClick={() => setGridExpanded(!gridExpanded)}
            >
              <div className="flex items-center">
                <span className="text-[#343b58] dark:text-[#e6e7ed]">Grid</span>
              </div>
              <div className="flex items-center">
                <span className="bg-[#6c6e75] dark:bg-[#1a1b26] text-[#e6e7ed] dark:text-[#c0caf5] px-2 py-1 rounded-full text-xs mr-3 font-semibold">
                  {gridCount}
                </span>
                {gridExpanded ? (
                  <FiChevronDown className="text-[#343b58] dark:text-[#9aa5ce]" />
                ) : (
                  <FiChevronRight className="text-[#343b58] dark:text-[#9aa5ce]" />
                )}
              </div>
            </div>

            {/* Grid Items List */}
            {gridExpanded && (
              <div className="max-h-96 overflow-y-auto">
                <GridFlexboxList items={gridItems} />
              </div>
            )}
          </div>

          {/* Flexbox Section */}
          <div>
            <div
              className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-[#d1d5e3] dark:hover:bg-[#363b54]"
              onClick={() => setFlexboxExpanded(!flexboxExpanded)}
            >
              <div className="flex items-center">
                <span className="text-[#343b58] dark:text-[#e6e7ed]">
                  Flexbox
                </span>
              </div>
              <div className="flex items-center">
                <span className="bg-[#6c6e75] dark:bg-[#1a1b26] text-[#e6e7ed] dark:text-[#c0caf5] px-2 py-1 rounded-full text-xs mr-3 font-semibold">
                  {flexboxCount}
                </span>
                {flexboxExpanded ? (
                  <FiChevronDown className="text-[#343b58] dark:text-[#9aa5ce]" />
                ) : (
                  <FiChevronRight className="text-[#343b58] dark:text-[#9aa5ce]" />
                )}
              </div>
            </div>

            {/* Flexbox Items List */}
            {flexboxExpanded && (
              <div className="max-h-96 overflow-y-auto">
                <GridFlexboxList items={flexboxItems} />
              </div>
            )}
          </div>

          {/* Summary Footer */}
          <div className="px-4 py-2 border-t border-[#c9cacf] dark:border-[#343b58] text-sm text-[#343b58] dark:text-[#9aa5ce]">
            <div>
              Found {gridCount} grid and {flexboxCount} flexbox implementations
              {Object.keys(implementationTypes).length > 0 && (
                <span>
                  {" "}
                  (
                  {Object.entries(implementationTypes).map(
                    ([type, count], index, arr) => (
                      <React.Fragment key={type}>
                        {count} {type}
                        {index < arr.length - 1 ? ", " : ""}
                      </React.Fragment>
                    )
                  )}
                  )
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Grid/Flexbox List Component
const GridFlexboxList = ({ items }) => {
  return (
    <div>
      {items.map((item) => (
        <GridFlexboxItem key={item.id} item={item} />
      ))}
    </div>
  );
};

// Individual Grid/Flexbox Item Component
const GridFlexboxItem = ({ item }) => {
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  return (
    <div className="border-t border-[#c9cacf] dark:border-[#343b58]">
      <div
        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-[#d1d5e3] dark:hover:bg-[#363b54]"
        onClick={() => setDetailsExpanded(!detailsExpanded)}
      >
        <div className="flex-grow">
          <div className="flex items-center">
            <span className="font-medium">{item.selector}</span>
          </div>
          <div>
              <span className="text-xs text-[#9ece6a] dark:text-[#9ece6a]">
                {item.styles}
              </span>
            </div>
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
          {/* Show relevant details based on implementation type */}
          {item.implementation === "inline" && (
            <div className="mb-2 px-2">
              <div className="text-xs font-medium text-[#e6e7ed] dark:text-[#c0caf5] mb-1">
                Inline styles:
              </div>
              <div className="text-xs">
                <span className="text-[#7aa2f7] dark:text-[#7aa2f7]">
                  {item.styles}
                </span>
              </div>
            </div>
          )}

          {item.implementation === "internal-css" && (
            <div className="mb-2 px-2">
              <div className="text-xs font-medium text-[#e6e7ed] dark:text-[#c0caf5] mb-1">
                CSS Selector:{" "}
                <span className="text-[#7aa2f7] dark:text-[#7aa2f7]">
                  {item.selector}
                </span>
              </div>

              <div className="text-xs font-medium text-[#e6e7ed] dark:text-[#c0caf5] mt-2 mb-1">
                Styles:{" "}
                <span className="text-[#9ece6a] dark:text-[#9ece6a]">
                  {item.styles}
                </span>
              </div>
            </div>
          )}

          {item.implementation === "class-based" && (
            <div className="mb-2 px-2">
              <div className="text-xs font-medium text-[#e6e7ed] dark:text-[#c0caf5] mb-1">
                Classes:
              </div>
              <div className="text-xs">
                <span className="text-[#7aa2f7] dark:text-[#7aa2f7]">
                  {item.classes}
                </span>
              </div>
            </div>
          )}

          {/* HTML code display */}
          {item.element && (
            <SyntaxHighlighter
              language="css"
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
          )}
        </div>
      )}
    </div>
  );
};

export default GridFlexboxCard;
