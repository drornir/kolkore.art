import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema.ts'

export type DB = ReturnType<typeof makeDB>

const globals = globalThis as unknown as { __db: DB }

function makeDB() {
  const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = process.env
  if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
    throw new Error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN')
  }
  return drizzle({
    schema,
    connection: {
      url: TURSO_DATABASE_URL,
      authToken: TURSO_AUTH_TOKEN,
    },
  })
}

export function db() {
  if (globals.__db) return globals.__db
  globals.__db = makeDB()
  return globals.__db
}
