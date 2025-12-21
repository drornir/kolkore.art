import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

import {
  zodCallNoId,
  zodQueryParams,
  zodQueryParamsWithArchived,
} from '@/data/calls'
import { withAdminCallsRepo, withCallsRepo } from './middleware'

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

export const getAdminCalls = createServerFn()
  .middleware([withAdminCallsRepo])
  .inputValidator(zodQueryParamsWithArchived)
  .handler(async ({ data, context }) => {
    return await context.callsAdminRepo.query({
      filters: data.filters,
      sort: data.sort,
      pagination: data.pagination,
    })
  })

export const createCall = createServerFn()
  .middleware([withAdminCallsRepo])
  .inputValidator(
    zodCallNoId.omit({ createdAt: true, updatedAt: true, archivedAt: true }),
  )
  .handler(async ({ data, context }) => {
    return await context.callsAdminRepo.create(data)
  })

export const updateCall = createServerFn()
  .middleware([withAdminCallsRepo])
  .inputValidator(
    z.object({
      id: z.number(),
      data: zodCallNoId
        .omit({ createdAt: true, updatedAt: true, archivedAt: true })
        .partial(),
    }),
  )
  .handler(async ({ data, context }) => {
    return await context.callsAdminRepo.update(data.id, data.data)
  })

export const archiveCall = createServerFn()
  .middleware([withAdminCallsRepo])
  .inputValidator(
    z.object({
      id: z.number(),
      unarchive: z.boolean().default(false),
    }),
  )
  .handler(async ({ data, context }) => {
    return await context.callsAdminRepo.update(data.id, {
      archivedAt: data.unarchive ? null : new Date(),
    })
  })
