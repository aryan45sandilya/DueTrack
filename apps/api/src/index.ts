import { serve } from '@hono/node-server'
import { openDatabase } from './db'
import { makeApp } from './app'
const {db}=await openDatabase()
const port=Number(process.env.API_PORT||3001)
serve({fetch:makeApp(db).fetch,port,hostname:'127.0.0.1'},()=>console.log(`Dueform API listening on http://127.0.0.1:${port}`))
