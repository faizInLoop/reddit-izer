import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        electric: { 500: '#a855f7', 700: '#7e22ce', 900: '#4c1d95' },
        cyan: { 500: '#06b6d4', 700: '#0891b2', 900: '#0e7490' },
        pink: { 500: '#ec4899', 700: '#db2777', 900: '#9d174d' },
        green: { 500: '#10b981', 700: '#059669', 900: '#047857' },
      },
      fontFamily: {
        neon: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(168, 85, 247, 0.8), 0 0 60px rgba(6, 182, 212, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
