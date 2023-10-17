module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
        'backgroundGray': 'rgb(255,255,255)',
        'black': '#020617',
    },
    extend: {
      fontFamily: {
        times: ["TIMES", "serif"],
        stratford: ["STRATFORD", "serif"],
      },
      screens: {
        'xs': '440px',
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography")
  ],
  variants: {
      extend: {
        display: ['group-hover']
      }
  }
}
