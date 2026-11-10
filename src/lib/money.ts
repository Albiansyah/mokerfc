// ponytail: Indonesian Rupiah currency formatter using standard Intl.
export function formatRupiah(amount: number | null | undefined): string {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "Rp0";
  }
  const formatted = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `Rp${formatted}`;
}

export function formatShortRupiah(amount: number | null | undefined): string {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "0";
  }
  if (amount >= 1000) {
    const thousands = Math.round(amount / 1000);
    return `${thousands}rb`;
  }
  return String(amount);
}
