import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`rounded-lg shadow-md max-w-xl bg-slate-50 dark:bg-zinc-900 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '' }) => {
  return (
    <h1 className={`text-4xl font-semibold text-slate-900 dark:text-zinc-100 ${className}`}>
      {children}
    </h1>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`p-4 text-slate-900 dark:text-zinc-100 ${className}`}>
      {children}
    </div>
  );
};
