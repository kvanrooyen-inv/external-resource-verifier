import React from 'react';

export const Button = ({
  children,
  onClick,
  className = '',
  type = 'button'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-md bg-[#5a3e8e] dark:bg-[#bb9af7] text-[#e6e7ed] hover:bg-[#0f4b6e] dark:hover:bg-[#7dcfff] font-bold ${className}`}
    >
      {children}
    </button>
  );
};