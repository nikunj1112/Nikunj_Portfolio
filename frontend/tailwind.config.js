/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary-dark': '#212A31',
        'secondary-dark': '#2E3944',
        'accent': '#124E66',
        'soft-blue': '#748D92',
        'light-gray': '#D3D9D4',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(18, 78, 102, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(18, 78, 102, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}

