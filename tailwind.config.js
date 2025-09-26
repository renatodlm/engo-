/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./src/**/*.html", "./dist/**/*.html", "./*.html", "./src/**/*.js", "./dist/**/*.js", "./*.js"],
   theme: {
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
            'deal-in': 'dealIn 0.35s ease both',
         },
         keyframes: {
            dealIn: {
               'from': { transform: 'translateY(-14px) scale(0.98)', opacity: '0' },
               'to': { transform: 'translateY(0) scale(1)', opacity: '1' }
            }
         },
         backgroundImage: {
            'game-gradient': 'radial-gradient(1200px 700px at 20% -10%, #1b2a56, transparent), radial-gradient(900px 500px at 90% 0, rgba(58, 29, 106, 0.4), transparent)',
            'game-panel-gradient': 'linear-gradient(180deg, #111a2e, #0f1830), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))',
            'game-card-gradient': 'linear-gradient(180deg, #213057, #162346)',
            'game-btn-gradient': 'linear-gradient(180deg, #2a3a72, #1a2550)',
            'game-accent-gradient': 'linear-gradient(90deg, #6ee7ff, #a78bfa)',
            'game-progress-gradient': 'linear-gradient(90deg, #6ee7ff, #a78bfa)',
         }
      },
   },
   plugins: [],
}
