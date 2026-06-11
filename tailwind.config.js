/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        brand: {
          50: '#f1f5f9',
          100: '#e2e8f0',
          500: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(15, 23, 42, 0.08)',
        'glow': '0 0 0 4px rgba(14, 165, 233, 0.15)',
      },
    },
  },
  plugins: [],
};
