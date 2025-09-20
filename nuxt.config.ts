// nuxt.config.ts (Frontend - Netlify SSG)
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  ssr: false,
  nitro: { preset: 'static' }, // genera .output/public

  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    // '@/assets/styles/global.css', // si la usas
  ],

  app: {
    head: {
      title: 'Volcanes y Raíces',
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' },
        { rel: 'icon', type: 'image/png', href: '/logo.png' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      // Se define en Netlify → Environment Variables
      apiBase: process.env.PUBLIC_API_BASE || 'https://TU-API.up.railway.app'
    }
  }
})
