import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        overlay: 'var(--overlay)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        brand: 'var(--brand)',
        brand2: 'var(--brand-2)',
        accent: 'var(--accent)',
        success: 'var(--success)',
        warn: 'var(--warn)',
        error: 'var(--error)',
      },
      borderRadius: {
        xs: 'var(--r-xs)',
        sm: 'var(--r-s)',
        md: 'var(--r-m)',
        lg: 'var(--r-l)',
        xl: 'var(--r-xl)',
      },
      boxShadow: {
        z1: 'var(--z1)',
        z2: 'var(--z2)',
        z3: 'var(--z3)',
      },
      transitionTimingFunction: {
        soft: 'var(--easing-soft)',
      },
      transitionDuration: {
        xs: 'var(--dur-xs)',
        s: 'var(--dur-s)',
        m: 'var(--dur-m)',
        l: 'var(--dur-l)',
      },
    },
  },
  plugins: [],
}
export default config

