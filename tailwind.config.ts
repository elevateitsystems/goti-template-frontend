import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        display: ['Nunito', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Client Design System
        navy: {
          DEFAULT: '#0A1423',
          panel: '#0F1C2E',
          surface: '#132035',
          border: '#1E3050',
        },
        accent: {
          green: '#00E5A8',
          'green-hover': '#00C994',
          gold: '#FFC857',
          'gold-tint': '#FFDB8A',
          danger: '#FF4D6D',
          blue: '#4A9EFF',
        },
        emerald: {
          DEFAULT: '#00E5A8',
          hover: '#00C994',
          light: 'rgba(0,229,168,0.12)',
        },
        coral: {
          DEFAULT: '#FF4D6D',
          light: 'rgba(255,77,109,0.12)',
        },
        gold: {
          DEFAULT: '#FFC857',
          tint: '#FFDB8A',
          light: 'rgba(255,200,87,0.12)',
        },
        'intel-blue': {
          DEFAULT: '#4A9EFF',
          light: 'rgba(74,158,255,0.12)',
        },
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.4)',
        'card-dark': '0 4px 32px rgba(0,0,0,0.5)',
        'glow-green': '0 0 20px rgba(0,229,168,0.3)',
        'glow-gold': '0 0 20px rgba(255,200,87,0.3)',
        'glow-danger': '0 0 20px rgba(255,77,109,0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
export default config
