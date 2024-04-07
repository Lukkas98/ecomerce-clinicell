/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./jsconfig.json"
  ],
  theme: {
    extend: {
      colors: {
        "white-2": "#E7ECEF",
        "blue-primary": "#274C77",
        "blue-medium": "#6096BA",
        "blue-light": "#A3CEF1",
        "gray-2": "#8B8C89",
      },
    },
  },
  plugins: [],
};
