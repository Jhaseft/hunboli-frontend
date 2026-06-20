"use client";

import React from "react";
import { useAdminDeposits } from "./hooks/useAdminDeposits";
import { AdminDepositCard } from "./AdminDepositCard";
import { ProofPreviewModal } from "./ProofPreviewModal";
import { RequestCorrectionModal } from "./RequestCorrectionModal";
import { AdminDepositsControls } from "./AdminDepositsControls";

export function AdminDeposits() {
  const {
    filter,
    setFilter,
    search,
    setSearch,
    filteredBySearch,
    loading,
    loadingMore,
    hasMore,
    nextCursor,
    canFetch,
    fetchPage,
    error,
    toast,
    actingId,
    decide,
    correctionTarget,
    setCorrectionTarget,
    correctionNote,
    setCorrectionNote,
    submittingCorrection,
    submitCorrection,
    preview,
    setPreview,
    onCopy,
  } = useAdminDeposits();

  return (
    <div className="bg-[#0f1e33] rounded-2xl p-6 shadow-sm border border-gray-800">

      <AdminDepositsControls
        search={search}
        filter={filter}
        canFetch={canFetch}
        loading={loading}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onRefresh={() => fetchPage(null, true)}
      />

      {/* FEEDBACK */}
      {toast && (
        <div
          className={`mb-4 rounded-xl border p-4 ${
            toast.type === "ok"
              ? "border-teal-500/30 bg-teal-500/10 text-teal-200"
              : "border-red-500/30 bg-red-500/10 text-red-200"
          }`}
        >
          <p className="text-sm">{toast.msg}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {loading && filteredBySearch.length === 0 && (
        <div className="rounded-xl border border-gray-700 bg-[#0a1628] p-6">
          <p className="text-sm text-gray-300">Cargando depósitos...</p>
        </div>
      )}

      {!loading && !error && filteredBySearch.length === 0 && (
        <div className="rounded-xl border border-gray-700 bg-[#0a1628] p-6">
          <p className="text-sm text-gray-300">No hay resultados para este filtro/búsqueda.</p>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {filteredBySearch.map((d) => (
          <AdminDepositCard
            key={d.id}
            deposit={d}
            actingId={actingId}
            submittingCorrection={submittingCorrection}
            onApprove={(id) => decide(id, "APPROVE")}
            onReject={(id) => decide(id, "REJECT")}
            onRequestCorrection={(deposit) => {
              setCorrectionTarget(deposit);
              setCorrectionNote(deposit.reviewNote ?? "");
            }}
            onPreview={setPreview}
            onCopy={onCopy}
          />
        ))}
      </div>

      {/* PAGINATION */}
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

      {/* MODALS */}
      {preview && (
        <ProofPreviewModal
          deposit={preview}
          actingId={actingId}
          onApprove={(id) => decide(id, "APPROVE")}
          onReject={(id) => decide(id, "REJECT")}
          onCopy={onCopy}
          onClose={() => setPreview(null)}
        />
      )}

      {correctionTarget && (
        <RequestCorrectionModal
          target={correctionTarget}
          note={correctionNote}
          onNoteChange={setCorrectionNote}
          onSubmit={submitCorrection}
          onClose={() => {
            setCorrectionTarget(null);
            setCorrectionNote("");
          }}
          submitting={submittingCorrection}
        />
      )}

    </div>
  );
}
