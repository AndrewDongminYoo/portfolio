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
            'sm': '640px',
            // => @media (min-width: 640px)
            'md': '768px',
            // => @media (min-width: 768px)
            'lg': '1024px',
            // => @media (min-width: 1024px)
            'xl': '1280px',
            // => @media (min-width: 1280px)
            '2xl': '1536px',
            // => @media (min-width: 1536px)
        },
        extend: {
            colors: {
                hintOfGreen: "#e3ffe7",
                solitude: "#d9e7ff",
                orangeRed: "rgba(255, 69, 0, 1)",
                shadow: ""
            },
            boxShadow: {
                fab: "0 0.0625rem 0.1875rem rgb(20 20 94 / 12%), 0 0.1875rem 0.4375rem rgb(20 20 94 / 10%)"
            }
        },
    },
    corePlugins: {
        preflight: true,
    },
    plugins: [],
}