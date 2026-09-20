import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#111111',
          light: '#FFFFFF',
          cream: '#F9F8F6',
          sand: '#F2EFE9',
          border: '#E5E5E5',
          muted: '#777777',
          gold: '#C5A059',
          sale: '#9E2A2B',
          accent: '#111111',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
        ultra: '0.35em',
      },
      boxShadow: {
        dropdown: '0 20px 40px rgba(0,0,0,0.08)',
        subtle: '0 4px 20px rgba(0,0,0,0.03)',
        card: '0 10px 30px rgba(0,0,0,0.04)',
      }
    },
  },
  plugins: [],
};
export default config;
