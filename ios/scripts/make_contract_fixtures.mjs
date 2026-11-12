// Generate fictional member/staff fixtures against the real backend, never production.
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { openDatabase } from '../../server/db.js';
import { createApp } from '../../server/app.js';
const db = openDatabase(':memory:');
const app = createApp(db, { clock: () => new Date('2026-11-12T07:00:00Z') });
const server = app.listen(0, '127.0.0.1');
await new Promise(resolve => server.once('listening', resolve));
const base = 'http://127.0.0.1:' + server.address().port;
function client() {
  let cookie = '', stable = '';
  return {
    async call(path, method = 'GET', body) {
      const response = await fetch(base + '/api' + path, {method,
        headers: {Origin:base,'Content-Type':'application/json','X-Requested-With':'RiyadhAcademy',Cookie:cookie,'X-Stable-Id':stable},
        ...(body ? {body:JSON.stringify(body)} : {}),
      });
      const setCookie = response.headers.get('set-cookie');
      if (setCookie) cookie = setCookie.split(';')[0];
      const data = await response.json();
      if (!response.ok) throw new Error(path + ': ' + JSON.stringify(data));
      if (path === '/auth/me') stable = data.stables[0].id;
      return data;
    }
  };
}
const out=fileURLToPath(new URL('../RiyadhPoloHillsTests/Fixtures/',import.meta.url));
mkdirSync(out,{recursive:true});
try {
 const owner=client(),member=client();
 await owner.call('/auth/register','POST',{name:'Test Manager',email:'manager@example.com',password:'Test-only-password',stableName:'Test Academy'});
 const auth=await owner.call('/auth/me');
 const invite=await owner.call('/invites','POST');
 await member.call('/auth/register','POST',{name:'Test Rider',email:'rider@example.com',password:'Test-only-password',invite:invite.code});
 const me=await member.call('/auth/me');
 const horse=await owner.call('/records/horses','POST',{name:'Test Horse',status:'ready',ownerId:me.user.id});
 const plan=await owner.call('/records/plans','POST',{name:'Test Lesson',amount:10000,active:true});
 const session=await owner.call('/records/classes','POST',{title:'Test Session',startsAt:'2026-11-13T10:00:00Z',endsAt:'2026-11-13T11:00:00Z',capacity:1,horseIds:[horse.id],instructor:'Test Instructor',arena:'Test Arena',planId:plan.id});
 const booking=await member.call('/bookings','POST',{classId:session.id});
 await owner.call('/proformas/'+booking.proformaId+'/payment','POST',{amount:4000,reference:'TEST-REFERENCE',externalRef:'Test voucher'});
 await owner.call('/records/tasks','POST',{title:'Test Care Task',dueAt:'2026-11-13T08:00:00Z',assigneeId:auth.user.id});
 for (const [name,value] of [['member-data',await member.call('/data')],['staff-data',await owner.call('/data')],['member-auth',me]])
  writeFileSync(out+name+'.json',JSON.stringify(value,null,2)+'\n');
 console.log('Generated fictional fixtures for native backend decoding tests.');
} finally {server.close();db.close();}
