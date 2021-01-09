import { PrismaClient } from '@prisma/client'
import { Session } from 'koa-generic-session'

export default interface ICustomContext {
  db: PrismaClient

  send: (data: any) => void

  // Passport methods
  login(user: any, options?: any): Promise<void>
  logIn: ICustomContext['login']

  logout(): void;
  logOut: ICustomContext['logout']

  isAuthenticated(): boolean
  isUnauthenticated(): boolean

  session: Session
  sessionSave: boolean | null
  regenerateSession(): Generator
}
