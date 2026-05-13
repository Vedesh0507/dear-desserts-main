/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxurious deep chocolate palette
        chocolate: {
          50: '#FAF7F5',
          100: '#F5EDE6',
          200: '#E8D5C4',
          300: '#D4B896',
          400: '#B8916A',
          500: '#7C4A32',
          600: '#5D3727',
          700: '#4A2C1F',
          800: '#3A2218',
          900: '#2D1A13',
          950: '#1A0F0B',
        },
        // Warm cream tones
        cream: {
          50: '#FFFEF9',
          100: '#FEFBF3',
          200: '#FCF6E8',
          300: '#F8EDDA',
          400: '#F2E0C6',
          500: '#E8D0AD',
        },
        // Rich gold accents
        gold: {
          300: '#F0D890',
          400: '#E6C55C',
          500: '#D4A833',
          600: '#B8923A',
          700: '#8B6914',
        },
        // Deep burgundy for contrast
        burgundy: {
          500: '#722F37',
          600: '#5C262D',
          700: '#461D22',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        script: ['Great Vibes', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(212, 168, 51, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(212, 168, 51, 0.5)' },
        },
      },
      boxShadow: {
        'soft': '0 4px 20px -4px rgba(58, 34, 24, 0.08)',
        'card': '0 8px 30px -8px rgba(58, 34, 24, 0.12)',
        'elevated': '0 20px 50px -12px rgba(58, 34, 24, 0.2)',
        'luxury': '0 25px 60px -15px rgba(45, 26, 19, 0.25)',
        'inner-glow': 'inset 0 2px 20px rgba(255, 255, 255, 0.1)',
        'gold': '0 10px 40px -10px rgba(212, 168, 51, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-luxury': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
