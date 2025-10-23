/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm terracotta and clay tones
        terracotta: {
          50: '#fdf8f6',
          100: '#f9ede8',
          200: '#f3d9cf',
          300: '#e8bfad',
          400: '#d99a81',
          500: '#c77d5f',
          600: '#b36647',
          700: '#95503a',
          800: '#7a4433',
          900: '#653b2e',
        },
        // Warm beige and cream tones
        tuscan: {
          50: '#fdfbf7',
          100: '#f8f4ec',
          200: '#f0e8d9',
          300: '#e5d7bf',
          400: '#d4c0a1',
          500: '#c0a882',
          600: '#a68f6d',
          700: '#8a7558',
          800: '#72614a',
          900: '#5f513f',
        },
        // Soft olive and sage greens
        sage: {
          50: '#f7f8f4',
          100: '#eef0e8',
          200: '#dce0d0',
          300: '#c3cab3',
          400: '#a5af91',
          500: '#8a9673',
          600: '#70795c',
          700: '#5a614b',
          800: '#4a503f',
          900: '#3f4436',
        },
        // Rich charcoal for text and accents
        charcoal: {
          50: '#f6f6f5',
          100: '#e7e7e6',
          200: '#d1d1cf',
          300: '#b0b0ad',
          400: '#888885',
          500: '#6d6d6a',
          600: '#5a5a57',
          700: '#4a4a48',
          800: '#3f3f3d',
          900: '#2d2d2c',
        },
        // Warm gold accents
        gold: {
          50: '#fdfaf3',
          100: '#faf3e0',
          200: '#f4e4bc',
          300: '#ebce8d',
          400: '#deb05c',
          500: '#cd963a',
          600: '#b07a2e',
          700: '#926028',
          800: '#794f26',
          900: '#664323',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}