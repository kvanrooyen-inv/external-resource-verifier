import React from "react";

const AlertBadge = ({ count }) => (
  <span className="ml-2 bg-[#f38ba8] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
    {count}
  </span>
);

export default AlertBadge;
