/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class', // Enable dark mode by default using class
  theme: {
    extend: {
      colors: {
        darkBg: '#0f172a',
        darkCard: '#1e293b',
        primary: {
          light: '#2dd4bf', // teal-400
          DEFAULT: '#14b8a6', // teal-500
          dark: '#0f766e', // teal-700
        },
        accent: {
          light: '#c084fc', // purple-400
          DEFAULT: '#a855f7', // purple-500
          dark: '#7e22ce', // purple-700
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
