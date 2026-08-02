/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#050810',
        panel: '#0a1224',
        panelLight: '#121e38',
        cyan: '#3de8ff',
        cyanDim: '#1a8fa8',
        ice: '#b8e8ff',
        gold: '#e8c547',
        alert: '#ff4d6a',
        hud: '#6bffb8',
        gundam: '#c41e3a',
        crimson: '#e8243a',
        crimsonDim: '#8b1530',
        accent: '#9b7bff',
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        ui: ['Rajdhani', 'sans-serif'],
        body: ['IBM Plex Sans', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(61, 232, 255, 0.25)',
        panel: '0 0 0 1px rgba(61, 232, 255, 0.2), 0 20px 60px rgba(0,0,0,0.5)',
      },
      animation: {
        scan: 'scan 4s linear infinite',
        pulseHud: 'pulseHud 2s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        pulseHud: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
