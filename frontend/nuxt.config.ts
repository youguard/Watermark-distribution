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
  css: ['~/assets/css/main.css', 'vue3-toastify/dist/index.css'],

  // 🔹 Google Search Console & 네이버 웹마스터 도구 인증 태그 추가
  app: {
    head: {
      meta: [
        { name: "google-site-verification", content: "gdclOcaoXxkxln1EP7TK3QsdwG4rMZr-rMnUxtp6LGQ" },
        { name: "naver-site-verification", content: "b80e90d89793733822fd10860efc3c2276541563" }
      ]
    }
  }
});
