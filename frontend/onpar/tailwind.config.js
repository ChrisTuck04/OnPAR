 /** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
     extend: {
      fontFamily: {
        fredoka: ['"Fredoka One"', 'cursive'],
      },
      colors: {
        onparBlue: '#C3F8FF',
        onparLightGreen: '#96D97A',
        onparLightYellow: '#FAE75F',
        onparOrange: '#FFAA00',
        onparSadBlue: '#547792',
        onparGray: '#7F8CAA',
      },
     },
   },
   plugins: [],
 };