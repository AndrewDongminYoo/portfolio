/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
    extend: {
      animation: {
        typing: 'typing 5s steps(30, end), blink .75s step-end infinite',
      },
      colors: {
        background: 'var(--background)',
        border: 'var(--border)',
        card: 'var(--card)',
        destructive: 'var(--destructive)',
        foreground: 'var(--foreground)',
        input: 'var(--input)',
        muted: 'var(--muted)',
        popover: 'var(--popover)',
        primary: 'var(--primary)',
        ring: 'var(--ring)',
        secondary: 'var(--secondary)',
      },
      fontSize: {
        'xxs': '0.625rem',
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      gridTemplateColumns: {
        10: 'repeat(10, minmax(0, 1fr))',
        11: 'repeat(11, minmax(0, 1fr))',
        12: 'repeat(12, minmax(0, 1fr))',
        100: 'repeat(100, minmax(0, 1fr))',
      },
      height: {
        auto: 'auto',
        full: '100%',
        screen: '100vh',
        min: 'min-content',
        max: 'max-content',
        fit: 'fit-content',
      },
      keyframes: {
        typing: {
          from: { width: '0%' },
          to: { width: '100%' },
        },
        blink: {
          'from, to': { 'border-color': 'transparent' },
          '50%': { 'border-color': 'orange' },
        },
      },
      letterSpacing: {
        normal: '-0.009em', // origin: 0rem
      },
      listStyleType: {
        none: 'none',
        square: 'square',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwind-scrollbar-hide'),
    require('@headlessui/tailwindcss'),
    require('@tailwindcss/typography'),
  ],
};
