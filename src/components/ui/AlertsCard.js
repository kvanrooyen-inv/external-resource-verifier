import React, { useState } from "react";
import { FiChevronDown, FiChevronRight, FiAlertTriangle } from "react-icons/fi";

const AlertsCard = ({ alerts }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-[#1a202c] rounded-lg overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <span className="mr-3 text-yellow-500">
            <FiAlertTriangle />
          </span>
          <span className="text-white font-medium">
            JavaScript Alerts
          </span>
        </div>
        <div className="flex items-center">
          <span className="bg-[#252a37] text-gray-300 px-2 py-1 rounded-full text-xs mr-3">
            {alerts.length}
          </span>
          {expanded ? <FiChevronDown className="text-gray-400" /> : <FiChevronRight className="text-gray-400" />}
        </div>
      </div>
      
      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-[#2d3748]">
          {alerts.map((alert, index) => (
            <AlertItem key={index} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
};

const AlertItem = ({ alert }) => {
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  
  return (
    <div className="border-b border-[#2d3748] last:border-b-0">
      <div 
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setDetailsExpanded(!detailsExpanded)}
      >
        <span className="text-gray-300">{alert.name}</span>
        <div className="flex items-center">
          {detailsExpanded ? <FiChevronDown className="text-gray-400" /> : <FiChevronRight className="text-gray-400" />}
        </div>
      </div>
      
      {detailsExpanded && (
        <div className="p-4 bg-[#0f1117]">
          <pre className="overflow-x-auto text-gray-300 text-sm">
            <code>{alert.code}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default AlertsCard;
