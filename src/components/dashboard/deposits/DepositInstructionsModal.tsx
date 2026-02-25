"use client";

import React from "react";
import { ProofUploader } from "./ProofUploader";
import { DepositBankQrModal } from "./DepositBankQrModal";
import type { DepositCreateResponse } from "./types";

type Props = {
  result: DepositCreateResponse;
  isQrModalOpen: boolean;
  onOpenQr: () => void;
  onCloseQr: () => void;
  onClose: () => void;
};

export function DepositInstructionsModal({
  result,
  isQrModalOpen,
  onOpenQr,
  onCloseQr,
  onClose,
}: Props) {
  const qrImageUrl = result.instructions?.qrImageUrl ?? null;

  const handleCopyAccountNumber = () => {
    const accountNumber = result.instructions?.accountNumber;
    if (!accountNumber) return;
    navigator.clipboard?.writeText(accountNumber).catch(() => {});
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        onMouseDown={onClose}
        aria-modal="true"
        role="dialog"
      >
        <div
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-teal-500/30 bg-[#0f1e33] shadow-xl"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-800 px-6 py-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Depósito creado</h3>
              <p className="text-sm text-gray-300">
                Referencia:{" "}
                <span className="font-semibold text-teal-200">{result.referenceCode}</span>
              </p>
              {result.currency === "PEN" && result.rateUsed && result.rateExpiresAt && (
                <p className="mt-2 text-xs text-gray-400">
                  Tipo de cambio fijado: 1 PEN = {Number(result.rateUsed).toFixed(4)} BOB •
                  Válido hasta: {new Date(result.rateExpiresAt).toLocaleString()}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-700 bg-[#0a1628] px-3 py-1.5 text-sm text-gray-200 hover:bg-[#152b47]"
            >
              Cerrar
            </button>
          </div>

          {/* Body */}
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
                    onClick={handleCopyAccountNumber}
                    className="text-teal-200 hover:text-teal-100 underline underline-offset-2"
                  >
                    {result.instructions.accountNumber}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyAccountNumber}
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

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-gray-800 px-6 py-4">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(result.referenceCode).catch(() => {});
              }}
              className="rounded-lg border border-gray-700 bg-[#0a1628] px-4 py-2 text-sm text-gray-200 hover:bg-[#152b47]"
            >
              Copiar referencia
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>

      {qrImageUrl && (
        <DepositBankQrModal
          open={isQrModalOpen}
          onClose={onCloseQr}
          qrImageUrl={qrImageUrl}
          bankName={result.instructions?.bankName}
        />
      )}
    </>
  );
}
