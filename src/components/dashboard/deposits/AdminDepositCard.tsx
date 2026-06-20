"use client";

import React from "react";
import type { AdminDepositItem } from "./types";
import { statusBadgeClass, statusLabel, fmt } from "./depositUtils";
import { AdminDepositActionsPanel } from "./AdminDepositActionsPanel";
import { AdminDepositProofSection } from "./AdminDepositProofSection";

type Props = {
  deposit: AdminDepositItem;
  actingId: string | null;
  submittingCorrection: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRequestCorrection: (deposit: AdminDepositItem) => void;
  onPreview: (deposit: AdminDepositItem) => void;
  onCopy: (label: string, value: string) => void;
};

export function AdminDepositCard({
  deposit: d,
  actingId,
  submittingCorrection,
  onApprove,
  onReject,
  onRequestCorrection,
  onPreview,
  onCopy,
}: Props) {
  const total = Number(d.totalAmount);
  const expected = Number(d.expectedBOBH);
  const currencyLabel = d.currency === "BOB" ? "Bs" : "S/";
  const created = new Date(d.createdAt).toLocaleString();

  const canApprove =
    d.status !== "MINTED" &&
    d.status !== "NEED_CORRECTION" &&
    !(d.currency === "PEN" && d.isRateExpired) &&
    !!d.proofUrl;

  const canReject =
    d.status !== "MINTED" &&
    (d.status === "PROOF_SUBMITTED" || d.status === "NEED_CORRECTION");

  const canRequestCorrection = d.status === "PROOF_SUBMITTED" && !!d.proofUrl;

  return (
    <div className="rounded-2xl border border-gray-700 bg-[#0a1628] p-5">
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">

        {/* LEFT */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(d.status)}`}>
              {statusLabel(d.status)}
            </span>

            {d.currency === "PEN" && d.isRateExpired && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold border border-red-500/30 bg-red-500/10 text-red-200">
                Rate vencido
              </span>
            )}

            <p className="text-sm text-gray-200">
              <span className="text-gray-400">Ref:</span>{" "}
              <span className="font-semibold text-teal-200">{d.referenceCode}</span>
            </p>

            <p className="text-xs text-gray-500">{created}</p>

            <button
              type="button"
              onClick={() => onCopy("Referencia", d.referenceCode)}
              className="ml-auto xl:ml-0 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700 bg-[#071225] text-gray-200 hover:bg-[#152b47]"
            >
              Copiar referencia
            </button>
          </div>

          {d.currency === "PEN" && d.isRateExpired && (
            <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
              <p className="text-xs text-red-200">
                Este depósito no debería aprobarse: el tipo de cambio expiró. Pide al usuario crear
                un nuevo depósito.
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
              <p className="text-base font-semibold text-teal-300">{fmt(expected)} BOBH</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
              <p className="text-xs text-gray-400">Usuario</p>
              <p className="text-sm font-semibold text-white">
                {d.user.firstName} {d.user.lastName}
              </p>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-gray-400 break-all">{d.user.email}</p>
                <button
                  type="button"
                  onClick={() => onCopy("Email", d.user.email)}
                  className="px-2 py-1 rounded-md text-xs border border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
              <p className="text-xs text-gray-400">País / KYC / Wallet</p>
              <p className="text-sm text-gray-200">
                <span className="text-gray-400">País:</span> {d.user.country}
                {"  "}•{"  "}
                <span className="text-gray-400">KYC:</span> {d.user.kycStatus}
              </p>

              <div className="mt-1 flex items-start justify-between gap-2">
                <p className="text-xs text-gray-400 break-all">
                  <span className="text-gray-500">Wallet:</span>{" "}
                  {d.user.walletAddress ?? "No registrada"}
                </p>
                {d.user.walletAddress && (
                  <button
                    type="button"
                    onClick={() => onCopy("Wallet", d.user.walletAddress!)}
                    className="shrink-0 px-2 py-1 rounded-md text-xs border border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
                  >
                    Copiar
                  </button>
                )}
              </div>
            </div>

            <AdminDepositProofSection deposit={d} onPreview={onPreview} />
          </div>

          {d.status === "NEED_CORRECTION" && d.reviewNote && (
            <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
              <p className="text-xs font-semibold text-amber-300">Observado</p>
              <p className="mt-1 text-sm text-amber-100">{d.reviewNote}</p>
              {d.reviewedAt && (
                <p className="mt-2 text-[11px] text-amber-200/70">
                  {new Date(d.reviewedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {d.currency === "PEN" && d.rateUsed && d.rateExpiresAt && (
            <div className="mt-3 rounded-xl border border-gray-800 bg-[#071225] p-3">
              <p className="text-xs text-gray-400">
                Rate fijado:{" "}
                <span className="text-gray-200 font-semibold">
                  1 PEN = {Number(d.rateUsed).toFixed(4)} BOB
                </span>{" "}
                {d.rateSource && (
                  <span className="text-gray-500">({d.rateSource})</span>
                )}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Válido hasta:{" "}
                <span className="text-gray-200">
                  {new Date(d.rateExpiresAt).toLocaleString()}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <AdminDepositActionsPanel
          deposit={d}
          actingId={actingId}
          submittingCorrection={submittingCorrection}
          canApprove={canApprove}
          canReject={canReject}
          canRequestCorrection={canRequestCorrection}
          onApprove={onApprove}
          onReject={onReject}
          onRequestCorrection={onRequestCorrection}
        />

      </div>
    </div>
  );
}
