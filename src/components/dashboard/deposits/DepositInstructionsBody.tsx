"use client";

import React from "react";
import { ProofUploader } from "./ProofUploader";
import type { DepositCreateResponse } from "./types";

interface Props {
  result: DepositCreateResponse;
  qrImageUrl: string | null;
  onOpenQr: () => void;
  onCopyAccountNumber: () => void;
}

export function DepositInstructionsBody({
  result,
  qrImageUrl,
  onOpenQr,
  onCopyAccountNumber,
}: Props) {
  return (
    <div className="px-6 py-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        {/* Amounts */}
        <div className="rounded-xl border border-gray-700 bg-[#0a1628] p-4">
          <p className="text-xs text-gray-400 mb-1">Total a pagar</p>
          <p className="text-base font-semibold text-white">
            {Number(result.totalAmount).toFixed(2)}{" "}
            {result.currency === "BOB" ? "Bs" : "S/"}
          </p>

          <p className="mt-2 text-xs text-gray-400 mb-1">Recibirás (estimado)</p>
          <p className="text-base font-semibold text-teal-300">
            {Number(result.expectedBOBH).toFixed(2)} BOBH
          </p>
        </div>

        {/* Bank details */}
        <div className="rounded-xl border border-gray-700 bg-[#0a1628] p-4">
          <p className="text-xs text-gray-400 mb-2">{result.instructions.title}</p>
          <p className="text-sm text-gray-200">
            <span className="text-gray-400">Banco:</span> {result.instructions.bankName}
          </p>
          <p className="text-sm text-gray-200">
            <span className="text-gray-400">Titular:</span>{" "}
            {result.instructions.accountName}
          </p>
          <div className="text-sm text-gray-200 flex items-center gap-2">
            <span className="text-gray-400">Cuenta:</span>
            <button
              type="button"
              onClick={onCopyAccountNumber}
              className="text-teal-200 hover:text-teal-100 underline underline-offset-2"
            >
              {result.instructions.accountNumber}
            </button>
            <button
              type="button"
              onClick={onCopyAccountNumber}
              className="text-xs text-teal-300 hover:text-teal-200"
            >
              (copiar)
            </button>
          </div>
          {result.instructions.cci && (
            <p className="text-sm text-gray-200">
              <span className="text-gray-400">CCI:</span> {result.instructions.cci}
            </p>
          )}
          {qrImageUrl && (
            <button
              type="button"
              onClick={onOpenQr}
              className="mt-3 inline-flex items-center justify-center rounded-lg border border-teal-500/40 bg-teal-500/10 px-3 py-1.5 text-xs font-medium text-teal-200 hover:bg-teal-500/20"
            >
              Ver QR
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-200">{result.instructions.note}</p>

      <p className="mt-2 text-xs text-gray-400">
        Estado actual: <span className="text-gray-200">{result.status}</span>
      </p>

      <div className="mt-4">
        <ProofUploader depositId={result.depositId} onUploaded={() => {}} />
      </div>
    </div>
  );
}
