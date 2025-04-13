import React from "react";

export const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-xl shadow-md max-w-xl bg-[#eff1f5] dark:bg-[#181825] ${className}`}
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
      className={`text-4xl text-center mb-5 font-semibold text-[#4c4f69] dark:text-[#cdd6f4] ${className}`}
    >
      {children}
    </h1>
  );
};

export const CardContent = ({ children, className = "" }) => {
  return (
    <div className={`p-4 text-[#4c4f69] dark:text-[#cdd6f4] ${className}`}>
      {children}
    </div>
  );
};
