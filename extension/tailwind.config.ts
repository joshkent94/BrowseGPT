/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './background/**/*.{js,jsx,ts,tsx}',
        './sidePanel/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        colors: {
            'dark-blue': 'rgb(var(--color-dark-blue) / <alpha-value>)',
            'light-blue': 'rgb(var(--color-light-blue) / <alpha-value>)',
            'midnight-blue': 'rgb(var(--color-midnight-blue) / <alpha-value>)',
            white: 'rgb(var(--color-white) / <alpha-value>)',
            success: 'rgb(var(--color-success) / <alpha-value>)',
        },
    },
    important: true,
    plugins: [],
}
