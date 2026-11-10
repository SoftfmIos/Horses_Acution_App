export function bookSession(sessions, bookings, sessionId, memberId, id) {
  const session = sessions.find(s => s.id === sessionId);
  if (!session) throw new Error('missing');
  const active = bookings.filter(b => b.status !== 'cancelled');
  if (active.some(b => b.sessionId === sessionId && b.memberId === memberId)) throw new Error('duplicate');
  if (active.filter(b => b.sessionId === sessionId).length >= session.capacity) throw new Error('full');
  if (active.some(b => { const other = sessions.find(s => s.id === b.sessionId); return b.memberId === memberId && other && other.date === session.date && other.start < session.end && session.start < other.end; })) throw new Error('conflict');
  return [...bookings, { id, sessionId, memberId, status: 'confirmed' }];
}
