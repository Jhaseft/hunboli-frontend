"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { adminKycService, AdminKycListItem } from "@/services/adminKyc.service";
import type { KycStatus } from "@/types/auth.types";

const STATUS_OPTIONS: Array<{ label: string; value: KycStatus | "ALL" }> = [
  { label: "Todos", value: "ALL" },
  { label: "Pendiente", value: "UNVERIFIED" },
  { label: "En revisión", value: "PENDING" },
  { label: "Corrección", value: "NEED_CORRECTION" },
  { label: "Rechazado", value: "REJECTED" },
  { label: "Verificado", value: "VERIFIED" },
];

export default function AdminKycPage() {
  const router = useRouter();
  const [items, setItems] = useState<AdminKycListItem[]>([]);
  const [status, setStatus] = useState<KycStatus | "ALL">("PENDING");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminKycService.list({
        status: status === "ALL" ? undefined : status,
        page,
        limit,
      });
      setItems(res.items ?? []);
      setTotalPages(res.totalPages ?? 1);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "No se pudo cargar KYC.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [status, page]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const rows = useMemo(() => items ?? [], [items]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-[#0f1e33] border border-gray-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">KYC · Admin</h1>
            <p className="text-gray-400 text-sm">Revisa solicitudes KYC y documentos.</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value as KycStatus | "ALL");
              }}
              className="px-3 py-2 rounded-lg bg-[#0a1628] border border-gray-700 text-gray-200 text-sm"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={fetchList}
              className="px-3 py-2 rounded-lg text-sm bg-[#0a1628] border border-gray-700 text-gray-200 hover:bg-[#152b47]"
            >
              Actualizar
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-200 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-10 text-gray-400">Cargando...</div>
        ) : rows.length === 0 ? (
          <div className="py-10 text-gray-400">No hay solicitudes.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="text-left py-3 px-2">Request</th>
                  <th className="text-left py-3 px-2">Usuario</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Faltantes</th>
                  <th className="text-left py-3 px-2">Creado</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.requestId}
                    className="border-b border-gray-800/50 hover:bg-white/5 cursor-pointer"
                    onClick={() => router.push(`/admin/kyc/${row.requestId}`)}
                  >
                    <td className="py-3 px-2 text-gray-200">{row.requestId.slice(0, 8)}...</td>
                    <td className="py-3 px-2 text-gray-300">
                      <div>{row.user.firstName} {row.user.lastName}</div>
                      <div className="text-xs text-gray-500">{row.user.email}</div>
                    </td>
                    <td className="py-3 px-2 text-gray-200">{row.status}</td>
                    <td className="py-3 px-2 text-gray-400">{row.missingDocs?.length ?? 0}</td>
                    <td className="py-3 px-2 text-gray-400">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`px-3 py-2 rounded-lg text-sm ${
              !canPrev ? "bg-gray-700/40 text-gray-400 cursor-not-allowed" : "bg-[#0a1628] border border-gray-700 text-gray-200 hover:bg-[#152b47]"
            }`}
          >
            Anterior
          </button>
          <span className="text-xs text-gray-400">Página {page} / {totalPages}</span>
          <button
            type="button"
            disabled={!canNext}
            onClick={() => setPage((p) => p + 1)}
            className={`px-3 py-2 rounded-lg text-sm ${
              !canNext ? "bg-gray-700/40 text-gray-400 cursor-not-allowed" : "bg-[#0a1628] border border-gray-700 text-gray-200 hover:bg-[#152b47]"
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
