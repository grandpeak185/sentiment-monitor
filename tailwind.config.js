/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        // 深色科技商务风
        base: {
          900: '#030712',
          800: '#0A1628',
          700: '#0F1F35',
          600: '#16293F',
          500: '#1E3350',
        },
        accent: {
          cyan: '#00D4FF',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          dark: '#1B4F72',
        },
        // 红方 - 正面
        positive: {
          DEFAULT: '#FF4757',
          light: '#FF6B7A',
          dark: '#E03441',
          glow: 'rgba(255, 71, 87, 0.3)',
        },
        // 绿方 - 负面
        negative: {
          DEFAULT: '#2ED573',
          light: '#3FE584',
          dark: '#25BD63',
          glow: 'rgba(46, 213, 115, 0.3)',
        },
        neutral: {
          DEFAULT: '#7F8FA6',
          light: '#A4B0BE',
        },
      },
      fontFamily: {
        display: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      textShadow: {
        'neon-cyan': '0 0 10px rgba(0, 212, 255, 0.8), 0 0 20px rgba(0, 212, 255, 0.6), 0 0 40px rgba(0, 212, 255, 0.4)',
        'neon-purple': '0 0 10px rgba(139, 92, 246, 0.8), 0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(139, 92, 246, 0.4)',
        'neon-positive': '0 0 10px rgba(255, 71, 87, 0.8), 0 0 20px rgba(255, 71, 87, 0.6), 0 0 40px rgba(255, 71, 87, 0.4)',
        'neon-negative': '0 0 10px rgba(46, 213, 115, 0.8), 0 0 20px rgba(46, 213, 115, 0.6), 0 0 40px rgba(46, 213, 115, 0.4)',
        'cyber': '2px 2px 0 #00D4FF, -2px -2px 0 #8B5CF6',
        'deep': '3px 3px 0 rgba(0,0,0,0.5), 0 0 20px rgba(0, 212, 255, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'gauge-fill': 'gaugeFill 1.2s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.35)' },
        },
        gaugeFill: {
          '0%': { strokeDashoffset: '283' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
};
