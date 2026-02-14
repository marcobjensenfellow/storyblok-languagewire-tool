export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    baseUrl: process.env.BASE_URL,
    storyblokAccessToken: process.env.STORYBLOK_ACCESS_TOKEN,
    public: {
      baseUrl: process.env.BASE_URL
    }
  },

  modules: [],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
        }
      ]
    }
  },

  compatibilityDate: '2024-12-01'
})
