/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          500: '#FF6F61', // This is the coral color for the announcement bar
        },
        olive: {
          700: '#8A8B6C', // Olive color for navbar text
          900: '#6A6B52', // Darker olive for hover states
        }
      }
    },
  },
  plugins: [],
}

