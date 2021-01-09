import Router from '@koa/router'
import ICustomContext from '../ICustomContext'
import ICustomState from '../ICustomState'
import { notFound } from '@hapi/boom'
import { validate } from '../helpers/validate'
import Joi from 'joi'

export function buildRouter (path: string) {
  const router = new Router<ICustomState, ICustomContext>()

  router.get('/',
    async (ctx, next) => {
      const lists = await ctx.db.list.findMany()

      ctx.send(lists)
    }
  )

  router.get('/:id',
    async (ctx, next) => {
      const list = await ctx.db.list.findFirst({
        where: {
          id: ctx.params.id
        },
        include: {
          items: true
        }
      })

      if (!list) {
        throw notFound('List not found')
      }

      ctx.send(list)
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

      const list = await ctx.db.list.create({
        data: {
          name: body.name
        }
      })

      ctx.send(list)
    }
  )

  interface UpdateBody {
    name?: string
  }

  router.patch('/:id',
    validate({
      name: Joi.string()
    }),

    async (ctx, next) => {
      const body = <UpdateBody>ctx.request.body

      const list = await ctx.db.list.update({
        where: {
          id: ctx.params.id
        },
        data: {
          name: body.name || undefined
        }
      })

      ctx.send(list)
    }
  )

  router.delete('/:id',
    async (ctx, next) => {
      const list = await ctx.db.list.delete({
        where: {
          id: ctx.params.id
        }
      })

      ctx.send(list)
    }
  )

  return router
}
