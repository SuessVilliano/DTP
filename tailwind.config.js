/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0F',
        surface: '#12121A',
        'surface-2': '#1A1A26',
        cyan: {
          DEFAULT: '#00E5CC',
          dark: '#00B8A3',
          light: '#33EDD6',
        },
        gold: {
          DEFAULT: '#FFD700',
          dark: '#CCac00',
          light: '#FFE44D',
        },
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0B0',
        'text-muted': '#505065',
        green: {
          DEFAULT: '#00FF88',
          chart: '#26a69a',
        },
        red: {
          DEFAULT: '#FF3366',
          chart: '#ef5350',
        },
        border: '#1E1E30',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-terminal': 'linear-gradient(180deg, #0A0A0F 0%, #0D0D18 50%, #0A0A0F 100%)',
        'gradient-gold': 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
        'gradient-cyan': 'linear-gradient(135deg, #00E5CC 0%, #0099AA 50%, #00E5CC 100%)',
      },
      animation: {
        ticker: 'ticker 30s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        glow: 'glow 2s ease-in-out infinite alternate',
        scan: 'scan 4s linear infinite',
      },
      keyframes: {
        ticker: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        glow: { '0%': { boxShadow: '0 0 5px #00E5CC, 0 0 10px #00E5CC' }, '100%': { boxShadow: '0 0 20px #00E5CC, 0 0 40px #00E5CC, 0 0 60px #00E5CC44' } },
        scan: { '0%': { top: '0%' }, '100%': { top: '100%' } },
      },
      boxShadow: {
        cyan: '0 0 20px rgba(0, 229, 204, 0.3)',
        'cyan-lg': '0 0 40px rgba(0, 229, 204, 0.5)',
        gold: '0 0 20px rgba(255, 215, 0, 0.3)',
        'gold-lg': '0 0 40px rgba(255, 215, 0, 0.5)',
        terminal: 'inset 0 0 30px rgba(0, 229, 204, 0.05)',
      },
      borderColor: { DEFAULT: '#1E1E30' },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}

module.exports = config
