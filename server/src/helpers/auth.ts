import { forbidden } from '@hapi/boom'
import Router from '@koa/router'
import { Next, ParameterizedContext } from 'koa'
import ICustomContext from '../ICustomContext'
import ICustomState from '../ICustomState'

export function auth (cb?: (ctx: ParameterizedContext<ICustomState, ICustomContext & Router.RouterParamContext<ICustomState, ICustomContext>>, next: Next) => void) {
  return async (ctx: ParameterizedContext<ICustomState, ICustomContext & Router.RouterParamContext<ICustomState, ICustomContext>>, next: Next) => {
    if (ctx.isUnauthenticated()) {
      if (cb) {
        cb(ctx, next)
        return
      } else {
        throw forbidden()
      }
    }

    return next()
  }
}
