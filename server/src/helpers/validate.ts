import { badRequest } from '@hapi/boom'
import Router from '@koa/router'
import Joi from 'joi'
import { Context, Next, ParameterizedContext } from 'koa'
import ICustomContext from '../ICustomContext'
import ICustomState from '../ICustomState'

const validators: Record<string, { schema: Joi.Schema, description: Joi.Description }> = {}

export function validate (schemaDef: Joi.SchemaMap, optional = false) {
  const schema = Joi.object(schemaDef)

  // if (!optional) {
  //   schema = schema.options({ presence: 'required' })
  // }

  return (ctx: Context, next: Next) => {
    const { error } = schema.validate(ctx.request.body, {
      abortEarly: false
    })

    if (error) {
      const boomError = badRequest(error.message)
      boomError.output.payload.data = error.details
      throw boomError
    }

    return next()
  }
}

export function sendValidators (ctx: ParameterizedContext<ICustomState, ICustomContext & Router.RouterParamContext<ICustomState, ICustomContext>>) {
  const descriptions: Record<string, Joi.Description> = {}

  for (const path in validators) {
    descriptions[path] = validators[path].description
  }

  ctx.send(descriptions)
}
