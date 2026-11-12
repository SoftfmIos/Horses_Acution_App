export function paymentReport({
  payments,
  proformas,
  members,
  groupBy = "invoice",
  search = "",
  from = "",
  to = "",
}) {
  const invoices = new Map(proformas.map((p) => [p.id, p]));
  const users = new Map(members.map((m) => [m.id, m]));
  const needle = search.trim().toLocaleLowerCase();
  const groups = new Map();
  for (const payment of payments) {
    const invoice = invoices.get(payment.proforma_id);
    if (!invoice) continue;
    const user = users.get(invoice.member_id);
    const day = new Date(Date.parse(payment.created_at) + 3 * 3600000)
      .toISOString()
      .slice(0, 10);
    if ((from && day < from) || (to && day > to)) continue;
    if (
      needle &&
      !JSON.stringify([
        payment.reference,
        payment.external_ref,
        invoice.id,
        invoice.description,
        user?.name,
        user?.nameEn,
        user?.nameAr,
        user?.email,
      ])
        .toLocaleLowerCase()
        .includes(needle)
    )
      continue;
    const key = groupBy === "user" ? invoice.member_id : invoice.id;
    if (!groups.has(key))
      groups.set(key, {
        id: key,
        name:
          groupBy === "user"
            ? user?.name || invoice.member_id
            : invoice.description,
        rows: [],
        invoices: new Map(),
      });
    const group = groups.get(key);
    group.rows.push({ ...payment, invoice, user });
    group.invoices.set(invoice.id, invoice);
  }
  return [...groups.values()]
    .map((group) => {
      const invoices = [...group.invoices.values()];
      return {
        ...group,
        invoices,
        rows: group.rows.sort((a, b) =>
          a.created_at.localeCompare(b.created_at),
        ),
        receipts: group.rows.reduce((n, p) => n + Math.max(0, p.amount), 0),
        refunds: group.rows.reduce((n, p) => n + Math.max(0, -p.amount), 0),
        net: group.rows.reduce((n, p) => n + p.amount, 0),
        due: invoices.reduce((n, p) => n + p.due, 0),
        paid: invoices.reduce((n, p) => n + p.paid, 0),
        outstanding: invoices.reduce(
          (n, p) =>
            n +
            (["void", "refund_required"].includes(p.status)
              ? 0
              : Math.max(0, p.due - p.paid)),
          0,
        ),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
