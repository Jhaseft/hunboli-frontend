"use client";

import React from "react";

export type DepositStatus =
  | "PENDING"
  | "PROOF_SUBMITTED"
  | "NEED_CORRECTION"
  | "RATE_EXPIRED"
  | "APPROVED"
  | "REJECTED"
  | "PROCESSED"
  | "FAILED"
  | "MINTED";

export type FiatCurrency = "BOB" | "PEN";

export type AdminDepositItem = {
  id: string;
  referenceCode: string;
  currency: FiatCurrency;
  status: DepositStatus;
  isRateExpired: boolean;

  amount: string;
  totalAmount: string;
  expectedBOBH: string;

  rateUsed: string | null;
  rateSource: string | null;
  rateQuotedAt: string | null;
  rateExpiresAt: string | null;

  proofUrl: string | null;
  proofUploadedAt: string | null;
  proofFileName: string | null;
  proofMimeType: string | null;

  reviewNote: string | null;
  reviewedById: string | null;
  reviewedAt: string | null;

  validatedById: string | null;
  validatedAt: string | null;

  safeTxHash: string | null;
  safeProposedAt: string | null;

  mintTxHash: string | null;
  mintedAt: string | null;

  createdAt: string;

  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    country: "BOLIVIA" | "PERU";
    kycStatus: string;
    walletAddress: string | null;
  };
};

type Props = {
  item: AdminDepositItem;
  actingId: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onOpenCorrection: (item: AdminDepositItem) => void;
  onProposeMint: (id: string) => void;
  onPreview: (item: AdminDepositItem) => void;
  onCopy: (label: string, value: string) => void;
};

function statusBadgeClass(status: DepositStatus) {
  switch (status) {
    case "PENDING":
      return "border border-amber-500/30 bg-amber-500/10 text-amber-200";
    case "PROOF_SUBMITTED":
      return "border border-cyan-500/30 bg-cyan-500/10 text-cyan-200";
    case "NEED_CORRECTION":
      return "border border-amber-500/30 bg-amber-500/10 text-amber-200";
    case "APPROVED":
      return "border border-teal-500/30 bg-teal-500/10 text-teal-200";
    case "MINTED":
      return "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
    case "REJECTED":
      return "border border-red-500/30 bg-red-500/10 text-red-200";
    case "RATE_EXPIRED":
      return "border border-gray-500/30 bg-gray-500/10 text-gray-200";
    default:
      return "border border-gray-500/30 bg-gray-500/10 text-gray-200";
  }
}

function statusLabel(status: DepositStatus) {
  switch (status) {
    case "PENDING":
      return "Pendiente";
    case "PROOF_SUBMITTED":
      return "Comprobante enviado";
    case "NEED_CORRECTION":
      return "Requiere correccion";
    case "RATE_EXPIRED":
      return "Rate expirado";
    case "APPROVED":
      return "Aprobado";
    case "REJECTED":
      return "Rechazado";
    case "MINTED":
      return "Mint realizado";
    default:
      return status;
  }
}

function fmt(n: number, decimals = 2) {
  return Number.isFinite(n) ? n.toFixed(decimals) : "0.00";
}

function formatDecimalString(value: string, maxDecimals = 6) {
  if (!value) return "0";
  const normalized = value.trim();
  const [intPart, decPart = ""] = normalized.split(".");
  if (maxDecimals <= 0 || decPart.length === 0) return intPart || "0";
  const trimmed = decPart.slice(0, maxDecimals);
  return trimmed ? `${intPart || "0"}.${trimmed}` : intPart || "0";
}

