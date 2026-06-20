import type { DepositStatus } from "./types";

export function statusBadgeClass(status: DepositStatus): string {
  switch (status) {
    case "PENDING":         return "border border-amber-500/30 bg-amber-500/10 text-amber-200";
    case "PROOF_SUBMITTED": return "border border-cyan-500/30 bg-cyan-500/10 text-cyan-200";
    case "NEED_CORRECTION": return "border border-amber-500/30 bg-amber-500/10 text-amber-200";
    case "APPROVED":        return "border border-teal-500/30 bg-teal-500/10 text-teal-200";
    case "MINTED":          return "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
    case "REJECTED":        return "border border-red-500/30 bg-red-500/10 text-red-200";
    case "RATE_EXPIRED":    return "border border-gray-500/30 bg-gray-500/10 text-gray-200";
    default:                return "border border-gray-500/30 bg-gray-500/10 text-gray-200";
  }
}

export function statusLabel(status: DepositStatus): string {
  switch (status) {
    case "PENDING":         return "Pendiente";
    case "PROOF_SUBMITTED": return "Comprobante enviado";
    case "NEED_CORRECTION": return "Requiere correccion";
    case "RATE_EXPIRED":    return "Rate expirado";
    case "APPROVED":        return "Aprobado";
    case "REJECTED":        return "Rechazado";
    case "MINTED":          return "Mint realizado";
    default:                return status;
  }
}

export function fmt(n: number, decimals = 2): string {
  return Number.isFinite(n) ? n.toFixed(decimals) : "0.00";
}

export function formatDecimalString(value: string, maxDecimals = 6): string {
  if (!value) return "0";
  const [intPart, decPart = ""] = value.trim().split(".");
  if (maxDecimals <= 0 || decPart.length === 0) return intPart || "0";
  const trimmed = decPart.slice(0, maxDecimals);
  return trimmed ? `${intPart || "0"}.${trimmed}` : intPart || "0";
}

export function isImageMime(mime?: string | null): boolean {
  if (!mime) return false;
  return ["image/jpeg", "image/png", "image/webp"].includes(mime);
}

export function isPdfMime(mime?: string | null): boolean {
  return mime === "application/pdf";
}
