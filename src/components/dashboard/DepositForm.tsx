"use client";

import React from "react";
import { useDepositForm } from "@/components/dashboard/deposits/hooks/useDepositForm";
import { DepositInstructionsModal } from "@/components/dashboard/deposits/DepositInstructionsModal";
import type { FiatCurrency } from "@/components/dashboard/deposits/types";

export function DepositForm() {
  const {
    selectedCurrency,
    setSelectedCurrency,
    amount,
    setAmount,
    isSubmitting,
    error,
    result,
    canSubmit,
    handleSubmit,
    penToBobRate,
    rateStatus,
    rateUpdatedAt,
    isValidAmount,
    amountInBobEquivalent,
    meetsMinimum,
    qualifiesForFixedFee,
    serviceFee,
    totalToPay,
    receiveBOBH,
    isModalOpen,
    isQrModalOpen,
    setIsQrModalOpen,
    closeModal,
  } = useDepositForm();

  const currencyLabel = selectedCurrency === "BOB" ? "Bs" : "S/";

  return (
    <div className="bg-[#0f1e33] rounded-2xl px-6 md:p-6 shadow-sm border border-gray-800 max-h-[calc(100vh-200px)] md:max-h-none overflow-y-auto md:overflow-visible">
      <h2 className="text-2xl font-semibold mb-2 text-white">Depositar Fondos</h2>
      <p className="text-gray-400 mb-6">Depósito mínimo: 10.000 Bs</p>

      {error && (
        <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Moneda de Depósito
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(["BOB", "PEN"] as FiatCurrency[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCurrency(c)}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  selectedCurrency === c
                    ? "bg-teal-600 text-white shadow-md"
                    : "bg-[#0a1628] text-gray-300 hover:bg-[#152b47] border border-gray-700"
                }`}
              >
                {c === "BOB" ? "BOB (Bs)" : "PEN (S/)"}
              </button>
            ))}
          </div>

          {selectedCurrency === "PEN" && rateStatus === "error" && (
            <p className="mt-2 text-xs text-red-300/90">
              No se pudo cargar el tipo de cambio (revisa BACKEND_URL y /rates).
            </p>
          )}
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-3">
            Monto{selectedCurrency === "PEN" && <span className="ml-1 text-gray-400">(S/)</span>}
          </label>
          {selectedCurrency === "PEN" ? (
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium select-none">
                S/
              </span>
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 bg-[#0a1628] border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white placeholder-gray-500"
              />
            </div>
          ) : (
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium select-none">
                  Bs
              </span>
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 bg-[#0a1628] border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white placeholder-gray-500"
              />
            </div>
          )}

          {!isValidAmount && amount.length > 0 && (
            <p className="mt-2 text-xs text-red-300/90">Ingresa un monto válido mayor a 0.</p>
          )}

          {isValidAmount && !meetsMinimum && (
            <p className="mt-2 text-xs text-amber-300/90">
              Depósito mínimo: 10.000 Bs (equivalente). Actualmente:{" "}
              {amountInBobEquivalent.toFixed(2)} Bs.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-gray-700 bg-[#0a1628] p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Tipo de cambio</span>
            <span className="text-sm font-semibold text-white">
              {selectedCurrency === "BOB" && "1 BOB = 1 BOBH"}
              {selectedCurrency === "PEN" &&
                (rateStatus === "loading"
                  ? "Cargando..."
                  : penToBobRate
                  ? `1 PEN = ${penToBobRate} BOB`
                  : "No disponible")}
            </span>
          </div>

          {selectedCurrency === "PEN" && rateUpdatedAt && (
            <p className="mt-1 text-xs text-gray-400">Actualizado: {rateUpdatedAt}</p>
          )}

          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-300">Recibirás</span>
            <span className="text-lg font-semibold text-teal-300">
              {receiveBOBH.toFixed(2)} BOBH
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-300">
              {!meetsMinimum
                ? "Comisión"
                : qualifiesForFixedFee
                ? "Comisión fija"
                : "Comisión (0.1%)"}
            </span>
            <span className="text-sm font-semibold text-white">
              {serviceFee.toFixed(2)} {currencyLabel}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-gray-700 pt-3">
            <span className="text-sm text-gray-300">Total a pagar</span>
            <span className="text-lg font-semibold text-white">
              {totalToPay.toFixed(2)} {currencyLabel}
            </span>
          </div>

          <p className="mt-3 text-xs text-gray-400">
            La comisión es separada y no afecta el 1:1: el monto aprobado se acredita como BOBH.
          </p>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full py-3.5 rounded-lg font-medium transition-colors shadow-md ${
            canSubmit
              ? "bg-teal-600 text-white hover:bg-cyan-700"
              : "bg-gray-700/40 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Creando depósito..." : "Confirmar Transacción"}
        </button>
      </form>

      {isModalOpen && result && (
        <DepositInstructionsModal
          result={result}
          isQrModalOpen={isQrModalOpen}
          onOpenQr={() => setIsQrModalOpen(true)}
          onCloseQr={() => setIsQrModalOpen(false)}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
