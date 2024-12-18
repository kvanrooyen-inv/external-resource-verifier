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
      className={`px-4 py-2 rounded-md bg-blue-800 text-white hover:bg-blue-500 ${className}`}
    >
      {children}
    </button>
  );
};

