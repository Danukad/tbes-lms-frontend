/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Custom breakpoint for small mobile screens (e.g., 320px)
      screens: {
        xs: '320px',
      },
    },
  },
  plugins: [],
};