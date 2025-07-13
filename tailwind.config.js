/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./main.js",
    "./src/**/*.(js/ts/jsx,tsx)"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
   safelist: [
    'capitalize', // Asegura que la utilidad 'capitalize' siempre se incluya
  ],
}

