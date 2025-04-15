import React from "react";

export const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-xl shadow-md max-w-xl bg-[#e6e7ed] dark:bg-[#1a1b26] ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className = "" }) => {
  return (
    <h1
      className={`text-4xl text-center mb-5 font-semibold text-[#343b58] dark:text-[#c0caf5] ${className}`}
    >
      {children}
    </h1>
  );
};

export const CardContent = ({ children, className = "" }) => {
  return (
    <div className={`p-4 text-[#343b58] dark:text-[#c0caf5] ${className}`}>
      {children}
    </div>
  );
};