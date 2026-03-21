/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Explicit arbitrary rgba values used in templates
    'border-[rgba(240,180,41,0.1)]', 'border-[rgba(240,180,41,0.08)]',
    'border-[rgba(240,180,41,0.12)]', 'border-[rgba(240,180,41,0.3)]',
    'border-[rgba(255,255,255,0.04)]',
    'bg-[rgba(240,180,41,0.08)]',
    // Dynamic badge colour combos
    'badge-gold', 'badge-green', 'badge-red',
    'bg-blue-500/20', 'text-blue-400', 'border-blue-400/30',
    'bg-purple-500/20', 'text-purple-400', 'border-purple-500/30',
    'bg-pink-500/20', 'text-pink-400', 'border-pink-500/30',
    'bg-orange-500/20', 'text-orange-400', 'border-orange-500/30',
    'border-danger/20', 'border-danger/40', 'border-success/30', 'border-success/40', 'border-success/50',
    'bg-success/20', 'bg-success/30', 'bg-success/40',
    'bg-danger/20', 'bg-danger/30', 'bg-danger/5',
    'text-success', 'text-danger',
    'from-brand-gold/20', 'from-blue-500/20', 'from-green-500/20', 'from-purple-500/10',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#F0B429',
          'gold-light': '#FBBF24',
          'gold-dark': '#D97706',
        },
        dark: {
          100: '#1A1A2E',
          200: '#16213E',
          300: '#0F3460',
          400: '#0A0A1A',
          500: '#050510',
        },
        surface: {
          100: '#1E1E32',
          200: '#252540',
          300: '#2C2C50',
        },
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
        // ── shadcn/ui semantic tokens (RGB channels → supports /opacity modifiers) ──
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(240,180,41,0.15), transparent)',
        'card-glow': 'linear-gradient(135deg, rgba(240,180,41,0.08) 0%, rgba(15,52,96,0.3) 100%)',
      },
      boxShadow: {
        'gold': '0 0 30px rgba(240,180,41,0.2)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'glow': '0 0 60px rgba(240,180,41,0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'ticker': 'ticker 20s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 20px rgba(240,180,41,0.1)' }, '50%': { boxShadow: '0 0 40px rgba(240,180,41,0.3)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        ticker: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
}
