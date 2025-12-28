import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins'

import { db } from '@/db/drizzle'

export const auth = betterAuth({
  database: drizzleAdapter(db(), { provider: 'sqlite' }),
  baseURL: (() => {
    switch (process.env.VERCEL_ENV) {
      case 'production':
        if (!process.env.VERCEL_PROJECT_PRODUCTION_URL) {
          throw new Error('VERCEL_PROJECT_PRODUCTION_URL is not set')
        }
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      // case 'preview':
      // case 'development':
      //   if (!process.env.VERCEL_BRANCH_URL) {
      //     throw new Error('VERCEL_BRANCH_URL is not set')
      //   }
      //   return `https://${process.env.VERCEL_BRANCH_URL}`
      default:
        // return process.env.BETTER_AUTH_URL
        return undefined // automatic from headers
    }
  })(),
  trustedOrigins: () => {
    switch (process.env.VERCEL_ENV) {
      case 'production':
        if (!process.env.VERCEL_PROJECT_PRODUCTION_URL) {
          throw new Error('VERCEL_PROJECT_PRODUCTION_URL is not set')
        }
        return [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      case 'preview':
      case 'development':
        if (!process.env.VERCEL_BRANCH_URL) {
          throw new Error('VERCEL_BRANCH_URL is not set')
        }
        if (!process.env.VERCEL_URL) {
          throw new Error('VERCEL_URL is not set')
        }
        return [
          `https://${process.env.VERCEL_BRANCH_URL}`,
          `https://${process.env.VERCEL_URL}`,
        ]
      default:
        if (!process.env.BETTER_AUTH_URL) {
          throw new Error('BETTER_AUTH_URL is not set')
        }
        return [process.env.BETTER_AUTH_URL]
    }
  },
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user',
        input: false, // don't allow user to set role
      },
    },
  },
  plugins: [admin()],
})
