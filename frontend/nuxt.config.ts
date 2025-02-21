// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  router: {
    middleware: ['auth'],
  },
  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:5000/api",
        changeOrigin: true,
        prependPath: true,
      }
    }
  },
  css: ['~/assets/css/main.css', 'vue3-toastify/dist/index.css'],
})
