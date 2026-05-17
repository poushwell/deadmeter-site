import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:           '#FAF9F5',
        paper:        '#FFFFFF',
        'surface-warm': '#F5F3EC',
        'surface-dark': '#141413',
        'surface-dark-2': '#1F1E1B',
        border:       '#E5E2D8',
        'border-warm': '#C9C4B5',
        'text-primary':   '#1A1A1A',
        'text-secondary': '#6B6B68',
        'text-tertiary':  '#918E83',
        'text-on-dark':   '#FAF9F5',
        accent:        '#D97757',
        'accent-hover':    '#C46241',
        'accent-bordeaux': '#8B1A1A',
        live:      '#5C8862',
        hybrid:    '#B89548',
        synthetic: '#C47547',
        dead:      '#985858',
      },
      fontFamily: {
  sans:  ['var(--font-inter)',         'system-ui', 'sans-serif'],
  serif: ['var(--font-source-serif)',  'Georgia',   'serif'],
  mono:  ['var(--font-ibm-plex-mono)', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
