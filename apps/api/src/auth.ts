import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import * as schema from '../../../packages/db/schema'
import type { Database } from './db'
export function makeAuth(db:Database) {
 const secret = process.env.BETTER_AUTH_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'local-development-only-change-this-secret-12345')
 if (!secret) throw new Error('BETTER_AUTH_SECRET is required in production')
 return betterAuth({database:drizzleAdapter(db,{provider:'pg',schema}),secret,baseURL:process.env.BETTER_AUTH_URL || 'http://127.0.0.1:5173',trustedOrigins:[process.env.APP_ORIGIN || 'http://127.0.0.1:5173'],emailAndPassword:{enabled:true,minPasswordLength:10},rateLimit:{enabled:true,window:60,max:30}})
}
