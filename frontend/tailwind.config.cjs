/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: '#6d28d9',
        accent: '#06b6d4'
      }
    },
  },
  plugins: [],
};
