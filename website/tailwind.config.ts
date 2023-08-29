/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        colors: {
            'dark-blue': 'rgb(var(--color-dark-blue) / <alpha-value>)',
            'light-blue': 'rgb(var(--color-light-blue) / <alpha-value>)',
            'midnight-blue': 'rgb(var(--color-midnight-blue) / <alpha-value>)',
            white: 'rgb(var(--color-white) / <alpha-value>)',
            success: 'rgb(var(--color-success) / <alpha-value>)',
            'success-dark': 'rgb(var(--color-success-dark) / <alpha-value>)',
            error: 'rgb(var(--color-error) / <alpha-value>)',
        },
    },
    important: true,
    plugins: [],
}
