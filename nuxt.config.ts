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

  compatibilityDate: '2024-12-01'
})
