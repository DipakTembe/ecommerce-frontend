module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.slick-slide': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      });
    },
  ],
};
