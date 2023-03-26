module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
        'backgroundGray': 'rgb(255,255,255)',
    },
    extend: {
      fontFamily: {
        stratford: ["STRATFORD", "serif"],
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
