"use client";

import React, { useEffect, useState } from "react";
import type { AdminDepositItem, DepositStatus } from "./AdminDepositReviewCard";

type Props = {
  open: boolean;
  item: AdminDepositItem | null;
  actingId: string | null;
  submittingCorrection: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRequestCorrection: (id: string, note: string) => void;
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

function isPdfMime(mime?: string | null) {
  return mime === "application/pdf";
}

export function DepositReviewDrawer({
  open,
  item,
  actingId,
  submittingCorrection,
  onClose,
  onApprove,
  onReject,
  onRequestCorrection,
  onProposeMint,
  onPreview,
  onCopy,
}: Props) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (item) setNote(item.reviewNote ?? "");
    else setNote("");
  }, [item?.id, item?.reviewNote]);

  if (!open || !item) return null;

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

  const acting = actingId === item.id;
  const proofDate = item.proofUploadedAt ?? item.createdAt;
  const showImageThumb = !!item.proofUrl && isImageMime(item.proofMimeType);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 z-50" onClick={onClose}>
        <div
          className="mx-auto w-full max-w-2xl rounded-t-2xl border border-white/10 bg-[#0f1e33] shadow-xl"
          role="dialog"
          aria-modal="true"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div>
                <p className="text-white font-semibold">Deposito / Mint</p>
                <p className="text-xs text-gray-400">
                  Ref:{" "}
                  <span className="text-teal-300 font-semibold">
                    {item.referenceCode}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onCopy("Referencia", item.referenceCode)}
                  className="px-3 py-2 rounded-lg text-xs border border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
                >
                  Copiar ref
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 rounded-lg text-sm border border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
                  aria-label="Cerrar"
                >
                  X
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-6">
              <div className="mt-4 rounded-xl border border-gray-800 bg-[#071225] p-3">
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(
                      item.status
                    )}`}
                  >
                    {statusLabel(item.status)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {proofDate ? new Date(proofDate).toLocaleString() : "—"}
                  </span>
                </div>

                {item.currency === "PEN" && item.isRateExpired && (
                  <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                    <p className="text-xs text-red-200">
                      Rate vencido: no aprobar.
                    </p>
                  </div>
                )}

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-gray-800 bg-[#0a1628] p-2">
                    <p className="text-[11px] text-gray-400">Total a pagar</p>
                    <p className="text-sm font-semibold text-white">
                      {fmt(Number(item.totalAmount))}{" "}
                      {item.currency === "BOB" ? "Bs" : "S/"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-800 bg-[#0a1628] p-2">
                    <p className="text-[11px] text-gray-400">Recibe</p>
                    <p className="text-sm font-semibold text-teal-300">
                      {formatDecimalString(item.expectedBOBH, 6)} BOBH
                    </p>
                  </div>
                </div>

                {item.currency === "PEN" && item.rateUsed && item.rateExpiresAt && (
                  <p className="mt-2 text-xs text-gray-400">
                    Rate:{" "}
                    <span className="text-gray-200">
                      1 PEN = {Number(item.rateUsed).toFixed(4)} BOB
                    </span>
                    <br />
                    Vence:{" "}
                    <span className="text-gray-200">
                      {new Date(item.rateExpiresAt).toLocaleString()}
                    </span>
                  </p>
                )}
              </div>

              <div className="mt-3 rounded-xl border border-gray-800 bg-[#071225] p-3">
                <p className="text-xs text-gray-400">Usuario</p>
                <p className="text-sm font-semibold text-white">
                  {item.user.firstName} {item.user.lastName}
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="text-xs text-gray-400 break-all">
                    {item.user.email}
                  </p>
                  <button
                    type="button"
                    onClick={() => onCopy("Email", item.user.email)}
                    className="shrink-0 px-2 py-1 rounded-md text-xs border border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-gray-800 bg-[#071225] p-3">
                <p className="text-xs text-gray-400">Comprobante</p>
                {!item.proofUrl ? (
                  <p className="text-xs text-gray-500 mt-1">Sin comprobante.</p>
                ) : (
                  <>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onPreview(item)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700 bg-[#0a1628] text-teal-300 hover:bg-[#152b47]"
                      >
                        Ver grande
                      </button>
                      <a
                        href={item.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
                      >
                        Abrir
                      </a>
                      {item.proofFileName ? (
                        <span className="text-xs text-gray-500">
                          {item.proofFileName}
                          {item.proofMimeType ? ` - ${item.proofMimeType}` : ""}
                        </span>
                      ) : null}
                    </div>

                    {item.proofUploadedAt ? (
                      <p className="text-xs text-gray-500 mt-2">
                        Subido:{" "}
                        {new Date(item.proofUploadedAt).toLocaleString()}
                      </p>
                    ) : null}

                    {showImageThumb && (
                      <button
                        type="button"
                        onClick={() => onPreview(item)}
                        className="mt-3 w-full text-left"
                        title="Abrir vista previa"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.proofUrl}
                          alt="Comprobante"
                          loading="lazy"
                          className="w-full max-h-40 object-cover rounded-lg border border-gray-800 bg-[#0a1628]"
                        />
                      </button>
                    )}

                    {isPdfMime(item.proofMimeType) && (
                      <div className="mt-3 rounded-lg border border-gray-800 bg-[#0a1628] p-3">
                        <p className="text-xs text-gray-400">PDF adjunto</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Usa &quot;Ver grande&quot; para previsualizar.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="mt-3 rounded-xl border border-gray-800 bg-[#071225] p-3">
                <p className="text-xs text-gray-400">Datos</p>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="text-xs text-gray-300">
                    <span className="text-gray-500">Pais:</span>{" "}
                    {item.user.country}
                  </div>
                  <div className="text-xs text-gray-300">
                    <span className="text-gray-500">KYC:</span>{" "}
                    {item.user.kycStatus}
                  </div>
                  <div className="text-xs text-gray-300 break-all">
                    <span className="text-gray-500">Wallet:</span>{" "}
                    {item.user.walletAddress ?? "Sin wallet"}
                  </div>
                  {item.validatedAt && (
                    <div className="text-xs text-gray-300">
                      <span className="text-gray-500">Validado:</span>{" "}
                      {new Date(item.validatedAt).toLocaleString()}
                    </div>
                  )}
                  {item.safeTxHash && (
                    <div className="text-xs text-gray-300 break-all">
                      <span className="text-gray-500">Safe Tx:</span>{" "}
                      {item.safeTxHash}
                    </div>
                  )}
                  {item.mintTxHash && (
                    <div className="text-xs text-gray-300 break-all">
                      <span className="text-gray-500">Mint Tx:</span>{" "}
                      {item.mintTxHash}
                    </div>
                  )}
                  {item.mintedAt && (
                    <div className="text-xs text-gray-300">
                      <span className="text-gray-500">Minted:</span>{" "}
                      {new Date(item.mintedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {canRequestCorrection && (
                <div className="mt-3 rounded-xl border border-gray-800 bg-[#071225] p-3">
                  <p className="text-xs text-gray-400">Solicitar correccion</p>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-gray-800 bg-[#0B1B34] p-2 text-sm text-white outline-none focus:border-amber-500/60"
                    placeholder="Ej: No se ve el monto ni la fecha."
                  />
                </div>
              )}
            </div>

            <div className="border-t border-gray-800 bg-[#0a1628] px-4 py-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onApprove(item.id)}
                  disabled={acting || !canApprove}
                  className={`py-2.5 rounded-lg font-medium transition-colors ${
                    acting || !canApprove
                      ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                      : "bg-teal-600 text-white hover:bg-cyan-700"
                  }`}
                >
                  {acting ? "Procesando..." : "Aprobar"}
                </button>
                <button
                  type="button"
                  onClick={() => onReject(item.id)}
                  disabled={acting || !canReject}
                  className={`py-2.5 rounded-lg font-medium transition-colors ${
                    acting || !canReject
                      ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {acting ? "Procesando..." : "Rechazar"}
                </button>
              </div>

              {canRequestCorrection && (
                <button
                  type="button"
                  onClick={() => onRequestCorrection(item.id, note)}
                  disabled={
                    acting ||
                    submittingCorrection ||
                    note.trim().length < 5 ||
                    !canRequestCorrection
                  }
                  className={`mt-2 w-full py-2.5 rounded-lg font-medium transition-colors ${
                    acting ||
                    submittingCorrection ||
                    note.trim().length < 5 ||
                    !canRequestCorrection
                      ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                      : "bg-amber-600 text-white hover:bg-amber-700"
                  }`}
                >
                  {submittingCorrection ? "Enviando..." : "Solicitar correccion"}
                </button>
              )}

              <button
                type="button"
                onClick={() => onProposeMint(item.id)}
                disabled={acting || !canPropose}
                className={`mt-2 w-full py-2.5 rounded-lg font-medium transition-colors ${
                  acting || !canPropose
                    ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                    : "bg-sky-600 text-white hover:bg-sky-700"
                }`}
              >
                {acting ? "Procesando..." : "Proponer mint (Safe)"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
