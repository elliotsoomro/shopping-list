import { Boom, internal, methodNotAllowed, notFound, notImplemented } from '@hapi/boom'
import cors from '@koa/cors'
import { PrismaClient } from '@prisma/client'
import Koa, { Context } from 'koa'
import bodyParser from 'koa-bodyparser'
import session from 'koa-generic-session'
import helmet from 'koa-helmet'
import passport from 'koa-passport'
import pino from 'koa-pino-logger'
import redisStore from 'koa-redis'
import { buildStrategy } from './auth0Strategy'
import { config } from './config'
import ICustomContext from './ICustomContext'
import ICustomState from './ICustomState'
import { ensureSession } from './helpers/session'
import { buildRouter } from './resources'

function buildApp () {
  const app = new Koa<ICustomState, ICustomContext>()

  app.context.db = new PrismaClient()

  // Make sure we properly close the server before Prisma shuts down the
  // application. See https://github.com/prisma/prisma/issues/2917
  ;(app.context.db.$on as any)('beforeExit', () => {
    process.exit()
  })

  app.keys = config.appKeys

  const loggerMiddleware = pino({
    autoLogging: !config.isDev,
    prettyPrint: config.isDev
      ? { colorize: true }
      : false,
    level: config.isDev ? 'trace' : 'info'
  })
  app.use(loggerMiddleware)

  app.use(session({
    // @ts-expect-error
    store: redisStore({
      url: config.redisURL
    }),
    renew: true
  }))

  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      const errToSend: Boom = err.isBoom ? err : internal()

      ctx.status = errToSend.output.statusCode
      ctx.body = {
        data: null,
        error: errToSend.output.payload
      }
      ctx.set(errToSend.output.headers as Record<string, string | string[]>)

      ctx.app.emit('error', err, ctx)
    }
  })

  app.on('error', (err, ctx: Context) => {
    // Ignore error if it's a boom error and it's for the user
    if (err.isBoom && err.output.statusCode < 500) {
      return
    }

    ctx.log.error(err)
    /* centralized error handling:
     *   console.log error
     *   write error to log file
     *   save error and request information to database if ctx.request match condition
     *   ...
    */
  })

  app.use(helmet())
  app.use(cors({
    credentials: true
  }))
  app.use(bodyParser())

  // Add the Auth0 strategy to Passport
  const strategy = buildStrategy(app.context.db)
  passport.use(strategy)

  // Serializers required for Passport to function. We don't need any special logic.
  passport.serializeUser((user, done) => done(null, user))
  // @ts-expect-error
  passport.deserializeUser((user, done) => done(null, user))

  app.use(passport.initialize())
  app.use(passport.session())

  // Make sure that the session is set up before proceeding
  app.use(ensureSession())

  app.context.send = function (data: any) {
    this.body = {
      data,
      error: null
    }
  }

  const router = buildRouter()

  app.use(router.routes())
  app.use(router.allowedMethods({
    throw: true,
    notImplemented: () => notImplemented(),
    methodNotAllowed: () => methodNotAllowed()
  }))

  app.use(() => {
    throw notFound()
  })

  return app
}

export {
  buildApp
}
