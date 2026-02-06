/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './css/**/*.css'],
  theme: {
    extend: {
      transitionDuration: {
        '300': '300ms',
      },
    },
  },
  plugins: [],
};
