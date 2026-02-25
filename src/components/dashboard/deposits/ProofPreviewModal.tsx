"use client";

import React from "react";
import type { AdminDepositItem } from "./types";
import { statusBadgeClass, statusLabel, fmt, isImageMime, isPdfMime } from "./depositUtils";

type Props = {
  deposit: AdminDepositItem;
  actingId: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onCopy: (label: string, value: string) => void;
  onClose: () => void;
};

export function ProofPreviewModal({
  deposit: d,
  actingId,
  onApprove,
  onReject,
  onCopy,
  onClose,
}: Props) {
  const isActing = actingId === d.id;

  const canApprove =
    d.status !== "MINTED" &&
    !(d.currency === "PEN" && d.isRateExpired) &&
    !!d.proofUrl;

  const canReject = d.status !== "MINTED";

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-2xl border border-gray-700 bg-[#0f1e33] shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div>
            <p className="text-white font-semibold">Vista previa</p>
            <p className="text-xs text-gray-400">
              Ref: <span className="text-teal-300 font-semibold">{d.referenceCode}</span>{" "}
              • {d.user.email}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-lg text-sm border border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
          >
            Cerrar
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Media */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-800 bg-[#071225] p-3">
            {!d.proofUrl ? (
              <p className="text-sm text-gray-300">Sin comprobante.</p>
            ) : isImageMime(d.proofMimeType) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={d.proofUrl}
                alt="Comprobante"
                className="w-full max-h-[560px] object-contain rounded-xl border border-gray-800 bg-[#0a1628]"
              />
            ) : isPdfMime(d.proofMimeType) ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-200">PDF cargado.</p>
                <a
                  href={d.proofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#0a1628] text-teal-300 hover:bg-[#152b47]"
                >
                  Abrir PDF en nueva pestaña
                </a>
                <div className="rounded-xl border border-gray-800 overflow-hidden">
                  <iframe src={d.proofUrl} className="w-full h-[520px]" title="PDF preview" />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-200">Archivo cargado.</p>
                <a
                  href={d.proofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#0a1628] text-teal-300 hover:bg-[#152b47]"
                >
                  Abrir archivo
                </a>
              </div>
            )}
          </div>

          {/* Actions panel */}
          <div className="rounded-2xl border border-gray-800 bg-[#071225] p-4">
            <div className="flex items-center justify-between gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(d.status)}`}
              >
                {statusLabel(d.status)}
              </span>
              <button
                type="button"
                onClick={() => onCopy("Referencia", d.referenceCode)}
                className="px-3 py-2 rounded-lg text-xs font-medium border border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
              >
                Copiar ref
              </button>
            </div>

            <div className="mt-3 text-sm text-gray-200">
              <p>
                <span className="text-gray-400">Total:</span>{" "}
                {fmt(Number(d.totalAmount))} {d.currency === "BOB" ? "Bs" : "S/"}
              </p>
              <p className="mt-1">
                <span className="text-gray-400">Recibe:</span>{" "}
                <span className="text-teal-300 font-semibold">
                  {fmt(Number(d.expectedBOBH))} BOBH
                </span>
              </p>

              {d.currency === "PEN" && d.rateUsed && d.rateExpiresAt && (
                <p className="mt-2 text-xs text-gray-400">
                  Rate:{" "}
                  <span className="text-gray-200">
                    1 PEN = {Number(d.rateUsed).toFixed(4)} BOB
                  </span>
                  <br />
                  Vence:{" "}
                  <span className="text-gray-200">
                    {new Date(d.rateExpiresAt).toLocaleString()}
                  </span>
                </p>
              )}
            </div>

            {d.currency === "PEN" && d.isRateExpired && (
              <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                <p className="text-xs text-red-200">Rate vencido: no aprobar.</p>
              </div>
            )}

            {d.reviewNote && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                <p className="text-xs text-amber-200 font-semibold">Revisión solicitada</p>
                <p className="text-sm text-amber-100 mt-1 whitespace-pre-line">{d.reviewNote}</p>
                {d.reviewedAt && (
                  <p className="text-xs text-amber-200/70 mt-2">
                    {new Date(d.reviewedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => onApprove(d.id)}
                disabled={isActing || !canApprove}
                className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                  isActing || !canApprove
                    ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-cyan-700"
                }`}
              >
                {isActing ? "Procesando..." : "Aprobar"}
              </button>

              <button
                type="button"
                onClick={() => onReject(d.id)}
                disabled={isActing || !canReject}
                className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                  isActing || !canReject
                    ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {isActing ? "Procesando..." : "Rechazar"}
              </button>
            </div>

            <div className="mt-4 flex gap-2">
              {d.proofUrl && (
                <a
                  href={d.proofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center px-3 py-2 rounded-lg text-sm border border-gray-700 bg-[#0a1628] text-teal-300 hover:bg-[#152b47]"
                >
                  Abrir
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-3 py-2 rounded-lg text-sm border border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
              >
                Cerrar
              </button>
            </div>

            {d.safeTxHash && (
              <div className="mt-4 rounded-xl border border-gray-800 bg-[#0a1628] p-3">
                <p className="text-xs text-gray-400">Propuesta creada</p>
                {d.safeProposedAt && (
                  <p className="mt-1 text-[11px] text-gray-400">
                    {new Date(d.safeProposedAt).toLocaleString()}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-200 break-all">{d.safeTxHash}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
