import { describe, it, expect } from 'vitest'
import { dueWithin, duplicateCandidate, canTransition, type Bill } from '../packages/shared/finance'
const bill:Bill={id:'1',provider:'Example',type:'BNPL',reference:'1234',dueDate:'2026-11-20',amountPaise:10000,status:'upcoming',source:'Demo',outstandingPaise:10000}
describe('financial rules',()=>{it('filters by inclusive dates and excludes paid bills',()=>{expect(dueWithin([bill,{...bill,id:'2',status:'paid'}],'2026-11-19',1)).toHaveLength(1)});it('does not merge without an account reference',()=>{expect(duplicateCandidate({...bill,reference:''},{...bill,reference:''})).toBe(false)});it('does not reopen settled bills',()=>{expect(canTransition('paid','upcoming')).toBe(false)})})
