import React from "react";

const EmptyState = ({ message }) => (
  <div className="text-center text-[#d20f39] dark:text-[#f38na8] mt-4 flex items-center justify-center">
    <em-emoji shortcodes=":x:" set="apple" size="1em"></em-emoji>
    <span className="ml-2 mt-1">No resources or alertes detected.</span>
  </div>
);

export default EmptyState;
