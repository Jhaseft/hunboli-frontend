"use client";

import React from "react";
import type { AdminDepositItem } from "./types";

interface Props {
  deposit: AdminDepositItem;
  actingId: string | null;
  submittingCorrection: boolean;
  canApprove: boolean;
  canReject: boolean;
  canRequestCorrection: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRequestCorrection: (deposit: AdminDepositItem) => void;
}

export function AdminDepositActionsPanel({
  deposit: d,
  actingId,
  submittingCorrection,
  canApprove,
  canReject,
  canRequestCorrection,
  onApprove,
  onReject,
  onRequestCorrection,
}: Props) {
  const isActing = actingId === d.id;

  return (
    <div className="w-full xl:w-[270px]">
      <div className="rounded-2xl border border-gray-800 bg-[#071225] p-4">
        <p className="text-sm font-semibold text-white mb-3">Acciones</p>

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
          onClick={() => onRequestCorrection(d)}
          disabled={isActing || submittingCorrection || !canRequestCorrection}
          className={`mt-2 w-full py-2.5 rounded-lg font-medium transition-colors ${
            isActing || submittingCorrection || !canRequestCorrection
              ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
              : "bg-amber-600 text-white hover:bg-amber-700"
          }`}
        >
          Solicitar corrección
        </button>

        <button
          type="button"
          onClick={() => onReject(d.id)}
          disabled={isActing || !canReject}
          className={`mt-2 w-full py-2.5 rounded-lg font-medium transition-colors ${
            isActing || !canReject
              ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {isActing ? "Procesando..." : "Rechazar"}
        </button>

        {!d.proofUrl && (
          <p className="mt-3 text-xs text-gray-500">
            Para aprobar, debe existir comprobante.
          </p>
        )}

        {d.validatedAt && (
          <p className="mt-3 text-xs text-gray-500">
            Validado: {new Date(d.validatedAt).toLocaleString()}
          </p>
        )}
      </div>

      {d.safeTxHash && (
        <div className="mt-3 rounded-2xl border border-gray-800 bg-[#071225] p-4">
          <p className="text-xs text-gray-400">Propuesta creada</p>
          {d.safeProposedAt && (
            <p className="mt-1 text-[11px] text-gray-400">
              {new Date(d.safeProposedAt).toLocaleString()}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-200 break-all">{d.safeTxHash}</p>
        </div>
      )}

      {d.mintTxHash && (
        <div className="mt-3 rounded-2xl border border-gray-800 bg-[#071225] p-4">
          <p className="text-xs text-gray-400">Mint Tx</p>
          <p className="mt-1 text-xs text-gray-200 break-all">{d.mintTxHash}</p>
        </div>
      )}
    </div>
  );
}
