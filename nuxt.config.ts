// Frontend/nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  ssr: true,                 // <- SSG
  nitro: { preset: 'static' },// <- genera .output/public

  css: ['bootstrap/dist/css/bootstrap.min.css'],

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
      apiBase: process.env.PUBLIC_API_BASE || 'https://volcanes-backend-production.up.railway.app',
      disableContact: process.env.PUBLIC_DISABLE_CONTACT === '1' // ⬅️ nuevo
    }
  }
})
