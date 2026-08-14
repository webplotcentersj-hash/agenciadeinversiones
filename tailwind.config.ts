import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      // Los tokens completos viven en app/globals.css (:root). Acá sólo lo que
      // se necesita como utilidad de Tailwind.
      colors: {
        // Gradiente institucional: claro → medio → sombra.
        brand: { 300: '#e8484b', 400: '#c61014', 500: '#7c1011', 600: '#311413' },
        ink: { DEFAULT: '#fdf3ec' },
      },
    },
  },
  plugins: [],
};

export default config;
