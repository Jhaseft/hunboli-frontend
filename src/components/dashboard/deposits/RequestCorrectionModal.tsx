"use client";

import React from "react";
import type { AdminDepositItem } from "./types";

type Props = {
  target: AdminDepositItem;
  note: string;
  onNoteChange: (note: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  submitting: boolean;
};

export function RequestCorrectionModal({
  target,
  note,
  onNoteChange,
  onSubmit,
  onClose,
  submitting,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-800 bg-[#071225] p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white font-semibold">Solicitar corrección</p>
            <p className="text-xs text-gray-400 mt-1">
              Ref: {target.referenceCode} • {target.user.email}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!submitting) onClose();
            }}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <label className="block mt-4 text-xs text-gray-300">Motivo / indicaciones</label>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={4}
          className="mt-2 w-full rounded-xl border border-gray-800 bg-[#0B1B34] p-3 text-sm text-white outline-none focus:border-amber-500/60"
          placeholder="Ej: No se ve el monto ni la fecha. Envia otra foto más clara."
        />

        <div className="mt-4 flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-gray-700/40 text-gray-200 hover:bg-gray-700/60 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting || note.trim().length < 5}
            className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {submitting ? "Enviando..." : "Enviar corrección"}
          </button>
        </div>
      </div>
    </div>
  );
}
