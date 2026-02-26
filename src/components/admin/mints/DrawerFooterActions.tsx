"use client";

import React from "react";
import type { AdminMintDepositItem } from "./types";

interface DrawerFooterActionsProps {
  item: AdminMintDepositItem;
  actingId: string | null;
  submittingCorrection: boolean;
  note: string;
  canApprove: boolean;
  canReject: boolean;
  canRequestCorrection: boolean;
  canPropose: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRequestCorrection: (id: string, note: string) => void;
  onProposeMint: (id: string) => void;
}

export function DrawerFooterActions({
  item,
  actingId,
  submittingCorrection,
  note,
  canApprove,
  canReject,
  canRequestCorrection,
  canPropose,
  onApprove,
  onReject,
  onRequestCorrection,
  onProposeMint,
}: DrawerFooterActionsProps) {
  const acting = actingId === item.id;
  const correctionDisabled =
    acting || submittingCorrection || note.trim().length < 5 || !canRequestCorrection;

  return (
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
          disabled={correctionDisabled}
          className={`mt-2 w-full py-2.5 rounded-lg font-medium transition-colors ${
            correctionDisabled
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
  );
}
