import Router from '@koa/router'
import ICustomContext from '../ICustomContext'
import ICustomState from '../ICustomState'
import { validate } from '../helpers/validate'
import Joi from 'joi'

export function buildRouter (path: string) {
  const router = new Router<ICustomState, ICustomContext>()

  router.get('/',
    async (ctx, next) => {
      const categories = await ctx.db.category.findMany()

      ctx.send(categories)
    }
  )

  interface CreateBody {
    name: string
  }

  router.post('/',
    validate({
      name: Joi.string().required()
    }),

    async (ctx, next) => {
      const body = <CreateBody>ctx.request.body

      const category = await ctx.db.category.create({
        data: {
          name: body.name
        }
      })

      ctx.send(category)
    }
  )

  return router
}
