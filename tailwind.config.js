/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}', // Root App file
    './screens/**/*.{js,jsx,ts,tsx}', // All files in screens folder
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'regal-blue': '#fff',
      },
    },
  },
  plugins: [],
}
