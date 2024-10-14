module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust the path as needed
    './public/index.html', // Adjust the path as needed
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
      },
    },
  },
  variants: {},
  plugins: [],
};