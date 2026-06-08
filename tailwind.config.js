/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        hydraulik: {
          orange: '#F97316',
          dark: '#1A1A1A',
          light: '#FAFAFA',
          slate: '#334155',
        },
      },
    },
  },
  plugins: [],
}
