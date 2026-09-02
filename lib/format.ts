export function formatPrice(amount: number) {
  return `${amount.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} TL`;
}

export function formatPriceShort(amount: number) {
  return `₺${amount.toLocaleString("tr-TR")}`;
}
