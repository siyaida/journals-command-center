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
          orange: '#ff6b35',
          pink: '#ff2d78',
        },
        dark: {
          950: '#05050a',
          900: '#0a0a0f',
          800: '#0f0f1a',
          750: '#141420',
          700: '#1a1a27',
          650: '#1e1e2e',
          600: '#252535',
          500: '#2e2e42',
          400: '#3d3d55',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(0,255,136,0.25), 0 0 40px rgba(0,255,136,0.1)',
        'neon-blue': '0 0 20px rgba(0,212,255,0.25), 0 0 40px rgba(0,212,255,0.1)',
        'neon-purple': '0 0 20px rgba(153,69,255,0.25), 0 0 40px rgba(153,69,255,0.1)',
        'glow-sm': '0 0 8px rgba(0,255,136,0.4)',
        'card': '0 1px 3px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'blink': 'blink 1.2s step-end infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
