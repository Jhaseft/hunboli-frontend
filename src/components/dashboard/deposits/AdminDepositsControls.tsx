"use client";

import React from "react";
import type { StatusFilter } from "./types";

interface Props {
  search: string;
  filter: StatusFilter;
  canFetch: boolean;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: StatusFilter) => void;
  onRefresh: () => void;
}

export function AdminDepositsControls({
  search,
  filter,
  canFetch,
  loading,
  onSearchChange,
  onFilterChange,
  onRefresh,
}: Props) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
      <div>
        <h2 className="text-2xl font-semibold text-white">Admin • Depósitos</h2>
        <p className="text-gray-400 text-sm">Verifica comprobantes y aprueba/rechaza.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar: referencia, email, nombre, wallet..."
          className="px-4 py-2 rounded-lg bg-[#0a1628] border border-gray-700 text-gray-200 placeholder:text-gray-500 w-full sm:w-[320px]"
        />

        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as StatusFilter)}
          className="px-4 py-2 rounded-lg bg-[#0a1628] border border-gray-700 text-gray-200"
        >
          <option value="PROOF_SUBMITTED">Comprobante enviado</option>
          <option value="PENDING">Pendiente</option>
          <option value="APPROVED">Aprobado</option>
          <option value="REJECTED">Rechazado</option>
          <option value="RATE_EXPIRED">Rate expirado</option>
          <option value="MINTED">Mint realizado</option>
          <option value="ALL">Todos</option>
        </select>

        <button
          type="button"
          onClick={onRefresh}
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
    </div>
  );
}
