import Router from '@koa/router'
import ICustomContext from '../ICustomContext'
import ICustomState from '../ICustomState'

export function buildRouter (path: string) {
  const router = new Router<ICustomState, ICustomContext>()

  router.get('/',
    async (ctx, next) => {
      const options = [
        {
          name: 'potatis'
        },
        {
          name: 'ägg'
        }
      ]

      ctx.send(options)
    }
  )

  return router
}
