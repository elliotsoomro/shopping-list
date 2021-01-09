const baseUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/*$/, '')
const apiUrl = (process.env.API_URL || 'http://localhost:4000').replace(/\/*$/, '')
// const devApiUrl = process.env.DEV_API_URL || 'http://localhost:4000'

export default {
  publicRuntimeConfig: {
    baseUrl,
    apiUrl
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: null,
    titleTemplate: pageName => pageName ? `${pageName} – Shopping List` : 'Shopping List',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/auth.js', // Crashes the client
    '~/plugins/api.js'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/fontawesome'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    'nuxt-vue-select'
  ],

  buefy: {
    defaultIconPack: 'fas',
    defaultIconComponent: 'FontAwesomeIcon'
  },

  fontawesome: {
    icons: {
      // solid: true,  // include the full pack in the bundle, not recommended
      solid: ['faPen', 'faTrash', 'faAngleUp', 'faAngleDown', 'faAngleLeft', 'faCog']
    }
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: apiUrl,
    withCredentials: true
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }

  // proxy: {
  //   '/api': {
  //     target: devApiUrl,
  //     pathRewrite: {
  //       '^/api': '/'
  //     }
  //   }
  // }
}
