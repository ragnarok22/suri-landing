/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',
        secondary: '#E0F7FA',
        accent: '#FFC107',
        card: '#F5F5F5',
        'card-foreground': '#212121',
      },
    },
  },
  plugins: [],
}

