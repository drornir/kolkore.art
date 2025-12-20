import { createServerFn } from '@tanstack/react-start'

import { zodQueryParams } from '@/data/calls'
import { withCallsRepo } from './middleware'

export const getHomepageCalls = createServerFn()
  .middleware([withCallsRepo])
  .inputValidator(zodQueryParams)
  .handler(async ({ data, context }) => {
    return await context.callsRepo.query({
      filters: data.filters,
      sort: data.sort,
      pagination: data.pagination,
    })
  })
