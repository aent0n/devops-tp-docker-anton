/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {
            colors: {
                'retro-bg': '#050510',
                'retro-term': '#0a0a15',
                'retro-text': '#33ff00',
                'retro-accent': '#00ffff',
                'retro-alert': '#ff3333',
                'retro-scan': 'rgba(0, 0, 0, 0.5)',
                'retro-glow': 'rgba(51, 255, 0, 0.6)',
            },
            fontFamily: {
                mono: ['"Courier New"', 'Courier', 'monospace'],
            },
            boxShadow: {
                'glow': '0 0 20px rgba(51, 255, 0, 0.6)',
            }
        },
    },
    plugins: [],
}
