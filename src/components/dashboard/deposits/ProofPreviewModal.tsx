"use client";

import React from "react";
import type { AdminDepositItem } from "./types";
import { ProofMediaViewer } from "./ProofMediaViewer";
import { ProofModalActionsPanel } from "./ProofModalActionsPanel";

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
  const canApprove =
    d.status !== "MINTED" &&
    !(d.currency === "PEN" && d.isRateExpired) &&
    !!d.proofUrl;

  const canReject = d.status !== "MINTED";

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-2xl border border-gray-700 bg-[#0f1e33] shadow-xl overflow-hidden">

        {/* Header */}
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

        {/* Body */}
        <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ProofMediaViewer proofUrl={d.proofUrl} proofMimeType={d.proofMimeType} />
          <ProofModalActionsPanel
            deposit={d}
            actingId={actingId}
            canApprove={canApprove}
            canReject={canReject}
            onApprove={onApprove}
            onReject={onReject}
            onCopy={onCopy}
            onClose={onClose}
          />
        </div>

      </div>
    </div>
  );
}
