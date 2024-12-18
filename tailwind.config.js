/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Custom color palette mapping
      backgroundColor: {
        'background-color': 'var(--background-color)',
        'card-background': 'var(--card-background)',
        'input-background': 'var(--input-background)',
        'button-background': 'var(--button-background)',
      },
      textColor: {
        'text-color': 'var(--text-color)',
      },
      borderColor: {
        'input-border': 'var(--input-border)',
      },
      // Add border and ring utilities to match dark theme
      borderWidth: {
        DEFAULT: '1px',
        '0': '0',
        '2': '2px',
        '3': '3px',
        '4': '4px',
      },
      ringColor: {
        DEFAULT: 'transparent',
        'dark': 'transparent',
      },
      borderColor: {
        DEFAULT: 'var(--input-border)',
        'dark': 'transparent',
      }
    },
  },
  plugins: [],
}
