/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'night-blue': '#0A0F1A',
        'electric-blue': '#0055FF',
        'cyan-glow': '#00E5FF',
        'obsidian': '#050505',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Noto Serif Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
