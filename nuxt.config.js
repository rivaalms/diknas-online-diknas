import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - diknas-online-diknas',
    title: 'diknas-online-diknas',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/axios.js',
  ],

  router: {
    middleware: ['auth']
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/dotenv'
  ],

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/diknas/login', method: 'post', propertyName: 'data' },
          logout: { url: '/diknas/logout', method: 'post' },
          user: { url: '/diknas/getSelf', method: 'get', propertyName: 'data' }
        },
        token: {
          property: 'token',
          global: true,
          required: true,
          type: 'Bearer'
        },
      }
    },
    redirect: {
      login: '/login',
      logout: '/',
      home: '/'
    }
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: `${process.env.DIKNAS_ONLINE_API_URL}`,
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: false,
      themes: {
        light: {
          primary: colors.blue.accent3,
          accent: colors.yellow.accent4,
          secondary: "#ADB5BD",
          info: colors.cyan.lighten1,
          warning: colors.amber.darken3,
          error: colors.red.base,
          success: colors.green.darken2,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['defu'],
  },

  env: {
    DIKNAS_ONLINE_API_URL: 'http://diknas-online-api.test'
  },

  server: {
    port: 4500
  }
}
