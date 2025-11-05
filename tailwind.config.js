/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0066ff",
        "background-light": "#f9f9f9",
        "background-dark": "#121212",
        "surface-light": "#ffffff",
        "surface-dark": "#1e1e1e",
        "text-light": "#252627",
        "text-dark": "#dee1e7",
        "text-secondary-light": "#6b7280",
        "text-secondary-dark": "#9ca3af",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
