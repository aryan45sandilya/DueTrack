import { PGlite } from '@electric-sql/pglite'
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite'
import { migrate as migratePglite } from 'drizzle-orm/pglite/migrator'
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js'
import { migrate as migratePostgres } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import * as schema from '../../../packages/db/schema'
import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

export async function openDatabase() {
 if (process.env.DATABASE_URL) {
  const client = postgres(process.env.DATABASE_URL, { max: 10 })
  const db = drizzlePostgres(client, { schema })
  await migratePostgres(db, { migrationsFolder:'packages/db/migrations' })
  return { db, close: () => client.end() }
 }
 if (process.env.NODE_ENV === 'production') throw new Error('DATABASE_URL is required in production')
 const path = process.env.PGLITE_DIR || './.data/postgres'
 if (path !== ':memory:') await mkdir(dirname(path), {recursive:true})
 const client = new PGlite(path)
 const db = drizzlePglite(client, { schema })
 await migratePglite(db, { migrationsFolder:'packages/db/migrations' })
 return { db, close: () => client.close() }
}
export type Database = Awaited<ReturnType<typeof openDatabase>>['db']
