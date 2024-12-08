/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2c3e50',
        secondary: '#34495e',
        success: '#2ecc71',
        warning: '#f1c40f',
        danger: '#e74c3c',
        info: '#3498db',
      }
    },
  },
  plugins: [],
}