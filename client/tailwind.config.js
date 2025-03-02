/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'min-600': '600px',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}

