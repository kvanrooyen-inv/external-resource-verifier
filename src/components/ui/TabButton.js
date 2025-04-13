import React from "react";

const TabButton = ({ active, onClick, children, type = "default" }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 px-4 ${
      active
        ? type === "alert"
          ? "bg-[#ef9f76] text-white font-medium"
          : "bg-[#89b4fa] text-white font-medium"
        : "bg-[#313244] text-[#cdd6f4]"
    }`}
  >
    {children}
  </button>
);
export default TabButton;
