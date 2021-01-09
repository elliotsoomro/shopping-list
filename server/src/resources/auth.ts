import Router from '@koa/router'
import { auth } from '../helpers/auth'
import ICustomContext from '../ICustomContext'
import passport from 'koa-passport'
import { config } from '../config'
import { URL } from 'url'
import queryString from 'querystring'
import ICustomState from '../ICustomState'

export function buildRouter (path: string) {
  const router = new Router<ICustomState, ICustomContext>()

  router.get('/login',
    passport.authenticate('auth0', {
      scope: 'openid email profile'
    }),
    (ctx, next) => {
      ctx.send({
        ok: true
      })
    }
  )

  router.get('/callback',
    async (ctx, next) => passport.authenticate('auth0', async (err, user, info) => {
      if (err) { throw err }
      if (!user) {
        return ctx.redirect(`/auth/failure?info=${JSON.stringify(info)}`)
      }

      await ctx.login(user)

      const returnTo = ctx.session?.returnTo
      delete ctx.session?.returnTo

      ctx.redirect(returnTo || config.frontendURL)
    })(ctx, next)
  )

  router.get('/logout',
    (ctx, next) => {
      ctx.logout()

      const logoutURL = new URL(
      `https://${config.auth0.domain}/v2/logout`
      )
      const searchString = queryString.stringify({
        client_id: config.auth0.clientId,
        returnTo: config.frontendURL
      })
      logoutURL.search = searchString

      ctx.redirect(logoutURL.href)
    }
  )

  router.get('/me',
    auth(),

    async (ctx, next) => {
      ctx.send(ctx.state.user)
    }
  )

  return router
}
