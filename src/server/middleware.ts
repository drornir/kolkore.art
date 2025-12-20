import { createMiddleware } from '@tanstack/react-start'
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
    return next({
      context: {
        callsAdminRepo: new AdminRepo(),
      },
    })
  },
)
