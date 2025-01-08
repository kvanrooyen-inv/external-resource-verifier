import React from 'react';

export const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = ''
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border border-[#dce0e8] dark:border-[#313244] rounded-md
        bg-[#dce0e8] dark:bg-[#313244]
        text-[#4c4f69] dark:text-[#cdd6f4]
        placeholder-[#9ca0b0] dark:placeholder-[#6c7086]
        focus:outline-none focus:ring-2 focus:ring-[#1e66f5] dark:focus:ring-[#89b4fa]
        ${className}`}
    />
  );
};
