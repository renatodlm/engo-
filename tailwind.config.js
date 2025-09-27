/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./src/**/*.html", "./dist/**/*.html", "./*.html", "./src/**/*.js", "./dist/**/*.js", "./*.js"],
   theme: {
      borderRadius: {
         'none': '0',
         'sm': '0.25rem',
         DEFAULT: '0.375rem',
         'md': '0.375rem',
         'lg': '0.5rem',
         'xl': '0.75rem',
         '2xl': '1rem',
         '3xl': '1.5rem',
         'full': '9999px',
      },
      extend: {
         colors: {
            'game-bg': '#0b1220',
            'game-panel': '#111a2e',
            'game-panel-2': '#0f1830',
            'game-muted': '#9fb0d0',
            'game-accent': '#6ee7ff',
            'game-accent-2': '#a78bfa',
            'game-good': '#22c55e',
            'game-warn': '#f59e0b',
            'game-bad': '#ef4444',
            'game-card': '#182341',
            'game-card-hi': '#1f2e59',
            'game-border': '#203157',
            'game-border-2': '#27407a',
            'game-border-3': '#23386e',
            'game-text': '#e7eefc',
            'game-text-2': '#d7e4ff',
            'game-text-3': '#c7d6ff',
            'game-text-4': '#dff6ff',
            'game-text-5': '#b9c9ef',
            'game-bg-2': '#1b2a56',
            'game-bg-3': '#122045',
            'game-bg-4': '#0e1730',
            'game-shadow-color': 'rgba(0,0,0,0.35)',
         },
         fontFamily: {
            'game': ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
         },
         boxShadow: {
            'game': '0 8px 28px rgba(0,0,0,0.35)',
            'game-card': '0 12px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
            'game-card-hover': '0 18px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.09)',
         },
         animation: {
            'deal-in': 'dealIn 0.2s ease both',
            'card-flip': 'cardFlip 0.4s ease both',
            'card-draw': 'cardDraw 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
         },
         keyframes: {
            dealIn: {
               'from': { transform: 'translateY(-14px) scale(0.98)', opacity: '0' },
               'to': { transform: 'translateY(0) scale(1)', opacity: '1' }
            },
            cardFlip: {
               '0%': { transform: 'rotateY(180deg) scale(0.8)' },
               '50%': { transform: 'rotateY(90deg) scale(0.9)' },
               '100%': { transform: 'rotateY(0deg) scale(1)' }
            },
            cardDraw: {
               '0%': { transform: 'rotateY(180deg) scale(0.8) translateY(-20px) rotateZ(8deg)', opacity: '0.7' },
               '30%': { transform: 'rotateY(135deg) scale(0.9) translateY(-10px) rotateZ(4deg)', opacity: '0.85' },
               '60%': { transform: 'rotateY(90deg) scale(0.95) translateY(-5px) rotateZ(2deg)', opacity: '0.9' },
               '80%': { transform: 'rotateY(45deg) scale(0.98) translateY(-2px) rotateZ(1deg)', opacity: '0.95' },
               '100%': { transform: 'rotateY(0deg) scale(1) translateY(0px) rotateZ(0deg)', opacity: '1' }
            }
         },
         backgroundImage: {
            'game-gradient': 'linear-gradient(135deg, rgba(27, 42, 86, 0.3), rgba(15, 24, 48, 0.8))',
            'game-panel-gradient': 'linear-gradient(180deg, rgba(17, 26, 46, 0.9), rgba(15, 24, 48, 0.95))',
            'game-card-gradient': 'linear-gradient(180deg, rgba(33, 48, 87, 0.9), rgba(22, 35, 70, 0.95))',
            'game-btn-gradient': 'linear-gradient(180deg, rgba(42, 58, 114, 0.9), rgba(26, 37, 80, 0.95))',
            'game-accent-gradient': 'linear-gradient(90deg, #6ee7ff, #a78bfa)',
            'game-progress-gradient': 'linear-gradient(90deg, rgba(110, 231, 255, 0.8), rgba(167, 139, 250, 0.8))',
            'game-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            'player-area': 'linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(34, 197, 94, 0.03))',
            'opponent-area': 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.03))',
         }
      },
   },
   plugins: [],
}
