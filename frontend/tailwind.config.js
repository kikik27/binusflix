/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        binus: {
          bg: '#07080A',
          surface: '#0D1017',
          card: '#0D1017',
          cardHover: '#141824',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(229, 9, 20, 0.4)',
          red: '#E50914',
          redDark: '#B20710',
          cyan: '#00D2FF',
          gold: '#FFB800',
          green: '#22C55E',
          muted: '#9CA3AF',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
