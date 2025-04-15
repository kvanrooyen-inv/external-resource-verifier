import React from "react";

const EmptyState = ({ message }) => (
  <div className="text-center text-[#8c4351] dark:text-[#f7768e] mt-4 flex items-center justify-center">
    <em-emoji shortcodes=":x:" set="apple" size="1em"></em-emoji>
    <span className="ml-2 mt-1">No resources or alerts detected.</span>
  </div>
);

export default EmptyState;