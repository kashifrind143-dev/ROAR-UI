/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: { 
        brand: { blue: "#0ea5e9", cyan: "#22d3ee" }
      },
      boxShadow: {
        glow: "0 0 28px rgba(34,211,238,0.45)",
      },
      keyframes: {
        slowspin: { to: { transform: "rotate(360deg)" } },
        floaty: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-5px)" },
          "100%": { transform: "translateY(0px)" }
        },
        pulse: {
          "0%,100%": { opacity: .9 },
          "50%": { opacity: .6 }
        }
      },
      animation: {
        slowspin: "slowspin 36s linear infinite",
        floaty: "floaty 7s ease-in-out infinite",
        pulse: "pulse 4s ease-in-out infinite"
      }
    },
  },
  plugins: [],
}
