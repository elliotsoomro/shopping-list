interface Config {
  port: string

  apiURL: string
  frontendURL: string

  redisURL: string | undefined

  isDev: boolean
  appKeys: string[]

  auth0: {
    domain: string,
    clientId: string,
    clientSecret: string
  }
}

interface ConfigOptions { }

export let config = {} as Config

export function buildConfig (options: ConfigOptions = {}) {
  if (!process.env.PORT) { throw new Error('Missing environment variable PORT') }

  if (!process.env.API_URL) { throw new Error('Missing environment variable API_URL') }
  if (!process.env.FRONTEND_URL) { throw new Error('Missing environment variable FRONTEND_URL') }

  if (!process.env.APP_KEYS) { throw new Error('Missing environment variable APP_KEYS') }

  if (!process.env.AUTH0_DOMAIN) { throw new Error('Missing environment variable AUTH0_DOMAIN') }
  if (!process.env.AUTH0_CLIENT_ID) { throw new Error('Missing environment variable AUTH0_CLIENT_ID') }
  if (!process.env.AUTH0_CLIENT_SECRET) { throw new Error('Missing environment variable AUTH0_CLIENT_SECRET') }

  config = {
    port: process.env.PORT,

    apiURL: process.env.API_URL,
    frontendURL: process.env.FRONTEND_URL,

    redisURL: process.env.REDIS_URL || undefined,

    isDev: process.env.NODE_ENV === 'development',
    appKeys: process.env.APP_KEYS.split(','),

    auth0: {
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET
    },

    ...options
  } as Config
}
