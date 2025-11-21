/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
      },
      boxShadow: {
        'panel': '0 24px 48px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
};