function isImageMime(mime?: string | null) {
  if (!mime) return false;
  return ["image/jpeg", "image/png", "image/webp"].includes(mime);
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
}: Props) {
  const total = Number(item.totalAmount);
  const currencyLabel = item.currency === "BOB" ? "Bs" : "S/";
  const created = new Date(item.createdAt).toLocaleString();

  const isMinted =
    item.status === "MINTED" || !!item.mintedAt || !!item.mintTxHash;

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
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(
                item.status
              )}`}
            >
              {statusLabel(item.status)}
            </span>

            {item.currency === "PEN" && item.isRateExpired && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold border border-red-500/30 bg-red-500/10 text-red-200">
                Rate vencido
              </span>
            )}

            <p className="text-sm text-gray-200">
              <span className="text-gray-400">Ref:</span>{" "}
              <span className="font-semibold text-teal-200">
                {item.referenceCode}
              </span>
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
                <p className="text-xs text-gray-400 break-all">
                  {item.user.email}
                </p>
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

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
              <p className="text-xs text-gray-400">Pais / KYC / Wallet</p>
              <p className="text-sm text-gray-200">
                <span className="text-gray-400">Pais:</span> {item.user.country}
              </p>
              <p className="text-sm text-gray-200">
                <span className="text-gray-400">KYC:</span> {item.user.kycStatus}
              </p>
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
                    {item.proofFileName ? (
                      <span className="text-xs text-gray-500">
                        {item.proofFileName}
                        {item.proofMimeType ? ` - ${item.proofMimeType}` : ""}
                      </span>
                    ) : null}
                  </div>

                  {item.proofUploadedAt ? (
                    <p className="text-xs text-gray-500 mt-2">
                      Subido: {new Date(item.proofUploadedAt).toLocaleString()}
                    </p>
                  ) : null}

                  
                </>
              )}
            </div>
          </div>

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

          {item.currency === "PEN" && item.rateUsed && item.rateExpiresAt && (
            <div className="mt-3 rounded-xl border border-gray-800 bg-[#071225] p-3">
              <p className="text-xs text-gray-400">
                Rate fijado:{" "}
                <span className="text-gray-200 font-semibold">
                  1 PEN = {Number(item.rateUsed).toFixed(4)} BOB
                </span>{" "}
                {item.rateSource ? (
                  <span className="text-gray-500">({item.rateSource})</span>
                ) : null}
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

        <div className="w-full xl:w-67.5">
          <div className="rounded-2xl border border-gray-800 bg-[#071225] p-4">
            <p className="text-sm font-semibold text-white mb-3">Revision</p>

            <button
              type="button"
              onClick={() => onApprove(item.id)}
              disabled={actingId === item.id || !canApprove}
              className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                actingId === item.id || !canApprove
                  ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                  : "bg-teal-600 text-white hover:bg-cyan-700"
              }`}
            >
              {actingId === item.id ? "Procesando..." : "Aprobar"}
            </button>

            <button
              type="button"
              onClick={() => onOpenCorrection(item)}
              disabled={actingId === item.id || !canRequestCorrection}
              className={`mt-2 w-full py-2.5 rounded-lg font-medium transition-colors ${
                actingId === item.id || !canRequestCorrection
                  ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                  : "bg-amber-600 text-white hover:bg-amber-700"
              }`}
            >
              Solicitar correccion
            </button>

            <button
              type="button"
              onClick={() => onReject(item.id)}
              disabled={actingId === item.id || !canReject}
              className={`mt-2 w-full py-2.5 rounded-lg font-medium transition-colors ${
                actingId === item.id || !canReject
                  ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {actingId === item.id ? "Procesando..." : "Rechazar"}
            </button>

            {!item.proofUrl && (
              <p className="mt-3 text-xs text-gray-500">
                Para aprobar, debe existir comprobante.
              </p>
            )}

            {item.validatedAt && (
              <p className="mt-3 text-xs text-gray-500">
                Validado: {new Date(item.validatedAt).toLocaleString()}
              </p>
            )}
          </div>

          <div className="mt-3 rounded-2xl border border-gray-800 bg-[#071225] p-4">
            <p className="text-sm font-semibold text-white mb-3">Mint</p>

            <button
              type="button"
              onClick={() => onProposeMint(item.id)}
              disabled={actingId === item.id || !canPropose}
              className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                actingId === item.id || !canPropose
                  ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                  : "bg-sky-600 text-white hover:bg-sky-700"
              }`}
            >
              {actingId === item.id ? "Procesando..." : "Proponer mint (Safe)"}
            </button>

            {!item.user.walletAddress && (
              <p className="mt-3 text-xs text-gray-500">
                El usuario no tiene wallet registrada.
              </p>
            )}

            {item.safeTxHash && (
              <div className="mt-3 rounded-xl border border-gray-800 bg-[#0a1628] p-3">
                <p className="text-xs text-gray-400">Propuesto</p>
                {item.safeProposedAt && (
                  <p className="mt-1 text-[11px] text-gray-400">
                    {new Date(item.safeProposedAt).toLocaleString()}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-200 break-all">
                  {item.safeTxHash}
                </p>
              </div>
            )}

            {isMinted && (
              <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                <p className="text-xs text-emerald-300 font-semibold">
                  Minted
                </p>
                {item.mintedAt && (
                  <p className="mt-1 text-[11px] text-emerald-200/70">
                    {new Date(item.mintedAt).toLocaleString()}
                  </p>
                )}
                {item.mintTxHash && (
                  <p className="mt-1 text-xs text-emerald-100 break-all">
                    {item.mintTxHash}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
