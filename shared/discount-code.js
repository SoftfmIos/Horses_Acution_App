export const discountPrefix = (title) =>
  (
    String(title || "Offer")
      .replace(/[^a-z]/gi, "")
      .slice(0, 3)
      .toUpperCase() || "OFF"
  ).padEnd(3, "X");
export function discountCodeForForm(form, issuedCode) {
  if (issuedCode) return issuedCode;
  return (
    discountPrefix(form.titleEn || form.titleAr || form.title) +
    String(form.discountDigits ?? "000").padStart(3, "0")
  );
}
