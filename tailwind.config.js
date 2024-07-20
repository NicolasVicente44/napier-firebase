/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        "md-custom": "1080px",
        "md-button": "960px",
      },
    },
  },
  plugins: [],
};
