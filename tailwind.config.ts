import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  safelist: ["sr-only"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
