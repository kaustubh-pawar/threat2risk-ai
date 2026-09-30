/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkCanvas: "#0B0F17",
        darkCard: "#131B2E",
        darkCardHover: "#182238",
        darkBorder: "#1E293B",
        electricBlue: "#3B82F6",
        electricBlueGlow: "rgba(59, 130, 246, 0.3)",
        violetAccent: "#8B5CF6",
        criticalRed: "#EF4444",
        highOrange: "#F97316",
        mediumYellow: "#EAB308",
        lowGreen: "#10B981",
        // Base dark palette
        ink: {
          950: '#05070b',
          900: '#0a0e16',
          850: '#0d121d',
          800: '#111827',
          700: '#1a2233',
          600: '#243044',
          500: '#334155',
        },
        // Cyber neon accents
        cyber: {
          green: '#00ff9d',
          cyan: '#00e5ff',
          blue: '#0a84ff',
          violet: '#7c5cff',
        },
        // Risk severity
        risk: {
          low: '#00ff9d',
          medium: '#00e5ff',
          high: '#ffaa00',
          critical: '#ff2d55',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(0,255,157,0.35)',
        'glow-cyan': '0 0 20px rgba(0,229,255,0.35)',
        'glow-blue': '0 0 20px rgba(10,132,255,0.35)',
        'glow-violet': '0 0 20px rgba(124,92,255,0.35)',
        'glow-critical': '0 0 24px rgba(255,45,85,0.45)',
        'glow-high': '0 0 20px rgba(255,170,0,0.4)',
        'inner-cyber': 'inset 0 0 30px rgba(0,229,255,0.08)',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '45%': { opacity: '1' },
          '50%': { opacity: '0.6' },
          '55%': { opacity: '1' },
        },
        gridMove: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        floatUp: {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '10%': { opacity: '0.6' },
          '90%': { opacity: '0.6' },
          '100%': { transform: 'translateY(-100vh)', opacity: '0' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        dataStream: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        criticalPulse: {
          '0%, 100%': { boxShadow: 'inset 0 0 60px rgba(255,45,85,0.0)' },
          '50%': { boxShadow: 'inset 0 0 80px rgba(255,45,85,0.25)' },
        },
      },
      animation: {
        scanline: 'scanline 6s linear infinite',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
        flicker: 'flicker 4s linear infinite',
        gridMove: 'gridMove 8s linear infinite',
        blink: 'blink 1s step-end infinite',
        floatUp: 'floatUp 8s linear infinite',
        spinSlow: 'spinSlow 20s linear infinite',
        dataStream: 'dataStream 3s linear infinite',
        criticalPulse: 'criticalPulse 2.5s ease-in-out infinite',
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}

