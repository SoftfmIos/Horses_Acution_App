export function paymentStatusTone(invoice) {
  if (["void", "refund_required"].includes(invoice.status)) return "closed";
  if (invoice.status === "settled" && invoice.paid >= invoice.due)
    return "paid";
  if (invoice.status === "open" && invoice.paid > 0) return "partial";
  if (invoice.status === "open") return "pending";
  return "closed";
}
