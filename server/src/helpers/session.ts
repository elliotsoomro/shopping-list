import { badRequest } from '@hapi/boom'
import { Context, Next } from 'koa'

export function ensureSession () {
  return (ctx: Context, next: Next) => {
    if (!ctx.session) {
      throw badRequest('Session not found')
    }

    return next()
  }
}
