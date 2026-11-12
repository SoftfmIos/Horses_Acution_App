export function summarizeSessionCredits(ledger = []) {
  const totals = { balance: 0, credited: 0, used: 0, restored: 0, refunded: 0 };
  for (const entry of ledger) {
    totals.balance += entry.delta;
    switch (entry.reason) {
      case "package.paid":
        totals.credited += entry.delta;
        break;
      case "booking.used":
        totals.used -= entry.delta;
        break;
      case "booking.cancelled":
        totals.restored += entry.delta;
        break;
      case "package.refunded":
        totals.refunded -= entry.delta;
        break;
    }
  }
  return totals;
}
