// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    // '@/assets/styles/base.css', // si la usas
  ],

  app: {
    head: {
      title: 'Volcanes y Raíces',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
        },
        { rel: 'icon', type: 'image/png', href: '/logo.png' }
      ]
      // No metas JS por CDN aquí; usa plugins *.client.ts
    }
  },

  nitro: { preset: 'vercel' },   // Para deploy perfecto en Vercel
  build: { transpile: [] },

  runtimeConfig: {
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    contactTo: process.env.CONTACT_TO,
    public: {}
  }
})
