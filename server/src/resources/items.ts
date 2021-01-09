import Router from '@koa/router'
import ICustomContext from '../ICustomContext'
import ICustomState from '../ICustomState'
import { validate } from '../helpers/validate'
import Joi from 'joi'

export function buildRouter (path: string) {
  const router = new Router<ICustomState, ICustomContext>()

  interface CreateBody {
    name: string,
    checked?: boolean,
    listId: string,
    categoryId?: string
  }

  router.post('/',
    validate({
      name: Joi.string().required(),
      checked: Joi.boolean(),
      listId: Joi.string().required(),
      categoryId: Joi.string()
    }),

    async (ctx, next) => {
      const body = <CreateBody>ctx.request.body

      const item = await ctx.db.item.create({
        data: {
          name: body.name,
          checked: body.checked || undefined,
          list: {
            connect: {
              id: body.listId
            }
          },
          category: body.categoryId
            ? {
                connect: {
                  id: body.categoryId
                }
              }
            : undefined
        }
      })

      ctx.send(item)
    }
  )

  interface UpdateBody {
    name?: string,
    checked?: boolean,
    categoryId?: string
  }

  router.patch('/:id',
    validate({
      name: Joi.string(),
      checked: Joi.boolean(),
      categoryId: Joi.string()
    }),

    async (ctx, next) => {
      const body = <UpdateBody>ctx.request.body

      const item = await ctx.db.item.update({
        where: {
          id: ctx.params.id
        },
        data: {
          name: body.name || undefined,
          checked: body.checked !== undefined ? body.checked : undefined,
          category: body.categoryId
            ? {
                connect: {
                  id: body.categoryId
                }
              }
            : undefined
        }
      })

      ctx.send(item)
    }
  )

  router.delete('/:id',
    async (ctx, next) => {
      const item = await ctx.db.item.delete({
        where: {
          id: ctx.params.id
        }
      })

      ctx.send(item)
    }
  )

  return router
}
