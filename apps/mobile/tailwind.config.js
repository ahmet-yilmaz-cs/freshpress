/** @type {import('tailwindcss').Config} */
const preset = require('@freshpress/design-system/tailwind-preset');

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset'), preset],
  theme: {
    extend: {},
  },
  plugins: [],
};
