/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F59E0B",
        dark: "#0B0F19",
        card: "#111827",
      },
    },
  },
  plugins: [],
};
