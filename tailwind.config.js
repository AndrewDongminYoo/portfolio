/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      xs: { max: '575px' },
      sm: { min: '576px', max: '767px' },
      md: { min: '768px', max: '991px' },
      lg: { min: '992px', max: '1199px' },
      xl: { min: '1200px' },
    },
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        fab: '0 0.0625rem 0.1875rem rgb(20 20 94 / 12%), 0 0.1875rem 0.4375rem rgb(20 20 94 / 10%)',
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
        xs: '0.75rem',
        xxs: '0.625rem',
      },
      gridTemplateColumns: {
        11: 'repeat(11, minmax(0, 1fr))',
        100: 'repeat(100, minmax(0, 1fr))',
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '-0.009em',
      },
      lineHeight: {
        tight: '1.28',
        snug: '1.4',
        normal: '1.5',
        relaxed: '1.6',
      },
      listStyleType: {
        square: 'square',
      },
      maxHeight: {
        sm: '2.125rem',
      },
      maxWidth: ({ theme }) => ({
        ...theme('spacing'),
        'xxs': '14rem',
        '4xl': '55rem',
        '7xl': '82.5rem',
      }),
      minHeight: ({ theme }) => ({
        ...theme('spacing'),
      }),
      minWidth: ({ theme }) => ({
        ...theme('spacing'),
      }),
      spacing: {
        0.4: '0.1rem',
        12.5: '3.125rem',
        16: '4rem',
        19: '4.75rem' /* 76px */,
        20: '5rem' /* 80px */,
        40: '10rem' /* 160px */,
        48: '12rem',
        52.5: '13.125rem',
        68: '17rem',
        82.5: '20.625rem',
        120: '30rem',
      },
      width: {
        'full-9': 'calc(100% - 9rem)',
        'full-11.5': 'calc(100% - 11.5rem)',
        'full-30': 'calc(100% - 30rem)',
        'full-35': 'calc(100% - 35rem)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'typing': {
          from: { width: '0%' },
          to: { width: '100%' },
        },
        'blink': {
          'from, to': { 'border-color': 'transparent' },
          '50%': { 'border-color': 'orange' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'typing': 'typing 5s steps(30, end), blink .75s step-end infinite',
      },
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
  },
  corePlugins: {
    preflight: true,
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwind-scrollbar-hide'),
    require('@headlessui/tailwindcss'),
    require('@tailwindcss/typography'),
  ],
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
};
