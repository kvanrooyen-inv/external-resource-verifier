import React, { useState } from "react";
import { FiChevronDown, FiChevronRight, FiCheck } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const ResourcesCard = ({ libraries }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#e6e7ed] dark:bg-[#414868] rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <span className="mr-3 text-[#385f0d] dark:text-[#9ece6a]">
            <FiCheck />
          </span>
          <span className="text-[#343b58] dark:text-[#e6e7ed] font-semibold">External Resources</span>
        </div>
        <div className="flex items-center">
          <span className="bg-[#6c6e75] dark:bg-[#1a1b26] text-[#e6e7ed] dark:text-[#c0caf5] px-2 py-1 rounded-full text-xs mr-3 font-semibold">
            {libraries.length}
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
        <div>
          {libraries.map((library, index) => (
            <LibraryItem key={index} library={library} />
          ))}
        </div>
      )}
    </div>
  );
};

const LibraryItem = ({ library }) => {
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  return (
    <div>
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setDetailsExpanded(!detailsExpanded)}
      >
        <span className="text-[#343b58] dark:text-[#e6e7ed]">{library.name}</span>
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
            language="html"
            style={dracula}
            customStyle={{
              backgroundColor: "transparent",
              paddingTop: "1em",
              paddingBottom: "1em",
              fontSize: "0.875rem",
            }}
          >
            {library.lines.join("\n")}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};

export default ResourcesCard;