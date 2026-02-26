"use client";

import React from "react";
import type { AdminMintDepositItem } from "./types";

interface ReviewActionsPanelProps {
  item: AdminMintDepositItem;
  actingId: string | null;
  canApprove: boolean;
  canReject: boolean;
  canRequestCorrection: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onOpenCorrection: (item: AdminMintDepositItem) => void;
}

export function ReviewActionsPanel({
  item,
  actingId,
  canApprove,
  canReject,
  canRequestCorrection,
  onApprove,
  onReject,
  onOpenCorrection,
}: ReviewActionsPanelProps) {
  const isActing = actingId === item.id;

  return (
    <div className="rounded-2xl border border-gray-800 bg-[#071225] p-4">
      <p className="text-sm font-semibold text-white mb-3">Revision</p>

      <button
        type="button"
        onClick={() => onApprove(item.id)}
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
        onClick={() => onOpenCorrection(item)}
        disabled={isActing || !canRequestCorrection}
        className={`mt-2 w-full py-2.5 rounded-lg font-medium transition-colors ${
          isActing || !canRequestCorrection
            ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
            : "bg-amber-600 text-white hover:bg-amber-700"
        }`}
      >
        Solicitar correccion
      </button>

      <button
        type="button"
        onClick={() => onReject(item.id)}
        disabled={isActing || !canReject}
        className={`mt-2 w-full py-2.5 rounded-lg font-medium transition-colors ${
          isActing || !canReject
            ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
            : "bg-red-600 text-white hover:bg-red-700"
        }`}
      >
        {isActing ? "Procesando..." : "Rechazar"}
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
  );
}
