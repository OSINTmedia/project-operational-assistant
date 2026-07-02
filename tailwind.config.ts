import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: '#d7dce5',
        background: '#f4f7fb',
        foreground: '#0f172a',
        muted: '#64748b',
        panel: '#ffffff',
        accent: '#0f766e',
        accentSoft: '#ccfbf1',
      },
      boxShadow: {
        panel: '0 8px 24px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
} satisfies Config
