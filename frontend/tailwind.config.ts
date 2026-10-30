import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f5fa',
          100: '#dce8f4',
          200: '#bfd5ea',
          300: '#95bada',
          400: '#649ac5',
          500: '#417db0',
          600: '#2f6393',
          700: '#264f77',
          800: '#133e68', // Logo primary deep blue
          900: '#0b2545', // Logo dark circular ring
          950: '#06162a',
        },
        teal: {
          50: '#f0fdf9',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#00a896', // Logo emerald/teal gradient
          700: '#028090', // Logo deep teal
          800: '#115e59',
          900: '#134e4a',
        },
        cyan: {
          500: '#06b6d4',
          600: '#00c49f', // Logo circuit accent
        },
        civic: {
          bg: '#f1f5f9',
          surface: '#ffffff',
          border: '#e2e8f0',
          'border-strong': '#cbd5e1',
          muted: '#f8fafc',
          'muted-foreground': '#64748b',
        },
        status: {
          live: '#16a34a',
          demo: '#d97706',
          partial: '#2563eb',
          unavailable: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
        indic: ['Noto Sans Kannada', 'Noto Sans Devanagari', 'Noto Sans Tamil', 'Noto Sans Telugu', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 5px -1px rgba(15, 39, 68, 0.05), 0 1px 3px -1px rgba(15, 39, 68, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(15, 39, 68, 0.10), 0 4px 10px -2px rgba(15, 39, 68, 0.06)',
        elevated: '0 14px 34px -6px rgba(15, 39, 68, 0.12), 0 4px 12px -2px rgba(15, 39, 68, 0.05)',
        // Claymorphism soft 3D dual shadows for cards
        clay: '6px 8px 18px 0px rgba(15, 39, 68, 0.07), -4px -4px 12px 0px rgba(255, 255, 255, 0.9), inset 1px 1px 2px 0px rgba(255, 255, 255, 0.9), inset -1px -1px 2px 0px rgba(15, 39, 68, 0.03)',
        'clay-hover': '8px 12px 24px 0px rgba(15, 39, 68, 0.10), -5px -5px 14px 0px rgba(255, 255, 255, 0.95), inset 1px 1px 2px 0px rgba(255, 255, 255, 0.95)',
        'clay-elevated': '12px 16px 32px 0px rgba(15, 39, 68, 0.11), -8px -8px 20px 0px rgba(255, 255, 255, 0.95), inset 1.5px 1.5px 3px 0px rgba(255, 255, 255, 0.95)',
        'clay-btn': '4px 6px 14px 0px rgba(15, 39, 68, 0.12), -3px -3px 8px 0px rgba(255, 255, 255, 0.8), inset 1px 1px 2px 0px rgba(255, 255, 255, 0.4)',
        'clay-btn-active': 'inset 3px 3px 6px 0px rgba(15, 39, 68, 0.2), inset -2px -2px 4px 0px rgba(255, 255, 255, 0.3)',
        'clay-inset': 'inset 3px 3px 6px 0px rgba(15, 39, 68, 0.06), inset -3px -3px 6px 0px rgba(255, 255, 255, 0.85)',
        // Glassmorphism Only Buttons: Specular highlights, refraction border & subtle elevation (No neon glow)
        'glass-btn': '0 4px 14px 0 rgba(15, 39, 68, 0.08), inset 0 1px 1px 0 rgba(255, 255, 255, 0.6)',
        'glass-btn-hover': '0 8px 20px 0 rgba(15, 39, 68, 0.12), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.8)',
        'glass-btn-active': '0 2px 4px 0 rgba(15, 39, 68, 0.12), inset 0 2px 4px 0 rgba(15, 39, 68, 0.15)',
        'glass-teal': '0 4px 16px -2px rgba(15, 39, 68, 0.20), inset 0 1px 1px 0 rgba(255, 255, 255, 0.5)',
        'glass-teal-hover': '0 8px 22px -2px rgba(15, 39, 68, 0.25), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.7)',
        'glass-navy': '0 4px 16px -2px rgba(15, 39, 68, 0.30), inset 0 1px 1px 0 rgba(255, 255, 255, 0.35)',
        'glass-navy-hover': '0 8px 22px -2px rgba(15, 39, 68, 0.40), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.5)',
        'glass-danger': '0 4px 16px -2px rgba(15, 39, 68, 0.20), inset 0 1px 1px 0 rgba(255, 255, 255, 0.4)',
        'glass-emerald': '0 4px 16px -2px rgba(5, 150, 105, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.5)',
        'glass-emerald-hover': '0 8px 22px -2px rgba(5, 150, 105, 0.35), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.7)',
        'glass-purple': '0 4px 16px -2px rgba(124, 58, 237, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.5)',
        'glass-purple-hover': '0 8px 22px -2px rgba(124, 58, 237, 0.35), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.7)',
        'glass-amber': '0 4px 16px -2px rgba(217, 119, 6, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.5)',
        'glass-amber-hover': '0 8px 22px -2px rgba(217, 119, 6, 0.35), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.7)',
        'glass-cyan': '0 4px 16px -2px rgba(8, 145, 178, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.5)',
        'glass-cyan-hover': '0 8px 22px -2px rgba(8, 145, 178, 0.35), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.7)',
      },
      borderRadius: {
        card: '16px',
        clay: '20px',
        'clay-lg': '26px',
        button: '10px',
        badge: '8px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 1.5s infinite',
        pulseSlow: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
