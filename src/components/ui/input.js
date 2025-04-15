import React from "react";

export const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border border-[#ccd0da] dark:border-[#494d64] rounded-md
        bg-[#e6e7ed] dark:bg-[#414868]
        text-[#343b58] dark:text-[#c0caf5]
        placeholder-[#6c6e75] dark:placeholder-[#9aa5ce]
        focus:outline-none focus:ring-2 focus:ring-[#2959aa] dark:focus:ring-[#7aa2f7]
        ${className}`}
    />
  );
};
