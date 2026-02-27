"use client";

import { useCallback, useEffect, useState } from "react";
import type { KycStatus } from "@/types/auth.types";
import { kycService } from "@/services/kyc.service";
import { useAuth } from "@/context/AuthContext";

const STATUS_LABELS: Record<KycStatus, { label: string; className: string }> = {
  VERIFIED: { label: "Verificado", className: "bg-green-600/20 text-green-300 border border-green-500/30" },
  PENDING: { label: "En revisión", className: "bg-yellow-600/20 text-yellow-300 border border-yellow-500/30" },
  NEED_CORRECTION: { label: "Corrección requerida", className: "bg-amber-600/20 text-amber-300 border border-amber-500/30" },
  REJECTED: { label: "Rechazado", className: "bg-red-600/20 text-red-300 border border-red-500/30" },
  UNVERIFIED: { label: "Pendiente", className: "bg-yellow-600/20 text-yellow-300 border border-yellow-500/30" },
  BLACKLISTED: { label: "Bloqueado", className: "bg-red-600/20 text-red-300 border border-red-500/30" },
};

export default function KycPage() {
  const { token, isLoading } = useAuth();
  const [status, setStatus] = useState<KycStatus>("UNVERIFIED");
  const [sessionExpiresAt, setSessionExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await kycService.getMe();
      setStatus(data.kycStatus ?? "UNVERIFIED");
      setSessionExpiresAt(data.kycSessionExpiresAt ?? null);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "No se pudo cargar tu estado KYC.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading || !token) return;
    refresh();
  }, [isLoading, token, refresh]);

  const handleStart = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const res = await kycService.start();
      if (res?.status === "verified") {
        setStatus("VERIFIED");
        return;
      }
      if (res?.redirect_url) {
        window.location.assign(res.redirect_url);
        return;
      }
      setError("No se pudo iniciar la verificación.");
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "No se pudo iniciar la verificación.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 px-4">
        <div className="text-gray-400 text-sm">Cargando...</div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 px-4">
        <div className="bg-[#0f1e33] border border-gray-800 rounded-2xl p-6 max-w-md text-center">
          <h1 className="text-xl font-semibold text-white">Inicia sesión</h1>
          <p className="text-gray-400 text-sm mt-2">Necesitas iniciar sesión para gestionar tu KYC.</p>
        </div>
      </div>
    );
  }

  const badge = STATUS_LABELS[status];
  const canStart = status === "UNVERIFIED" || status === "PENDING";

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#0f1e33] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-white">Verificación de identidad</h1>
              <p className="text-gray-400 text-sm mt-1">
                Completa tu KYC en el proveedor externo para activar tu cuenta.
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.className}`}>
              {badge.label}
            </span>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200 text-sm">
              {error}
            </div>
          )}

          {status === "VERIFIED" && (
            <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200 text-sm">
              Verificado ✅ Gracias por completar tu identidad.
            </div>
          )}

          {status === "BLACKLISTED" && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200 text-sm">
              Tu cuenta está bloqueada. Contacta a soporte.
            </div>
          )}

          {canStart && (
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleStart}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  loading ? "bg-gray-700/40 text-gray-400 cursor-not-allowed" : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                {loading ? "Iniciando..." : "Verificar identidad"}
              </button>
              <p className="text-xs text-gray-400">
                Si la sesión expira, vuelve a iniciar la verificación.
              </p>
              {sessionExpiresAt && (
                <p className="text-xs text-gray-500">
                  Sesión expira: {new Date(sessionExpiresAt).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
