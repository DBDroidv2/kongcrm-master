/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans], // Add Inter to the beginning of the default sans-serif stack
      },
      colors: {
        primary: '#0070f3',
        secondary: '#1a1a1a',
      },
    },
  },
  plugins: [],
}
