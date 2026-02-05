"use client";

import { useState } from "react";
import type { KycStatus } from "@/types/auth.types";
import { KycIntro } from "@/components/kyc/KycIntro";
import { KycWizardModal } from "@/components/kyc/KycWizardModal";
import { useKycFlow } from "@/components/kyc/useKycFlow";

function statusBadge(status: KycStatus | null) {
  if (!status) return null;

  const map: Record<KycStatus, { label: string; className: string }> = {
    VERIFIED: { label: "KYC Verificado", className: "bg-green-600/20 text-green-300 border border-green-500/30" },
    PENDING: { label: "En revision", className: "bg-yellow-600/20 text-yellow-300 border border-yellow-500/30" },
    NEED_CORRECTION: { label: "Correccion requerida", className: "bg-amber-600/20 text-amber-300 border border-amber-500/30" },
    REJECTED: { label: "Rechazado", className: "bg-red-600/20 text-red-300 border border-red-500/30" },
    UNVERIFIED: { label: "Pendiente", className: "bg-yellow-600/20 text-yellow-300 border border-yellow-500/30" },
  };

  const badge = map[status];
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.className}`}>{badge.label}</span>;
}

function StatusPanel({ status, reviewNote }: { status: KycStatus; reviewNote?: string | null }) {
  if (status === "PENDING") {
    return (
      <div className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-200 text-sm">
        Tu solicitud esta en revision. No puedes modificar archivos mientras se procesa.
      </div>
    );
  }

  if (status === "VERIFIED") {
    return (
      <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200 text-sm">
        Tu KYC esta verificado. Gracias.
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200 text-sm">
        <p>Tu solicitud fue rechazada.</p>
        {reviewNote && <p className="mt-2 text-red-100">Motivo: {reviewNote}</p>}
      </div>
    );
  }

  return null;
}

export default function KycPage() {
  const {
    token,
    isLoading,
    loading,
    error,
    setError,
    requestId,
    status,
    reviewNote,
    missingDocs,
    refresh,
    startRequest,
    uploadDocument,
    submitRequest,
  } = useKycFlow();

  const [wizardOpen, setWizardOpen] = useState(false);

  const canUseWizard = status === "UNVERIFIED" || status === "NEED_CORRECTION";
  const isLocked = status === "PENDING" || status === "VERIFIED" || status === "REJECTED";

  const handleStart = async () => {
    if (loading) return;
    setError(null);
    if (!requestId) {
      const data = await startRequest();
      if (!data?.requestId) return;
    } else {
      await refresh();
    }
    setWizardOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 px-4">
        <div className="text-gray-400 text-sm">Cargando...</div>
      </div>
    );
  }

  if (!token && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 px-4">
        <div className="bg-[#0f1e33] border border-gray-800 rounded-2xl p-6 max-w-md text-center">
          <h1 className="text-xl font-semibold text-white">Inicia sesion</h1>
          <p className="text-gray-400 text-sm mt-2">Necesitas iniciar sesion para gestionar tu KYC.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#0f1e33] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-white">Verificacion KYC</h1>
              <p className="text-gray-400 text-sm mt-1">
                Sube tu CI (anverso y reverso) y un video corto de verificacion.
              </p>
            </div>
            {statusBadge(status)}
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200 text-sm">
              {error}
            </div>
          )}

          {isLocked && status && <StatusPanel status={status} reviewNote={reviewNote ?? undefined} />}

          {canUseWizard && (
            <div className="mt-6">
              <KycIntro
                status={status}
                requestId={requestId}
                missingDocs={missingDocs}
                reviewNote={reviewNote}
                loading={loading}
                onStart={handleStart}
              />
            </div>
          )}
        </div>
      </div>

      <KycWizardModal
        open={wizardOpen}
        missingDocs={missingDocs}
        reviewNote={status === "NEED_CORRECTION" ? reviewNote : null}
        onClose={() => setWizardOpen(false)}
        onUpload={uploadDocument}
        onRefresh={refresh}
        onSubmit={async () => {
          await submitRequest();
        }}
        onSubmitted={() => setWizardOpen(false)}
      />
    </div>
  );
}
