"use client";

import React from "react";
import type { AdminMintDepositItem, AdminDepositReviewCardProps, DepositStatus } from "./types";
import { ReviewActionsPanel } from "./ReviewActionsPanel";
import { MintPanel } from "./MintPanel";

// Re-export types for consumers that import them from this file
export type { AdminMintDepositItem, DepositStatus };
// Backwards-compatible alias
export type { AdminMintDepositItem as AdminDepositItem };

function statusBadgeClass(status: DepositStatus): string {
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

function statusLabel(status: DepositStatus): string {
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

function fmt(n: number, decimals = 2): string {
  return Number.isFinite(n) ? n.toFixed(decimals) : "0.00";
}

function formatDecimalString(value: string, maxDecimals = 6): string {
  if (!value) return "0";
  const [intPart, decPart = ""] = value.trim().split(".");
  if (maxDecimals <= 0 || decPart.length === 0) return intPart || "0";
  const trimmed = decPart.slice(0, maxDecimals);
  return trimmed ? `${intPart || "0"}.${trimmed}` : intPart || "0";
}

export function AdminDepositReviewCard({
  item,
  actingId,
  onApprove,
  onReject,
  onOpenCorrection,
  onProposeMint,
  onPreview,
  onCopy,
}: AdminDepositReviewCardProps) {
  const total = Number(item.totalAmount);
  const currencyLabel = item.currency === "BOB" ? "Bs" : "S/";
  const created = new Date(item.createdAt).toLocaleString();

  const isMinted = item.status === "MINTED" || !!item.mintedAt || !!item.mintTxHash;

  const canApprove =
    item.status === "PROOF_SUBMITTED" &&
    !!item.proofUrl &&
    !(item.currency === "PEN" && item.isRateExpired) &&
    !isMinted;

  const canReject =
    !isMinted &&
    (item.status === "PROOF_SUBMITTED" || item.status === "NEED_CORRECTION");

  const canRequestCorrection =
    item.status === "PROOF_SUBMITTED" && !!item.proofUrl && !isMinted;

  const canPropose =
    item.status === "APPROVED" &&
    !!item.user.walletAddress &&
    !item.safeTxHash;

  return (
    <div className="rounded-2xl border border-gray-700 bg-[#0a1628] p-5">
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">

        {/* ── Sección izquierda ── */}
        <div className="flex-1">

          {/* Header */}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(item.status)}`}>
              {statusLabel(item.status)}
            </span>

            {item.currency === "PEN" && item.isRateExpired && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold border border-red-500/30 bg-red-500/10 text-red-200">
                Rate vencido
              </span>
            )}

            <p className="text-sm text-gray-200">
              <span className="text-gray-400">Ref:</span>{" "}
              <span className="font-semibold text-teal-200">{item.referenceCode}</span>
            </p>
            <p className="text-xs text-gray-500">{created}</p>

            <button
              type="button"
              onClick={() => onCopy("Referencia", item.referenceCode)}
              className="ml-auto xl:ml-0 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700 bg-[#071225] text-gray-200 hover:bg-[#152b47]"
            >
              Copiar referencia
            </button>
          </div>

          {item.currency === "PEN" && item.isRateExpired && (
            <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
              <p className="text-xs text-red-200">
                Este deposito no deberia aprobarse: el tipo de cambio expiro.
              </p>
            </div>
          )}

          {/* Montos + usuario */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
              <p className="text-xs text-gray-400">Total a pagar</p>
              <p className="text-base font-semibold text-white">
                {fmt(total)} {currencyLabel}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
              <p className="text-xs text-gray-400">Recibe (estimado)</p>
              <p className="text-base font-semibold text-teal-300">
                {formatDecimalString(item.expectedBOBH, 6)} BOBH
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
              <p className="text-xs text-gray-400">Usuario</p>
              <p className="text-sm font-semibold text-white">
                {item.user.firstName} {item.user.lastName}
              </p>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-gray-400 break-all">{item.user.email}</p>
                <button
                  type="button"
                  onClick={() => onCopy("Email", item.user.email)}
                  className="px-2 py-1 rounded-md text-xs border border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>

          {/* País / KYC / Wallet + Comprobante */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
              <p className="text-xs text-gray-400">Pais / KYC / Wallet</p>
              <p className="text-sm text-gray-200"><span className="text-gray-400">Pais:</span> {item.user.country}</p>
              <p className="text-sm text-gray-200"><span className="text-gray-400">KYC:</span> {item.user.kycStatus}</p>
              <p className="text-sm text-gray-200 break-all">
                <span className="text-gray-400">Wallet:</span>{" "}
                {item.user.walletAddress ?? "Sin wallet"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
              <p className="text-xs text-gray-400">Comprobante</p>
              {!item.proofUrl ? (
                <p className="text-sm text-gray-300 mt-1">Sin comprobante.</p>
              ) : (
                <>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onPreview(item)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700 bg-[#0a1628] text-teal-300 hover:bg-[#152b47]"
                    >
                      Vista previa
                    </button>
                    {item.proofFileName && (
                      <span className="text-xs text-gray-500">
                        {item.proofFileName}
                        {item.proofMimeType ? ` - ${item.proofMimeType}` : ""}
                      </span>
                    )}
                  </div>
                  {item.proofUploadedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Subido: {new Date(item.proofUploadedAt).toLocaleString()}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Nota de revisión */}
          {item.status === "NEED_CORRECTION" && item.reviewNote && (
            <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
              <p className="text-xs font-semibold text-amber-300">Observado</p>
              <p className="mt-1 text-sm text-amber-100">{item.reviewNote}</p>
              {item.reviewedAt && (
                <p className="mt-2 text-[11px] text-amber-200/70">
                  {new Date(item.reviewedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Rate PEN */}
          {item.currency === "PEN" && item.rateUsed && item.rateExpiresAt && (
            <div className="mt-3 rounded-xl border border-gray-800 bg-[#071225] p-3">
              <p className="text-xs text-gray-400">
                Rate fijado:{" "}
                <span className="text-gray-200 font-semibold">
                  1 PEN = {Number(item.rateUsed).toFixed(4)} BOB
                </span>{" "}
                {item.rateSource && (
                  <span className="text-gray-500">({item.rateSource})</span>
                )}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Valido hasta:{" "}
                <span className="text-gray-200">
                  {new Date(item.rateExpiresAt).toLocaleString()}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* ── Sección derecha: paneles de acción ── */}
        <div className="w-full xl:w-67.5">
          <ReviewActionsPanel
            item={item}
            actingId={actingId}
            canApprove={canApprove}
            canReject={canReject}
            canRequestCorrection={canRequestCorrection}
            onApprove={onApprove}
            onReject={onReject}
            onOpenCorrection={onOpenCorrection}
          />

          <MintPanel
            item={item}
            actingId={actingId}
            canPropose={canPropose}
            isMinted={isMinted}
            onProposeMint={onProposeMint}
          />
        </div>

      </div>
    </div>
  );
}
