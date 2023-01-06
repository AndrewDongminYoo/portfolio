const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} \*/
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        fontFamily: {
            sans: [...fontFamily.sans],
        },
        screens: {
            xs: { max: '575px' },
            sm: { max: '767px' },
            md: { max: '991px' },
            lg: { max: '1199px' },
            xl: { min: '1200px' },
        },
        extend: {
            colors: {
                hintOfGreen: "#e3ffe7",
                solitude: "#d9e7ff",
                orangeRed: "rgba(255, 69, 0, 1)",
            },
            boxShadow: {
                fab: "0 0.0625rem 0.1875rem rgb(20 20 94 / 12%), 0 0.1875rem 0.4375rem rgb(20 20 94 / 10%)"
            }
        },
    },
    corePlugins: {
        preflight: true,
    },
    plugins: [
        require("tailwind-scrollbar-hide")
    ],
}