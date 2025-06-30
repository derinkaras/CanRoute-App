/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./Components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter_400Regular"],
        interMedium: ["Inter_500Medium"],
        interBold: ["Inter_700Bold"],
      },
      colors: {
        lightBlue: "#085484",
        darkBlue: "#193a5a",
      }
    },
  },
  plugins: [],
}