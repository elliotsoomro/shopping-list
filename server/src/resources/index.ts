import Router from '@koa/router'
import { auth as authMiddleware } from '../helpers/auth'
import { sendValidators } from '../helpers/validate'
import ICustomContext from '../ICustomContext'
import ICustomState from '../ICustomState'
import * as auth from './auth'
import * as users from './users'
import * as lists from './lists'
import * as items from './items'
import * as categories from './categories'
import * as options from './options'

interface Resource {
  buildRouter: (path: string) => Router<ICustomState, ICustomContext>
}

export function buildRouter () {
  const router = new Router<ICustomState, ICustomContext>()

  function subRouter (path: string, resource: Resource, useAuth: boolean = true) {
    const routes = resource.buildRouter(path).routes()

    if (useAuth) {
      router.use(path, authMiddleware(), routes)
    } else {
      router.use(path, routes)
    }
  }

  subRouter('/auth', auth, false)
  subRouter('/users', users)
  subRouter('/lists', lists, false)
  subRouter('/items', items, false)
  subRouter('/categories', categories, false)
  subRouter('/options', options, false)

  router.get('/_/validators', sendValidators)

  return router
}
