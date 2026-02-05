"use client";

import type { KycStatus } from "@/types/auth.types";
import type { KycDocumentType } from "@/services/kyc.service";
import { DOC_LABELS } from "./useKycFlow";

type Props = {
  status: KycStatus | null;
  requestId: string | null;
  missingDocs: KycDocumentType[];
  reviewNote: string | null;
  loading: boolean;
  onStart: () => void;
};

export function KycIntro({
  status,
  requestId,
  missingDocs,
  reviewNote,
  loading,
  onStart,
}: Props) {
  const missingLabel = !requestId
    ? "Inicia para ver los documentos requeridos."
    : missingDocs.length
    ? missingDocs.map((doc) => DOC_LABELS[doc]).join(", ")
    : "Ninguno";

  const isCorrection = status === "NEED_CORRECTION";

  return (
    <div className="bg-[#0f1e33] border border-gray-800 rounded-2xl p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Antes de empezar</h2>
          <p className="text-gray-400 text-sm mt-1">
            Completa los pasos y envia tu solicitud para revision.
          </p>
        </div>
        <button
          type="button"
          onClick={onStart}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            loading ? "bg-gray-700/40 text-gray-400 cursor-not-allowed" : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
        >
          {requestId ? "Continuar" : "Iniciar"}
        </button>
      </div>

      {isCorrection && reviewNote && (
        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200 text-sm">
          <p className="font-semibold mb-1">Correccion requerida</p>
          <p>{reviewNote}</p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl border border-gray-800 bg-[#0a1628] p-4">
          <p className="text-gray-200 font-medium">Paso 1</p>
          <p className="text-gray-400 mt-1">CI anverso</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-[#0a1628] p-4">
          <p className="text-gray-200 font-medium">Paso 2</p>
          <p className="text-gray-400 mt-1">CI reverso</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-[#0a1628] p-4">
          <p className="text-gray-200 font-medium">Paso 3</p>
          <p className="text-gray-400 mt-1">Video corto</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="text-gray-400">Faltan:</span>
        <span className="text-gray-200">{missingLabel}</span>
      </div>

      <div className="mt-4 rounded-xl border border-gray-800 bg-[#0a1628] p-4 text-xs text-gray-400">
        Asegurate de que el documento este completo, legible y con buena iluminacion.
      </div>
    </div>
  );
}
