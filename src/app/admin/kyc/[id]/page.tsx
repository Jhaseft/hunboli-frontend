"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminKycService, AdminKycDetailResponse } from "@/services/adminKyc.service";
import type { KycStatus } from "@/types/auth.types";

export default function AdminKycDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params?.id as string;

  const [data, setData] = useState<AdminKycDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [correctionNote, setCorrectionNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDetail = async () => {
    if (!requestId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await adminKycService.getOne(requestId);
      setData(res);
      setNote(res.request.reviewNote ?? "");
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "No se pudo cargar el detalle.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [requestId]);

  const status = data?.request.status as KycStatus | undefined;

  const docsByType = useMemo(() => {
    type DocumentItem = AdminKycDetailResponse["documents"][number];
    const map = new Map<string, DocumentItem>();
    data?.documents.forEach((doc) => map.set(doc.docType, doc));
    return map;
  }, [data]);

  const handleApprove = async () => {
    if (!requestId) return;
    setActionLoading(true);
    try {
      await adminKycService.approve(requestId, note || undefined);
      await fetchDetail();
      alert("KYC aprobado.");
      router.push("/admin/kyc");
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "No se pudo aprobar.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!requestId) return;
    setActionLoading(true);
    try {
      await adminKycService.reject(requestId, note || undefined);
      await fetchDetail();
      alert("KYC rechazado.");
      router.push("/admin/kyc");
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "No se pudo rechazar.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCorrection = async () => {
    if (!requestId) return;
    if (!correctionNote.trim()) {
      alert("Ingresa un motivo de corrección.");
      return;
    }
    setActionLoading(true);
    try {
      await adminKycService.requestCorrection(requestId, correctionNote.trim());
      await fetchDetail();
      alert("Corrección solicitada.");
      router.push("/admin/kyc");
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "No se pudo solicitar corrección.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-[#0f1e33] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Detalle KYC</h1>
            <p className="text-gray-400 text-sm">Solicitud: {requestId}</p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/admin/kyc")}
            className="px-3 py-2 rounded-lg text-sm bg-[#0a1628] border border-gray-700 text-gray-200 hover:bg-[#152b47]"
          >
            Volver
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-200 text-sm">
            {error}
          </div>
        )}

        {loading || !data ? (
          <div className="py-10 text-gray-400">Cargando...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl border border-gray-800 bg-[#0a1628] p-4">
                <p className="text-xs text-gray-400">Usuario</p>
                <p className="text-white mt-1">
                  {data.request.user.firstName} {data.request.user.lastName}
                </p>
                <p className="text-xs text-gray-500 mt-1">{data.request.user.email}</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-[#0a1628] p-4">
                <p className="text-xs text-gray-400">Estado</p>
                <p className="text-white mt-1">{data.request.status}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Creado: {new Date(data.request.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-[#0a1628] p-4">
                <p className="text-xs text-gray-400">Revisión</p>
                <p className="text-white mt-1">{data.request.reviewedAt ? "Revisado" : "Pendiente"}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {data.request.reviewedAt ? new Date(data.request.reviewedAt).toLocaleString() : "—"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(["ID_FRONT", "ID_BACK", "LIVENESS_VIDEO"] as const).map((docType) => {
                const doc = docsByType.get(docType);
                return (
                  <div key={docType} className="rounded-xl border border-gray-800 bg-[#0a1628] p-4">
                    <p className="text-sm text-gray-200 mb-2">{docType}</p>
                    {!doc ? (
                      <p className="text-xs text-gray-500">No subido.</p>
                    ) : doc.resourceType === "video" ? (
                      <video controls className="w-full rounded-lg border border-gray-800" src={doc.signedUrl} />
                    ) : (
                      <img src={doc.signedUrl} alt={docType} className="w-full rounded-lg border border-gray-800" />
                    )}
                    {doc?.uploadedAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        Subido: {new Date(doc.uploadedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-800 bg-[#0a1628] p-4">
                <p className="text-sm text-gray-200 mb-2">Nota (opcional)</p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg bg-[#071225] border border-gray-700 p-3 text-sm text-white"
                  placeholder="Nota interna"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={actionLoading || status === "VERIFIED"}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      actionLoading || status === "VERIFIED"
                        ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                        : "bg-teal-600 text-white hover:bg-teal-700"
                    }`}
                  >
                    Aprobar
                  </button>
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={actionLoading}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      actionLoading
                        ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    Rechazar
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-gray-800 bg-[#0a1628] p-4">
                <p className="text-sm text-gray-200 mb-2">Solicitar corrección</p>
                <textarea
                  value={correctionNote}
                  onChange={(e) => setCorrectionNote(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg bg-[#071225] border border-gray-700 p-3 text-sm text-white"
                  placeholder="Detalle requerido"
                />
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleCorrection}
                    disabled={actionLoading}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      actionLoading
                        ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                        : "bg-amber-600 text-white hover:bg-amber-700"
                    }`}
                  >
                    Pedir corrección
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
