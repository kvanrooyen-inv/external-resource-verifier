import React, { useContext } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button 
      onClick={toggleTheme} 
      className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full"
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};

export default ThemeToggle;
