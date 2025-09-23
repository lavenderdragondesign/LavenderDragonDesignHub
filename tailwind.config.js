/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: "#1e2a3a",
          neon: "#38ff9c"
        }
      },
      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,0.08)"
      },
      borderRadius: {
        card: "1.25rem"
      }
    },
  },
  plugins: [],
}
