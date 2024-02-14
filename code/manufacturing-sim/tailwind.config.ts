import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "DarkBlue" : "#425EB3",
        "MainBlue" : "#2C94D9",
        "LightBlue" : "#00C8DC",
        "DarkGray" : "#374048",
        "Gray" : "#BDBDBD",
        "LightGray" : "#FAFAFA",
        "Iris" : "#7C91D5"
      }
    },
  },
  plugins: [],
};
export default config;
