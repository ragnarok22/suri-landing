import { defineConfig } from 'astro/config'

import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

import vercel from '@astrojs/vercel'

const devHosts = ['localhost', '127.0.0.1', '[::1]']
const devOrigins = devHosts.map((host) => `http://${host}:4321`)

// https://astro.build/config
export default defineConfig({
  site: 'https://suriapp.sr',
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: devHosts,
      cors: {
        origin: devOrigins,
      },
    },
  },
  integrations: [react(), sitemap()],
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
})
