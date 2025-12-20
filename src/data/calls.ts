import z from 'zod'

const nullableString = z.string().nullable()
export const zodCall = z.object({
  id: z.int().min(0),
  title: z.string(),
  description: nullableString,
  type: nullableString,
  location: nullableString,
  institution: nullableString,
  requirements: z.array(z.string()).nullable(),
  deadline: z.date().nullable(),
  link: nullableString,
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  archivedAt: z.date().nullable().optional(),
})
export type Call = z.infer<typeof zodCall>
export const zodCallNoId = zodCall.omit({ id: true })
export type CallNoId = z.infer<typeof zodCallNoId>

const timeFilter = z.object({
  after: z.date().optional().catch(undefined),
  before: z.date().optional().catch(undefined),
})
export const zCallsFilters = z.object({
  search: z.string().optional().catch(undefined),
  type: z.array(z.string()).optional().catch(undefined),
  location: z.array(z.string()).optional().catch(undefined),
  institution: z.array(z.string()).optional().catch(undefined),
  createdAt: timeFilter.optional().catch(undefined),
  deadline: timeFilter.optional().catch(undefined),
  archived: z.boolean().optional().catch(undefined),
})
export type CallsFilters = z.infer<typeof zCallsFilters>

export const zSortParams = z.object({
  by: z.enum(['createdAt', 'deadline']).catch('createdAt').default('createdAt'),
  order: z.enum(['asc', 'desc']).catch('desc').default('desc'),
})
export type SortParams = z.infer<typeof zSortParams>

export const zPaginationParams = z
  .object({
    offset: z.number().min(0).catch(0).default(0),
    limit: z.number().min(1).max(200).catch(30).default(30),
  })
  .prefault({})
export type PaginationParams = z.infer<typeof zPaginationParams>

export const zodQueryParams = z
  .object({
    filters: zCallsFilters.omit({ archived: true }).default({}),
    sort: zSortParams.prefault({}),
    pagination: zPaginationParams.prefault({}),
  })
  .catch({
    filters: {},
    sort: { by: 'createdAt', order: 'desc' },
    pagination: { offset: 0, limit: 30 },
  })
export type QueryParams = z.infer<typeof zodQueryParams>

export const zodQueryParamsWithArchived = z.object({
  filters: zCallsFilters.default({}),
  sort: zSortParams.prefault({}),
  pagination: zPaginationParams.prefault({}),
})
export type QueryParamsWithArchived = z.infer<typeof zodQueryParamsWithArchived>
