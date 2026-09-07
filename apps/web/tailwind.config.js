/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html,css}',
  ],
  safelist: [
    'dark',
    'bg-[#030712]',
    'text-gray-100',
    'glass-panel',
    'glass-card',
    'glass-button',
    'glass-input',
    'tilt-card',
    'iridescent-text',
    'iridescent-flow-line',
    'dark-stage-spotlight',
    {
      pattern: /^(bg|text|border|ring)-(white|black|gray|purple|blue|emerald|cyan|amber|indigo)\/(\d+)$/,
    },
    {
      pattern: /^backdrop-blur(-[a-z0-9]+)?$/,
    }
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Gambarino"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['"Onest"', '"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'system-ui', 'sans-serif'],
        mono: ['"Fragment Mono"', '"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
