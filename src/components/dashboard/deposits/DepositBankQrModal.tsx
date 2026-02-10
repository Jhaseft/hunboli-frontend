"use client";

import React from "react";

type DepositBankQrModalProps = {
  open: boolean;
  onClose: () => void;
  qrImageUrl: string;
  bankName?: string;
};

export function DepositBankQrModal({
  open,
  onClose,
  qrImageUrl,
  bankName,
}: DepositBankQrModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onMouseDown={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-teal-500/30 bg-[#0f1e33] shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-gray-800 px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-white">QR de transferencia</h3>
            {bankName && (
              <p className="mt-1 text-xs text-gray-400">Banco: {bankName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-700 bg-[#0a1628] px-3 py-1.5 text-xs text-gray-200 hover:bg-[#152b47]"
          >
            Cerrar
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="flex justify-center">
            <img
              src={qrImageUrl}
              alt="QR de transferencia"
              className="w-full max-w-xs rounded-xl border border-gray-700 bg-white p-3"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-gray-800 px-5 py-4">
          <a
            href={qrImageUrl}
            target="_blank"
            rel="noreferrer"
            download
            className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-medium text-white hover:bg-cyan-700"
          >
            Descargar QR
          </a>
        </div>
      </div>
    </div>
  );
}
