"use client";

import React from "react";
import { useMyDeposits } from "./hooks/useMyDeposits";
import { MyDepositCard } from "./MyDepositCard";

export function MyDeposits() {
  const {
    items,
    nextCursor,
    hasMore,
    loading,
    loadingMore,
    error,
    canFetch,
    fetchPage,
    refetch,
  } = useMyDeposits();

  return (
    <div className="bg-[#0f1e33] rounded-2xl p-6 shadow-sm border border-gray-800">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Mis Depósitos</h2>
          <p className="text-gray-400 text-sm">
            Historial de solicitudes, comprobantes y estados.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchPage(null)}
          disabled={!canFetch || loading}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            !canFetch || loading
              ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
              : "bg-[#0a1628] text-gray-200 hover:bg-[#152b47] border border-gray-700"
          }`}
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {loading && items.length === 0 && (
        <div className="rounded-xl border border-gray-700 bg-[#0a1628] p-6">
          <p className="text-sm text-gray-300">Cargando depósitos...</p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-xl border border-gray-700 bg-[#0a1628] p-6">
          <p className="text-sm text-gray-300">Aún no tienes depósitos.</p>
        </div>
      )}

      <div className="space-y-3">
        {items.map((d) => (
          <MyDepositCard key={d.id} deposit={d} onUploaded={refetch} />
        ))}
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={() => fetchPage(nextCursor)}
          disabled={!canFetch || !hasMore || loadingMore}
          className={`w-full py-3 rounded-lg font-medium transition-colors shadow-md ${
            !canFetch || !hasMore || loadingMore
              ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
              : "bg-teal-600 text-white hover:bg-cyan-700"
          }`}
        >
          {loadingMore ? "Cargando..." : hasMore ? "Cargar más" : "No hay más resultados"}
        </button>
      </div>
    </div>
  );
}
