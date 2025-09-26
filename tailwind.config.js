/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#333333',
        card: '#35332e',
        text: '#f1f5f9',
        muted: '#cbd5e1',
        ok: '#4ade80',
        warn: '#f87171',
        accent: '#f9b222',
        'accent-2': '#22d3ee',
      },
      borderRadius: {
        '18': '18px',
      },
      boxShadow: {
        'cyber': '0 10px 24px rgba(0,0,0,.35)',
      },
      animation: {
        'breathe': 'breathe 3s ease-in-out infinite',
        'scan': 'scan 2.2s infinite ease-in-out',
        'pulse-cyber': 'pulse-cyber 2s infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { 
            transform: 'scale(1) translateY(0px)',
          },
          '50%': { 
            transform: 'scale(1.08) translateY(-3px)',
          },
        },
        scan: {
          '0%': { top: '10px' },
          '50%': { top: 'calc(100% - 10px)' },
          '100%': { top: '10px' },
        },
        'pulse-cyber': {
          '0%': { boxShadow: '0 0 0 0 rgba(249, 178, 34, 0.7)' },
          '70%': { boxShadow: '0 0 0 20px rgba(249, 178, 34, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(249, 178, 34, 0)' },
        },
      },
    },
  },
  plugins: [],
};
