import React from "react";

const CopyNotification = ({ visible }) =>
  visible ? (
    <div className="absolute top-4 bg-[#313244] text-[#cdd6f4] px-4 py-2 rounded-md shadow-md text-sm">
      Share link copied!
    </div>
  ) : null;

export default CopyNotification;
