import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)',    'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)',    'monospace'],
      },
      colors: {
        cal: {
          bg:             'var(--cal-bg)',
          surface:        'var(--cal-surface)',
          'surface-alt':  'var(--cal-surface-alt)',
          border:         'var(--cal-border)',
          'border-subtle':'var(--cal-border-subtle)',
          accent:         'var(--cal-accent)',
          'accent-hover': 'var(--cal-accent-hover)',
          'accent-light': 'var(--cal-accent-light)',
          'accent-faint': 'var(--cal-accent-faint)',
          'text-primary':   'var(--cal-text-primary)',
          'text-secondary': 'var(--cal-text-secondary)',
          'text-muted':     'var(--cal-text-muted)',
          'text-faint':     'var(--cal-text-faint)',
          weekend:        'var(--cal-weekend)',
          'holiday-bg':   'var(--cal-holiday-bg)',
          'ring-blue':    'var(--cal-today-ring)',
        },
      },
      boxShadow: {
        'cal-lg':   'var(--cal-shadow-lg)',
        'cal-sm':   'var(--cal-shadow-sm)',
        'calendar': 'var(--cal-shadow-lg)',
        'card':     'var(--cal-shadow-sm)',
        'glass':    'var(--glass-shadow)',
        'glass-lg': 'var(--glass-shadow-lg)',
      },
      backdropBlur: {
        xs: '4px',
      },
      animation: {
        'slide-up':     'slideUp 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'accent-pulse': 'accentPulse 2.2s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        accentPulse: {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(0.72)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
