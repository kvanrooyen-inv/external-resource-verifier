import React, { useState } from "react";
import { FiChevronDown, FiChevronRight, FiCheck } from "react-icons/fi";

const ResourcesCard = ({ libraries }) => {
  const [expanded, setExpanded] = useState(false);
  
  const totalCount = libraries.reduce((sum, lib) => sum + lib.count, 0);
  
  return (
    <div className="bg-[#1a202c] rounded-lg overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <span className="mr-3 text-green-500">
            <FiCheck />
          </span>
          <span className="text-white font-medium">
            External Resources
          </span>
        </div>
        <div className="flex items-center">
          <span className="bg-[#252a37] text-gray-300 px-2 py-1 rounded-full text-xs mr-3">
            {libraries.length}
          </span>
          {expanded ? <FiChevronDown className="text-gray-400" /> : <FiChevronRight className="text-gray-400" />}
        </div>
      </div>
      
      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-[#2d3748]">
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
    <div className="border-b border-[#2d3748] last:border-b-0">
      <div 
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setDetailsExpanded(!detailsExpanded)}
      >
        <span className="text-gray-300">{library.name}</span>
        <div className="flex items-center">
          <span className="bg-[#252a37] text-gray-300 px-2 py-1 rounded-full text-xs mr-3">
            {library.count}
          </span>
          {detailsExpanded ? <FiChevronDown className="text-gray-400" /> : <FiChevronRight className="text-gray-400" />}
        </div>
      </div>
      
      {detailsExpanded && (
        <div className="p-4 bg-[#0f1117]">
          <pre className="overflow-x-auto text-gray-300 text-sm">
            <code>{library.lines.join('\n')}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default ResourcesCard;
