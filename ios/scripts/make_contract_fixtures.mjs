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
 const instructor=await owner.call('/records/instructors','POST',{name:'Test Instructor',userId:auth.user.id});
 const horse=await owner.call('/records/horses','POST',{name:'Test Horse',status:'ready',ownerId:me.user.id,instructorId:instructor.id,microchip:'TEST-CHIP',birthDate:'2018-02-10',notes:'Fictional owner care notes'});
 const plan=await owner.call('/records/plans','POST',{name:'Test Lesson',amount:10000,active:true});
 const session=await owner.call('/records/classes','POST',{title:'Test Session',startsAt:'2026-11-13T10:00:00Z',endsAt:'2026-11-13T11:00:00Z',capacity:1,horseIds:[horse.id],instructor:'Test Instructor',instructorId:instructor.id,arena:'Test Arena',planId:plan.id});
 const booking=await member.call('/bookings','POST',{classId:session.id});
 await owner.call('/proformas/'+booking.proformaId+'/payment','POST',{amount:4000,reference:'TEST-REFERENCE',externalRef:'Test voucher'});
 await owner.call('/records/tasks','POST',{title:'Test Care Task',dueAt:'2026-11-13T08:00:00Z',assigneeId:auth.user.id});
 for (const [name,value] of [['member-data',await member.call('/data')],['staff-data',await owner.call('/data')],['member-auth',me]])
  writeFileSync(out+name+'.json',JSON.stringify(value,null,2)+'\n');
 const png='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
 await owner.call('/photos/horses/'+horse.id,'PUT',{mime:'image/png',content:png});
 await owner.call('/photos/instructors/'+instructor.id,'PUT',{mime:'image/png',content:png});
 await owner.call('/records/medical','POST',{horseId:horse.id,type:'Test vaccination',date:'2026-11-12T05:00:00Z',assigneeId:auth.user.id,notes:'Fictional owner medical record',restriction:false,frequencyHours:0,durationDays:0});
 await owner.call('/records/feeding','POST',{horseId:horse.id,feed:'Test hay',quantity:'2 kg',time:'07:00',durationMinutes:30,assigneeId:auth.user.id,startDate:'2026-11-12',endDate:'2026-11-14',active:true,notes:'Fictional feeding plan'});
 for(const[name,value]of [['member-horse-profile',await member.call('/horses/'+horse.id+'/profile')],['member-horse-photo',await member.call('/photos/horses/'+horse.id)],['member-instructor-photo',await member.call('/photos/instructors/'+instructor.id)]])
  writeFileSync(out+name+'.json',JSON.stringify(value,null,2)+'\n');
 const packagePlan=await owner.call('/records/plans','POST',{name:'Test five-session package',kind:'package',amount:10000,credits:5,active:true});
 const order=await member.call('/packages','POST',{planId:packagePlan.id});
 const balances={};
 const readBalance=async()=>{
  const summary=await member.call('/members/'+me.user.id+'/credits');
  const snapshot=await member.call('/data');
  return {summary,snapshot:{creditBalance:snapshot.creditBalance,creditLedger:snapshot.creditLedger,proformas:snapshot.proformas.filter(p=>p.id===order.id)}};
 };
 balances.unpaid=await readBalance();
 await owner.call('/proformas/'+order.id+'/payment','POST',{amount:4000,reference:'PACKAGE-PARTIAL',externalRef:'Test partial payment'});
 balances.partial=await readBalance();
 await owner.call('/proformas/'+order.id+'/payment','POST',{amount:6000,reference:'PACKAGE-FULL',externalRef:'Test final payment'});
 balances.paid=await readBalance();
 balances.refreshed=await readBalance();
 writeFileSync(out+'member-package-balances.json',JSON.stringify(balances,null,2)+'\n');
 console.log('Generated fictional fixtures for native backend decoding tests.');
} finally {server.close();db.close();}
