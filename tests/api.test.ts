import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'
import * as schema from '../packages/db/schema'
import { makeApp } from '../apps/api/src/app'
const origin='http://127.0.0.1:5173'
const client=new PGlite()
const db=drizzle(client,{schema})
const app=makeApp(db)
const headers={'Content-Type':'application/json','Origin':origin}
let first='',second=''
async function signup(email:string){const r=await app.request('/api/auth/sign-up/email',{method:'POST',headers,body:JSON.stringify({name:'Test User',email,password:'test-password-123'})});expect(r.status).toBe(200);return r.headers.get('set-cookie')!.split(';')[0]}
describe('authenticated API',()=>{
 beforeAll(async()=>{await migrate(db,{migrationsFolder:'packages/db/migrations'});first=await signup('first@example.test');second=await signup('second@example.test')},60000)
 afterAll(async()=>{await client.close()})
 it('requires a session',async()=>{expect((await app.request('/api/bills')).status).toBe(401)})
 it('creates a bill and isolates it from other users',async()=>{const create=await app.request('/api/bills',{method:'POST',headers:{...headers,Cookie:first},body:JSON.stringify({provider:'Example',type:'Credit card',reference:'1234',dueDate:'2027-01-01',amountPaise:12345})});expect(create.status).toBe(201);const bill=await create.json();const own=await app.request('/api/bills',{headers:{Cookie:first}});expect(await own.json()).toHaveLength(1);const other=await app.request('/api/bills',{headers:{Cookie:second}});expect(await other.json()).toHaveLength(0);const deletion=await app.request(`/api/bills/${bill.id}`,{method:'DELETE',headers:{Origin:origin,Cookie:second}});expect(deletion.status).toBe(404)})
 it('rejects invalid amounts and cross-origin writes',async()=>{const invalid=await app.request('/api/bills',{method:'POST',headers:{...headers,Cookie:first},body:JSON.stringify({provider:'X',type:'Card',reference:'',dueDate:'2027-01-01',amountPaise:-1})});expect(invalid.status).toBe(400);const csrf=await app.request('/api/bills',{method:'POST',headers:{...headers,Origin:'https://other.example',Cookie:first},body:'{}'});expect(csrf.status).toBe(403)})
 it('flags likely duplicates and keeps simulated payments idempotent',async()=>{const payload={provider:'Example',type:'Credit card',reference:'1234',dueDate:'2027-01-01',amountPaise:12345};const duplicate=await app.request('/api/bills',{method:'POST',headers:{...headers,Cookie:first},body:JSON.stringify(payload)});expect(duplicate.status).toBe(409);const list=await (await app.request('/api/bills',{headers:{Cookie:first}})).json();const key=crypto.randomUUID();const body=JSON.stringify({billId:list[0].id,idempotencyKey:key});const one=await app.request('/api/payments',{method:'POST',headers:{...headers,Cookie:first},body});const two=await app.request('/api/payments',{method:'POST',headers:{...headers,Cookie:first},body});expect(one.status).toBe(201);expect(two.status).toBe(200);expect((await one.json()).id).toBe((await two.json()).id);const records=await (await app.request('/api/payments',{headers:{Cookie:first}})).json();expect(records).toHaveLength(1);expect(records[0].mode).toBe('simulation');expect(records[0].status).toBe('simulated_success');const bills=await (await app.request('/api/bills',{headers:{Cookie:first}})).json();expect(bills[0].status).toBe('upcoming')})
})
