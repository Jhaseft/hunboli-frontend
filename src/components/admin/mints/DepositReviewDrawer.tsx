"use client";

import React, { useEffect, useState } from "react";
import type { AdminMintDepositItem } from "./types";
import { statusBadgeClass, statusLabel, fmt, formatDecimalString } from "./mintUtils";
import { DrawerProofSection } from "./DrawerProofSection";
import { DrawerFooterActions } from "./DrawerFooterActions";

type Props = {
  open: boolean;
  item: AdminMintDepositItem | null;
  actingId: string | null;
  submittingCorrection: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRequestCorrection: (id: string, note: string) => void;
  onProposeMint: (id: string) => void;
  onPreview: (item: AdminMintDepositItem) => void;
  onCopy: (label: string, value: string) => void;
};

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
    item.status === "APPROVED" && !!item.user.walletAddress && !item.safeTxHash;

  const proofDate = item.proofUploadedAt ?? item.createdAt;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 z-50" onClick={onClose}>
        <div
          className="mx-auto w-full max-w-2xl rounded-t-2xl border border-white/10 bg-[#0f1e33] shadow-xl"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col max-h-[85vh]">

            {/* Header */}
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

            {/* Cuerpo scrollable */}
            <div className="flex-1 overflow-y-auto px-4 pb-6">

              {/* Estado + montos */}
              <div className="mt-4 rounded-xl border border-gray-800 bg-[#071225] p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(item.status)}`}>
                    {statusLabel(item.status)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {proofDate ? new Date(proofDate).toLocaleString() : "—"}
                  </span>
                </div>

                {item.currency === "PEN" && item.isRateExpired && (
                  <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                    <p className="text-xs text-red-200">Rate vencido: no aprobar.</p>
                  </div>
                )}

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-gray-800 bg-[#0a1628] p-2">
                    <p className="text-[11px] text-gray-400">Total a pagar</p>
                    <p className="text-sm font-semibold text-white">
                      {fmt(Number(item.totalAmount))} {item.currency === "BOB" ? "Bs" : "S/"}
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

              {/* Usuario */}
              <div className="mt-3 rounded-xl border border-gray-800 bg-[#071225] p-3">
                <p className="text-xs text-gray-400">Usuario</p>
                <p className="text-sm font-semibold text-white">
                  {item.user.firstName} {item.user.lastName}
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="text-xs text-gray-400 break-all">{item.user.email}</p>
                  <button
                    type="button"
                    onClick={() => onCopy("Email", item.user.email)}
                    className="shrink-0 px-2 py-1 rounded-md text-xs border border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              {/* Comprobante */}
              <DrawerProofSection item={item} onPreview={onPreview} />

              {/* Datos extra */}
              <div className="mt-3 rounded-xl border border-gray-800 bg-[#071225] p-3">
                <p className="text-xs text-gray-400">Datos</p>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="text-xs text-gray-300"><span className="text-gray-500">Pais:</span> {item.user.country}</div>
                  <div className="text-xs text-gray-300"><span className="text-gray-500">KYC:</span> {item.user.kycStatus}</div>
                  <div className="text-xs text-gray-300 break-all">
                    <span className="text-gray-500">Wallet:</span> {item.user.walletAddress ?? "Sin wallet"}
                  </div>
                  {item.validatedAt && (
                    <div className="text-xs text-gray-300">
                      <span className="text-gray-500">Validado:</span> {new Date(item.validatedAt).toLocaleString()}
                    </div>
                  )}
                  {item.safeTxHash && (
                    <div className="text-xs text-gray-300 break-all">
                      <span className="text-gray-500">Safe Tx:</span> {item.safeTxHash}
                    </div>
                  )}
                  {item.mintTxHash && (
                    <div className="text-xs text-gray-300 break-all">
                      <span className="text-gray-500">Mint Tx:</span> {item.mintTxHash}
                    </div>
                  )}
                  {item.mintedAt && (
                    <div className="text-xs text-gray-300">
                      <span className="text-gray-500">Minted:</span> {new Date(item.mintedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Textarea corrección */}
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

            {/* Footer con acciones */}
            <DrawerFooterActions
              item={item}
              actingId={actingId}
              submittingCorrection={submittingCorrection}
              note={note}
              canApprove={canApprove}
              canReject={canReject}
              canRequestCorrection={canRequestCorrection}
              canPropose={canPropose}
              onApprove={onApprove}
              onReject={onReject}
              onRequestCorrection={onRequestCorrection}
              onProposeMint={onProposeMint}
            />

          </div>
        </div>
      </div>
    </div>
  );
}
