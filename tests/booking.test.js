import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bookSession} from '../src/booking.js';
const sessions=[{id:'a',date:'2026-11-11',start:'09:00',end:'10:00',capacity:1},{id:'b',date:'2026-11-11',start:'09:30',end:'10:30',capacity:4}];
test('books a free session',()=>assert.equal(bookSession(sessions,[],'a','m','1')[0].status,'confirmed'));
test('rejects duplicate, full and overlapping bookings',()=>{const b=bookSession(sessions,[],'a','m','1');assert.throws(()=>bookSession(sessions,b,'a','m','2'),/duplicate/);assert.throws(()=>bookSession(sessions,b,'a','n','2'),/full/);assert.throws(()=>bookSession(sessions,b,'b','m','2'),/conflict/);});
test('cancelled reservations release capacity',()=>assert.equal(bookSession(sessions,[{id:'1',sessionId:'a',memberId:'m',status:'cancelled'}],'a','n','2').length,2));
