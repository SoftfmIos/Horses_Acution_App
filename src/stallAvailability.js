export function stallAvailability(
  stall,
  boarding,
  startDate,
  endDate,
  excludeId = null,
) {
  if (!startDate || !endDate || startDate > endDate)
    return { occupied: 0, available: 0, valid: false };
  const rows = boarding.filter(
    (b) =>
      b.id !== excludeId &&
      b.stallId === stall.id &&
      b.status === "active" &&
      b.startDate <= endDate &&
      b.endDate >= startDate,
  );
  const boundaries = [
    startDate,
    ...rows
      .map((b) => b.startDate)
      .filter((date) => date >= startDate && date <= endDate),
  ];
  const occupied = Math.max(
    0,
    ...boundaries.map(
      (date) =>
        rows.filter((b) => b.startDate <= date && b.endDate >= date).length,
    ),
  );
  return {
    occupied,
    available:
      stall.active === false ? 0 : Math.max(0, stall.capacity - occupied),
    valid: true,
  };
}
