/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#EBF5F0',
          100: '#D4E9DE',
          200: '#ACD4C0',
          300: '#9EC4B3',
          400: '#52D19D',
          500: '#2A825E',
          600: '#1F684A',
          700: '#135C43',
          800: '#0F523B',
          900: '#073D2B', // Reference sidebar dark green (#073D2B)
          950: '#04271B',
        },
        ivory: {
          50: '#FDFBF7',
          100: '#F8F5EF', // Reference warm background (#F8F5EF)
          200: '#F0EBE0',
          300: '#E5DDCF', // Subtle border
          400: '#D5C9B4',
        },
        // Backward-compatible mapping: maroon classes adopt deep forest green aesthetic
        maroon: {
          50: '#EBF5F0',
          100: '#D4E9DE',
          200: '#ACD4C0',
          300: '#7EBA9E',
          400: '#519E7B',
          500: '#2A825E',
          600: '#1F684A',
          700: '#18533B',
          800: '#134330',
          900: '#0F382A',
          950: '#09251C',
        },
        gold: {
          50: '#FCF9EE',
          100: '#F9F2D8',
          200: '#F2E2B0',
          300: '#E9CE83',
          400: '#DFB855',
          500: '#C5A880',
          600: '#A68A56',
          700: '#8C6D3F',
        },
        charcoal: {
          50: '#F8F9F8',
          100: '#EDEDED',
          200: '#D7DAD8',
          300: '#B6BBB8',
          400: '#8E9591',
          500: '#6C7470',
          600: '#525A56',
          700: '#3D4440',
          800: '#262D2A',
          900: '#141A17',
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
