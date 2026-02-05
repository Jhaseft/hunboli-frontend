"use client";

import { useState } from "react";
import type { KycDocumentType } from "@/services/kyc.service";
import { DOC_LABELS } from "../useKycFlow";

type Props = {
  missingDocs: KycDocumentType[];
  onSubmit: () => Promise<void>;
  onSubmitted: () => void;
  onBack?: () => void;
  onClose: () => void;
};

export function StepSubmit({ missingDocs, onSubmit, onSubmitted, onBack, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const missingLabel = missingDocs.length
    ? missingDocs.map((doc) => DOC_LABELS[doc]).join(", ")
    : "Completo";

  const canSubmit = missingDocs.length === 0;

  const handleSubmit = async () => {
    setError(null);
    if (!canSubmit) {
      setError("Completa todos los archivos antes de enviar.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit();
      onSubmitted();
    } catch (e: any) {
      setError(e?.message ?? "No se pudo enviar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">Enviar a revision</h2>
        <p className="text-sm text-gray-400 mt-1">
          Revisa que todos los documentos esten correctos antes de enviar.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-gray-800 bg-[#0a1628] p-4 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Faltan:</span>
          <span className="text-gray-200">{missingLabel}</span>
        </div>
        {!canSubmit && (
          <p className="text-xs text-amber-300 mt-2">
            Completa los documentos faltantes para habilitar el envio.
          </p>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={!onBack || loading}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            !onBack || loading
              ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
              : "bg-[#0a1628] border border-gray-700 text-gray-200 hover:bg-[#152b47]"
          }`}
        >
          Volver
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700/40 text-gray-200 hover:bg-gray-700"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !canSubmit}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              loading || !canSubmit
                ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                : "bg-cyan-600 text-white hover:bg-cyan-700"
            }`}
          >
            {loading ? "Enviando..." : "Enviar a revision"}
          </button>
        </div>
      </div>
    </div>
  );
}
