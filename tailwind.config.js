/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        hydraulik: {
          orange: '#F97316', /* KEEP — emergency button (REQ-41) */
          dark: '#1A1A1A',
          light: '#FAFAFA',
          slate: '#334155',
          /* navy/steel tokens (Plan 04) */
          navy: '#1E3A5F',
          steel: '#3B82F6',
          ink: '#0F172A',
          surface: '#F8FAFC',
        },
      },
    },
  },
  plugins: [],
}
