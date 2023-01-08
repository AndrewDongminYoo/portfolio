const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} \*/
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        fontFamily: {
            sans: ['var(--noto-sans-kr)', ...fontFamily.sans],
        },
        screens: {
            xs: { max: '575px' },
            sm: { max: '767px' },
            md: { max: '991px' },
            lg: { max: '1199px' },
            xl: { min: '1200px' },
        },
        extend: {
            borderRadius: {
                full: '50%',
            },
            borderWidth: {
                0.1: '0.1px',
            },
            boxShadow: {
                fab: "0 0.0625rem 0.1875rem rgb(20 20 94 / 12%), 0 0.1875rem 0.4375rem rgb(20 20 94 / 10%)"
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
            maxHeight: {
                sm: '2.125rem',
            },
            maxWidth: {
                xxs: '14rem',
                '4xl': '55rem',
                '7xl': '82.5rem',
            },
            minHeight: {
                3: '30px',
                4: '50px',
                5: '64px',
            },
            spacing: {
                0.4: '0.1rem',
                '2px': '2px',
                120: '30rem'
            },
            width: {
                'full-9': 'calc(100% - 9rem)',
                'full-11': 'calc(100% - 11.5rem)',
                'full-30': 'calc(100% - 30rem)',
            },
        },
    },
    corePlugins: {
        preflight: true,
    },
    plugins: [
        require("tailwind-scrollbar-hide")
    ],
}