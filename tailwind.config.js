/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { blue: "#0ea5e9", cyan: "#22d3ee" },
        'neon-blue': '#00BFFF',
        'neon-purple': '#A020F0',
        'neon-orange': '#FFAC1C'
      },
      boxShadow: {
        glow: "0 0 28px rgba(34,211,238,0.45)",
        'glow-neon-blue': '0 0 15px #00BFFF, 0 0 5px #00BFFF',
        'glow-neon-purple': '0 0 15px #A020F0, 0 0 5px #A020F0',
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
        },
        glowPulse: {
          "0%, 100%": { "box-shadow": "0 0 28px rgba(34,211,238,0.45)" },
          "50%": { "box-shadow": "0 0 40px rgba(34,211,238,0.8)" }
        }
      },
      animation: {
        slowspin: "slowspin 36s linear infinite",
        floaty: "floaty 7s ease-in-out infinite",
        pulse: "pulse 4s ease-in-out infinite",
        glowPulse: "glowPulse 4s ease-in-out infinite"
      }
    },
  },
  plugins: [],
}
