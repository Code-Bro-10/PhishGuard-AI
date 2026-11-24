/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          dark: '#080D18',
          secondary: '#101827',
          card: '#131F32',
          cardHover: '#182740',
        },
        accent: {
          cyan: '#00D4FF',
          purple: '#7C3AED',
          cyanGlow: 'rgba(0, 212, 255, 0.25)',
          purpleGlow: 'rgba(124, 58, 237, 0.25)',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#00D4FF',
        },
        text: {
          main: '#F8FAFC',
          muted: '#94A3B8',
          dim: '#64748B',
        },
        border: {
          dark: '#1E293B',
          glow: 'rgba(0, 212, 255, 0.3)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px -3px rgba(0, 212, 255, 0.3)',
        'purple-glow': '0 0 20px -3px rgba(124, 58, 237, 0.3)',
        'card-glow': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(0, 212, 255, 0.08) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}

