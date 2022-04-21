module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
        'backgroundGray': 'rgb(245,245,245)',
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
