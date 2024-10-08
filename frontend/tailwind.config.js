/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          100: '#FFFFFF',
          200: '#F5F5F5',
          300: '#EAEAEA',
        },
        primary: {
          100: '#0B99FF',
        },
        secondary: {
          100: '#37352F',
        },
        text: {
          100: '#FFFFFF',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
