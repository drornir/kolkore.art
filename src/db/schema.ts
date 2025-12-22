import { sql } from 'drizzle-orm'
import * as d from 'drizzle-orm/sqlite-core'

export * from './auth-schema.ts'

export const calls = d.sqliteTable(
  'calls',
  {
    id: d.integer().primaryKey({ autoIncrement: true }),
    title: d.text().notNull(),
    type: d.text(),
    location: d.text(),
    institution: d.text(),
    description: d.text(),
    requirements: d.text({ mode: 'json' }).$type<string[]>(),
    deadline: d.integer({ mode: 'timestamp' }),
    link: d.text(),
    createdAt: d
      .integer({ mode: 'timestamp' })
      .default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: d
      .integer({ mode: 'timestamp' })
      .default(sql`(CURRENT_TIMESTAMP)`),
    archivedAt: d.integer({ mode: 'timestamp' }),
  },
  (t) => {
    const locationFilters = [t.location, t.institution]
    const typedFilters = [t.type, ...locationFilters]
    return [
      d.index('createdAt_idx').on(t.createdAt, ...locationFilters),
      d.index('createdAt_typed_idx').on(t.createdAt, ...typedFilters),
      d.index('deadline_idx').on(t.deadline, ...locationFilters),
      d.index('deadline_typed_idx').on(t.deadline, ...typedFilters),
      d.index('archivedAt_idx').on(t.archivedAt),
    ]
  },
)
