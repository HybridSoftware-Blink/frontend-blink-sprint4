/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blink-purple': '#663399',
        'blink-green': '#89C242',
      },
    },
  },
  plugins: [],
}
