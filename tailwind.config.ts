import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  // The ported site stylesheet in app/globals.css relies on browser defaults, not preflight.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        cond: ["var(--font-cond)", "Arial Narrow", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
