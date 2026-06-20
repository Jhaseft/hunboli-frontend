"use client";

import React from "react";
import type { AdminMintDepositItem } from "./types";

interface MintPanelProps {
  item: AdminMintDepositItem;
  actingId: string | null;
  canPropose: boolean;
  isMinted: boolean;
  onProposeMint: (id: string) => void;
}

export function MintPanel({
  item,
  actingId,
  canPropose,
  isMinted,
  onProposeMint,
}: MintPanelProps) {
  const isActing = actingId === item.id;

  return (
    <div className="mt-3 rounded-2xl border border-gray-800 bg-[#071225] p-4">
      <p className="text-sm font-semibold text-white mb-3">Mint</p>

      <button
        type="button"
        onClick={() => onProposeMint(item.id)}
        disabled={isActing || !canPropose}
        className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
          isActing || !canPropose
            ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
            : "bg-sky-600 text-white hover:bg-sky-700"
        }`}
      >
        {isActing ? "Procesando..." : "Proponer mint (Safe)"}
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
          <p className="text-xs text-emerald-300 font-semibold">Minted</p>
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
  );
}
