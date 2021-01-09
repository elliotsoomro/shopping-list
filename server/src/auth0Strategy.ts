import { PrismaClient } from '@prisma/client'
import Auth0Strategy from 'passport-auth0'
import { config } from './config'

export function buildStrategy (prisma: PrismaClient) {
  // Set up Auth0 Passport strategy
  const strategy = new Auth0Strategy({
    domain: config.auth0.domain,
    clientID: config.auth0.clientId,
    clientSecret: config.auth0.clientSecret,
    callbackURL: `${config.apiURL}/auth/callback`
  }, async (accessToken, refreshToken, extraParams, profile, done) => {
    // Find related user or create if non was found
    const user = await prisma.user.upsert({
      where: {
        auth0Id: profile.id
      },
      create: {
        auth0Id: profile.id
      },
      update: {}
    })

    // Return the profile
    const newProfile = {
      ...profile,
      localId: user.id
    }

    return done(null, newProfile)
  })

  return strategy
}
