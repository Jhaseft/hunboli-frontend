"use client";

import { useEffect, useMemo, useState } from "react";
import { kycService, KycDocumentType } from "@/services/kyc.service";
import type { KycStatus } from "@/types/auth.types";
import { useAuth } from "@/context/AuthContext";

type UploadState = {
  file: File | null;
  uploading: boolean;
  error: string | null;
};

const DOC_LABELS: Record<KycDocumentType, string> = {
  ID_FRONT: "CI Anverso",
  ID_BACK: "CI Reverso",
  LIVENESS_VIDEO: "Video de verificación",
};

const TYPE_TO_ENDPOINT: Record<KycDocumentType, "id-front" | "id-back" | "video"> = {
  ID_FRONT: "id-front",
  ID_BACK: "id-back",
  LIVENESS_VIDEO: "video",
};

function statusBadge(status: KycStatus | null) {
  if (!status) return null;

  const map: Record<KycStatus, { label: string; className: string }> = {
    VERIFIED: { label: "KYC Verificado", className: "bg-green-600/20 text-green-300 border border-green-500/30" },
    PENDING: { label: "En revisión", className: "bg-yellow-600/20 text-yellow-300 border border-yellow-500/30" },
    NEED_CORRECTION: { label: "Corrección requerida", className: "bg-amber-600/20 text-amber-300 border border-amber-500/30" },
    REJECTED: { label: "Rechazado", className: "bg-red-600/20 text-red-300 border border-red-500/30" },
    UNVERIFIED: { label: "Pendiente", className: "bg-yellow-600/20 text-yellow-300 border border-yellow-500/30" },
  };

  const badge = map[status];
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.className}`}>{badge.label}</span>;
}

export default function KycPage() {
  const { token, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [requestId, setRequestId] = useState<string | null>(null);
  const [status, setStatus] = useState<KycStatus | null>(null);
  const [reviewNote, setReviewNote] = useState<string | null>(null);
  const [missingDocs, setMissingDocs] = useState<KycDocumentType[]>([]);

  const [uploads, setUploads] = useState<Record<KycDocumentType, UploadState>>({
    ID_FRONT: { file: null, uploading: false, error: null },
    ID_BACK: { file: null, uploading: false, error: null },
    LIVENESS_VIDEO: { file: null, uploading: false, error: null },
  });

  const canUpload = status === "UNVERIFIED" || status === "NEED_CORRECTION";
  const isPending = status === "PENDING";
  const isVerified = status === "VERIFIED";

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await kycService.getMe();
      setStatus(data.kycStatus);
      setRequestId(data.requestActual?.id ?? null);
      setReviewNote(data.reviewNote ?? null);
      setMissingDocs(data.missingDocs ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "No se pudo cargar tu estado KYC.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (!token) return;
    refresh();
  }, [isLoading, token]);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await kycService.createRequest();
      setRequestId(data.requestId);
      setStatus(data.status);
      setMissingDocs(data.missingDocs ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "No se pudo iniciar KYC.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (docType: KycDocumentType) => {
    if (!requestId) {
      setError("Primero inicia tu solicitud KYC.");
      return;
    }
    const state = uploads[docType];
    if (!state.file) {
      setError("Selecciona un archivo.");
      return;
    }

    setUploads((prev) => ({
      ...prev,
      [docType]: { ...prev[docType], uploading: true, error: null },
    }));

    try {
      await kycService.uploadDocument(requestId, TYPE_TO_ENDPOINT[docType], state.file);
      setUploads((prev) => ({
        ...prev,
        [docType]: { file: null, uploading: false, error: null },
      }));
      await refresh();
    } catch (e: any) {
      setUploads((prev) => ({
        ...prev,
        [docType]: {
          ...prev[docType],
          uploading: false,
          error: e?.response?.data?.message ?? "Error al subir archivo.",
        },
      }));
    }
  };

  const handleSubmit = async () => {
    if (!requestId) {
      setError("No hay solicitud activa.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await kycService.submitRequest(requestId);
      setStatus(data.status);
      await refresh();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "No se pudo enviar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  const missingLabel = useMemo(() => {
    if (!missingDocs.length) return "Completo";
    return missingDocs.map((d) => DOC_LABELS[d]).join(", ");
  }, [missingDocs]);

  if (!token && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-4">
        <div className="bg-[#0f1e33] border border-gray-800 rounded-2xl p-6 max-w-md text-center">
          <h1 className="text-xl font-semibold text-white">Inicia sesión</h1>
          <p className="text-gray-400 text-sm mt-2">Necesitas iniciar sesión para gestionar tu KYC.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#0f1e33] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-white">Verificación KYC</h1>
              <p className="text-gray-400 text-sm mt-1">
                Sube tu CI (anverso y reverso) y un video corto de verificación.
              </p>
            </div>
            {statusBadge(status)}
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200 text-sm">
              {error}
            </div>
          )}

          {reviewNote && status === "NEED_CORRECTION" && (
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200 text-sm">
              <p className="font-semibold mb-1">Corrección requerida</p>
              <p>{reviewNote}</p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-gray-400">Faltan:</span>
            <span className="text-gray-200">{missingLabel}</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleStart}
              disabled={loading || isVerified}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                loading || isVerified
                  ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                  : "bg-teal-600 text-white hover:bg-teal-700"
              }`}
            >
              {requestId ? "Continuar" : "Iniciar"}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || isPending || isVerified || missingDocs.length > 0}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                loading || isPending || isVerified || missingDocs.length > 0
                  ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                  : "bg-cyan-600 text-white hover:bg-cyan-700"
              }`}
            >
              Enviar a revisión
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {(["ID_FRONT", "ID_BACK", "LIVENESS_VIDEO"] as KycDocumentType[]).map((docType) => {
              const state = uploads[docType];
              const isVideo = docType === "LIVENESS_VIDEO";

              return (
                <div key={docType} className="rounded-xl border border-gray-800 bg-[#0a1628] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{DOC_LABELS[docType]}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {isVideo ? "MP4 o WEBM hasta 50MB" : "JPG, PNG o WEBP hasta 10MB"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpload(docType)}
                      disabled={!canUpload || state.uploading || !state.file || isPending || isVerified}
                      className={`px-3 py-2 rounded-lg text-xs font-medium ${
                        !canUpload || state.uploading || !state.file || isPending || isVerified
                          ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                          : "bg-teal-600 text-white hover:bg-teal-700"
                      }`}
                    >
                      {state.uploading ? "Subiendo..." : "Subir"}
                    </button>
                  </div>

                  <input
                    type="file"
                    accept={isVideo ? "video/mp4,video/webm" : "image/jpeg,image/png,image/webp"}
                    disabled={!canUpload || isPending || isVerified}
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setUploads((prev) => ({
                        ...prev,
                        [docType]: { ...prev[docType], file, error: null },
                      }));
                    }}
                    className="mt-3 block w-full text-xs text-gray-300"
                  />

                  {state.error && (
                    <p className="mt-2 text-xs text-red-300">{state.error}</p>
                  )}
                </div>
              );
            })}
          </div>

          {isPending && (
            <div className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-200 text-sm">
              Tu solicitud está en revisión. No puedes modificar archivos mientras se procesa.
            </div>
          )}

          {isVerified && (
            <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200 text-sm">
              Tu KYC está verificado. ¡Gracias!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
