/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#00ff88',
          blue: '#00d4ff',
          purple: '#9945ff',
        },
        dark: {
          900: '#0a0a0f',
          800: '#12121a',
          700: '#1a1a27',
          600: '#22222f',
        },
      },
    },
  },
  plugins: [],
}
