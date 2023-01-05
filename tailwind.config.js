const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} \*/
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: [...fontFamily.sans],
            },
        },
        screens: {
            'sm': '575px',
            'md': '767px',
            'lg': '1200px',
            'xl': '1400px',
        },
        colors: {
            hintOfGreen: "#e3ffe7",
            solitude: "#d9e7ff",
        }
    },
    corePlugins: {
        preflight: false,
    },
    plugins: [],
}