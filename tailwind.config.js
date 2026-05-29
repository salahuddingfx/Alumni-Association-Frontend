/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003B73',
          dark: '#00254a',
        },
        secondary: {
          DEFAULT: '#F9A826',
        },
        accent: {
          DEFAULT: '#4FC3F7',
        },
        dark: {
          DEFAULT: '#071426',
        },
      },
      fontFamily: {
        bengali: ['Hind Siliguri', 'Noto Sans Bengali', 'sans-serif'],
        english: ['Inter', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
