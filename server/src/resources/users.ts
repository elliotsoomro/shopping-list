import { notFound } from '@hapi/boom'
import Router from '@koa/router'
import ICustomContext from '../ICustomContext'
import ICustomState from '../ICustomState'

export function buildRouter (path: string) {
  const router = new Router<ICustomState, ICustomContext>()

  router.get('/',
    async (ctx, next) => {
      const users = await ctx.db.user.findMany()

      ctx.send(users)
    }
  )

  router.get('/:id',
    async (ctx, next) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.params.id }
      })

      if (!user || ctx.params.id === ctx.state.user.localId) {
        throw notFound('User not found')
      }

      ctx.send(user)
    }
  )

  return router
}
