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
          /* navy/steel tokens (Plan 04) — single source of truth for the palette */
          navy: '#1E3A5F',
          'navy-dark': '#163059', /* hover shade of navy */
          'navy-deep': '#0F2444', /* active/pressed shade of navy */
          steel: '#3B82F6',
          ink: '#0F172A',
          surface: '#F8FAFC',
        },
      },
    },
  },
  plugins: [],
}
