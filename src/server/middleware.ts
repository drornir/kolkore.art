import { createMiddleware } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '@/auth'
import { AdminRepo, QueryRepo } from '@/data/calls-repo'

export const withCallsRepo = createMiddleware().server(async ({ next }) => {
  return next({
    context: {
      callsRepo: new QueryRepo(),
    },
  })
})
export const withAdminCallsRepo = createMiddleware().server(
  async ({ next }) => {
    const req = getRequest()
    const session = await auth.api.getSession({ headers: req.headers })

    if (!session || session.user.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    return next({
      context: {
        callsAdminRepo: new AdminRepo(),
      },
    })
  },
)
