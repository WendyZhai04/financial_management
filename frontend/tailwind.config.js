/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'notion-black': 'rgba(0,0,0,0.95)',
        'warm-white': '#f6f5f4',
        'warm-dark': '#31302e',
        'warm-gray-500': '#615d59',
        'warm-gray-300': '#a39e98',
        'notion-blue': '#0075de',
        'active-blue': '#005bab',
        'badge-blue-bg': '#f2f9ff',
        'badge-blue-text': '#097fe8',
        'focus-blue': '#097fe8',
        'teal': '#2a9d99',
        'green': '#1aae39',
        'orange': '#dd5b00',
        'pink': '#ff64c8',
        'purple': '#391c57',
        'brown': '#523410',
      },
      fontFamily: {
        notion: ['Inter', '-apple-system', 'system-ui', 'Segoe UI', 'Helvetica', 'Apple Color Emoji', 'Arial', 'Segoe UI Emoji', 'Segoe UI Symbol', 'sans-serif'],
      },
      boxShadow: {
        'card': 'rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.84688px, rgba(0,0,0,0.02) 0px 0.8px 2.925px, rgba(0,0,0,0.01) 0px 0.175px 1.04062px',
        'deep': 'rgba(0,0,0,0.01) 0px 1px 3px, rgba(0,0,0,0.02) 0px 3px 7px, rgba(0,0,0,0.02) 0px 7px 15px, rgba(0,0,0,0.04) 0px 14px 28px, rgba(0,0,0,0.05) 0px 23px 52px',
      },
      letterSpacing: {
        'display': '-2.125px',
        'section': '-1.5px',
        'subhead': '-0.625px',
        'card': '-0.25px',
        'body-lg': '-0.125px',
        'badge': '0.125px',
      },
      borderRadius: {
        'micro': '4px',
        'subtle': '5px',
        'standard': '8px',
        'comfortable': '12px',
        'large': '16px',
        'pill': '9999px',
      },
    },
  },
  plugins: [],
}
