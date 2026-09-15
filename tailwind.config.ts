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
        // Common Ground brand scale — navy wordmark, plum/purple mark, teal accent.
        brand: {
          navy: {
            50:  '#eef1f8',
            100: '#d4dbeb',
            200: '#a9b6d2',
            300: '#7d8fb8',
            400: '#52699f',
            500: '#1a2e52',
            600: '#152646',
            700: '#111d39',
            800: '#0c152b',
            900: '#070c1a',
          },
          plum: {
            50:  '#f7f0f6',
            100: '#e9d9e6',
            200: '#d4b3cd',
            300: '#bf8db4',
            400: '#aa679b',
            500: '#703068',
            600: '#63295d',
            700: '#51214c',
            800: '#3f193b',
            900: '#2d112a',
          },
          purple: {
            50:  '#f2eff6',
            100: '#ddd5e8',
            200: '#c2b0d4',
            300: '#a78bc0',
            400: '#8c66ac',
            500: '#32175a',
            600: '#2b144d',
            700: '#241040',
            800: '#1c0d32',
            900: '#140925',
          },
          // Soft canvas tints (replaces gold) — cool neutrals that sit with navy/plum
          warm: {
            50:  '#faf9fc',
            100: '#f3f2f7',
            200: '#e8e6ef',
            300: '#dcd9e6',
            400: '#d0cddc',
            500: '#c5c2cf',
          },
          muted: {
            50:  '#f5f5f6',
            100: '#ebebed',
            200: '#d7d8db',
            300: '#b3b5ba',
            400: '#8f9299',
            500: '#5f6570',
            600: '#5a5d64',
            700: '#474950',
            800: '#34363b',
            900: '#212226',
          },
          teal: {
            DEFAULT: '#0F6E56',
            50:  '#eaf5f1',
            100: '#c9e6dd',
            200: '#95cdbc',
            300: '#61b49b',
            400: '#2f9a79',
            500: '#0F6E56',
            600: '#0c5f4a',
            700: '#0a4e3d',
            800: '#073c2f',
            900: '#052a21',
          },
        },
        primary: {
          DEFAULT: '#1a2e52',
          light: '#52699f',
          dark: '#111d39',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#0F6E56',
          light: '#2f9a79',
          dark: '#0a4e3d',
          foreground: '#ffffff',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#eaecf2',
          subtle: '#e2e5ed',
          border: '#d4d8e3',
        },
        page: {
          DEFAULT: '#f2f4f8',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 2px 20px rgba(26, 46, 82, 0.07)',
        card: '0 4px 24px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 32px rgba(26, 46, 82, 0.12)',
        glow: '0 0 40px rgba(26, 46, 82, 0.14)',
      },
    },
  },
  plugins: [],
};

export default config;
