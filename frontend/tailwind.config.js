/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFBF7',
          100: '#FAF8F5',
          200: '#F3EFE6',
          300: '#E8E2D5',
          400: '#D5CCBC',
        },
        maroon: {
          50: '#FAF0F1',
          100: '#F4DCDE',
          200: '#E8B9BD',
          300: '#D68C93',
          400: '#BF5C67',
          500: '#9B2C3B',
          600: '#7E1F2D',
          700: '#641521',
          800: '#4F0F19',
          900: '#3D0A13',
        },
        gold: {
          50: '#FCF9EE',
          100: '#F9F2D8',
          200: '#F2E2B0',
          300: '#E9CE83',
          400: '#DFB855',
          500: '#C99E32',
          600: '#A67F22',
          700: '#7D5C17',
        },
        charcoal: {
          50: '#F6F6F6',
          100: '#E7E7E7',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#6D6D6D',
          600: '#5D5D5D',
          700: '#484848',
          800: '#2A2A2A',
          900: '#171717',
        },
      },
      fontFamily: {
        tamil: ['"Noto Sans Tamil"', '"Mukta Malar"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', '"Outfit"', '"Noto Sans Tamil"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
