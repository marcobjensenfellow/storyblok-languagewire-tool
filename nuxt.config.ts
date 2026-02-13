export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    baseUrl: process.env.BASE_URL,
    public: {
      baseUrl: process.env.BASE_URL
    }
  },

  modules: [
    '@storyblok/vue'
  ],

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2024-12-01'
})
