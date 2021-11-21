const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        offBlack: "#0A0B0E",
        offWhite: "#F8F9FD",
        lightGrey: "#C8CDDD",
        darkGrey: "#7F8598",
        valueGreen: "#00D047",
        sdogBlue: "#2151f5",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
