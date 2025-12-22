import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins'

import { db } from '@/db/drizzle'

export const auth = betterAuth({
  database: drizzleAdapter(db(), { provider: 'sqlite' }),
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
