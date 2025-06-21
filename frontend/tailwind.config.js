/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        purple: "#ad9ac7",
        nudepink: "#f5e1e6", // Example soft nude pink, adjust as needed
      },
    },
  },
  plugins: [],
}
