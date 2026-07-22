const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("id-ID");

export function formatIDR(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return idrFormatter.format(Number(value));
}

export function formatNumber(value, digits = 2) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(Number(value));
}

export function formatUpdatedAt(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

export function parseIDRInput(raw) {
  if (raw == null) return NaN;
  const cleaned = String(raw).replace(/[^\d]/g, "");
  if (!cleaned) return NaN;
  return Number(cleaned);
}

export { numberFormatter };
