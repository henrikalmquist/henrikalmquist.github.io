module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
        'backgroundGray': 'rgb(248,248,248)',
        'black': '000000',
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
