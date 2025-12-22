import {
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  isNotNull,
  isNull,
  like,
  lte,
  type SQL,
  sql,
} from 'drizzle-orm'

import { type DB, db as dbInstance } from '@/db/drizzle'
import { calls as table } from '@/db/schema'
import {
  type CallNoId,
  type CallsFilters,
  type PaginationParams,
  type SortParams,
  zodCall,
  zodCallNoId,
} from './calls'

export class QueryRepo {
  private db: DB

  constructor(db?: DB) {
    this.db = db || dbInstance()
  }

  query = async (
    {
      filters,
      sort,
      pagination,
    }: {
      filters: CallsFilters
      sort: SortParams
      pagination: PaginationParams
    },
    { omitArchivedAt = true } = {},
  ) => {
    const where: SQL[] = []
    if (filters.search) {
      const searchWithPercent = `%${filters.search}%`
      where.push(like(table.title, sql`${searchWithPercent}`))
    }
    if (filters.type?.length) {
      where.push(inArray(table.type, filters.type))
    }
    if (filters.location?.length) {
      where.push(inArray(table.location, filters.location))
    }
    if (filters.institution?.length) {
      where.push(inArray(table.institution, filters.institution))
    }
    if (filters.createdAt?.after) {
      where.push(gte(table.createdAt, filters.createdAt.after))
    }
    if (filters.createdAt?.before) {
      where.push(lte(table.createdAt, filters.createdAt.before))
    }
    if (filters.deadline?.after) {
      where.push(gte(table.deadline, filters.deadline.after))
    }
    if (filters.deadline?.before) {
      where.push(lte(table.deadline, filters.deadline.before))
    }
    if (filters.archived !== undefined) {
      if (filters.archived) {
        where.push(isNotNull(table.archivedAt))
      } else {
        where.push(isNull(table.archivedAt))
      }
    }

    const orderDir = sort.order === 'asc' ? asc : desc
    const orderBy = (
      {
        createdAt: table.createdAt,
        deadline: table.deadline,
      } as const
    )[sort.by]

    const res = await this.db
      .select()
      .from(table)
      .where(and(...where))
      .orderBy(orderDir(orderBy))
      .limit(pagination.limit)
      .offset(pagination.offset)

    const zOut = omitArchivedAt ? zodCall.omit({ archivedAt: true }) : zodCall
    return res.map((row) => zOut.parse(row))
  }

  queryOptions = async () => {
    const typesP = this.db.selectDistinct({ opt: table.type }).from(table)
    const locationsP = this.db
      .selectDistinct({ opt: table.location })
      .from(table)
    const institutionsP = this.db
      .selectDistinct({ opt: table.institution })
      .from(table)
    const processResponse = (opts: { opt: string | null }[]): string[] =>
      opts
        .map((o) => o.opt)
        .filter((o) => o !== null)
        .filter((s) => s.length > 0)
    const [types, locations, institutions] = await Promise.all(
      [typesP, locationsP, institutionsP].map((p) => p.then(processResponse)),
    )

    return { types, locations, institutions }
  }
}

export class AdminRepo {
  private db: DB
  private queryRepo: QueryRepo
  constructor(db?: DB) {
    this.db = db || dbInstance()
    this.queryRepo = new QueryRepo(this.db)
  }

  query = async (
    params: Parameters<QueryRepo['query']>[0],
    opts?: Parameters<QueryRepo['query']>[1],
  ) => {
    return this.queryRepo.query(params, { omitArchivedAt: false, ...opts })
  }

  create = async (call: Partial<CallNoId> & Pick<CallNoId, 'title'>) => {
    const data = { ...call, createdAt: new Date(), updatedAt: new Date() }
    const parsed = zodCallNoId.parse(data)
    const res = await this.db.insert(table).values(parsed).returning()
    return zodCall.parse(res[0])
  }

  update = async (id: number, call: Partial<CallNoId>) => {
    if (Object.keys(call).length === 0) {
      throw new Error('No fields to update')
    }
    const data = { ...call, updatedAt: new Date(), createdAt: undefined }
    const res = await this.db
      .update(table)
      .set(data)
      .where(eq(table.id, id))
      .returning()
    if (!res[0]) {
      throw new Error(`Call with id ${id} not found`)
    }
    return zodCall.parse(res[0])
  }
}
