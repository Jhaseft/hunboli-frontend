"use client";

import { useEffect, useState } from "react";
import { HistorialService } from "@/services/historial.service";
import DetailModal from "@/components/dashboard/withdrawals/WithdrawalDetailModal";
import { RedeemRequest } from "@/components/admin/redeem/redeem.types";
import Flecha from './Flecha';
import StatusBadge from "@/components/admin/redeem/StatusBadge";
type Meta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export default function HistorialRetiroPage() {
  const [retiros, setRetiros] = useState<RedeemRequest[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<RedeemRequest | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await HistorialService.getHistorial(page, 10);
        setRetiros(res.data);
        setMeta(res.meta);
      } catch (error) {
        console.error("Error cargando historial:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page]);

  if (loading && page === 1) {
    return (
      <div className="bg-[#0f1e33] rounded-2xl p-6 shadow-sm border border-gray-800">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1e33] rounded-2xl p-6 shadow-sm border border-gray-800">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Historial de Retiros</h2>
          <p className="text-gray-400 text-sm">Historial de solicitudes y estados de retiro.</p>
        </div>
      </div>

      {retiros.length === 0 ? (
        <div className="rounded-xl border border-gray-700 bg-[#0a1628] p-6">
          <p className="text-sm text-gray-300 text-center">No tienes retiros registrados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {retiros.map((r) => {
            const created = new Date(r.operation.createdAt).toLocaleString();
            const amount = parseFloat(r.operation.amount);

            return (
              <div key={r.id} className="rounded-2xl border border-gray-700 bg-[#0a1628] p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-200">
                      <span className="text-gray-400">Ref:</span>{" "}
                      <span className="font-semibold text-teal-200">{r.operation.referenceCode}</span>
                    </div>
                     <StatusBadge status={r.operation?.status || "UNKNOWN"} />
                  </div>

                  <div className="text-xs text-gray-400">{created}</div>
                </div>

                <div className="mt-3 grid grid-cols-[1fr_auto_1fr] gap-3 items-center">

                  
                  <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                    <p className="text-xs text-gray-400">Monto</p>
                    <p className="text-base font-semibold text-white">
                      {amount.toLocaleString()} BOBH
                    </p>
                  </div>

                 
                  <div className="flex justify-center items-center">
                    <Flecha />
                  </div>

                  <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                    <p className="text-xs text-gray-400">Monto a Recibir</p>
                    <p className="text-base font-semibold text-white">
                     {r.fiatSent
                    ? parseFloat(r.fiatSent).toLocaleString()
                    : "0"} {r.operation?.currency || "N/A"} 
                    </p>
                  </div>

                </div>


                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => setSelected(r)}
                    className="px-4 py-2 bg-teal-600 hover:bg-cyan-700 rounded-lg text-white text-sm font-medium transition-colors"
                  >
                    Ver detalle
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="mt-5 flex justify-between items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${page === 1
                ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
          >
            Anterior
          </button>

          <span className="text-sm text-gray-300">
            Página {meta.page} de {meta.totalPages}
          </span>

          <button
            disabled={page === meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${page === meta.totalPages
                ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                : "bg-teal-600 text-white hover:bg-cyan-700"
              }`}
          >
            Siguiente
          </button>
        </div>
      )}

      {selected && (
        <DetailModal
          request={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}