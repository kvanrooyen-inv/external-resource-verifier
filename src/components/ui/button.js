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
      className={`px-4 py-2 rounded-md bg-[#1e66f5] dark:bg-[#89b4fa] text-[#eff1f5] hover:bg-[#04a5e5] dark:hover:bg-[#74c7ec] font-bold ${className}`}
    >
      {children}
    </button>
  );
};
