"use client";

import React from "react";
import { useDepositForm } from "@/components/dashboard/deposits/hooks/useDepositForm";
import { DepositInstructionsModal } from "@/components/dashboard/deposits/DepositInstructionsModal";
import { DepositCurrencySelector } from "@/components/dashboard/deposits/DepositCurrencySelector";
import { DepositAmountInput } from "@/components/dashboard/deposits/DepositAmountInput";
import { DepositSummaryBox } from "@/components/dashboard/deposits/DepositSummaryBox";

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
        <DepositCurrencySelector
          selectedCurrency={selectedCurrency}
          rateStatus={rateStatus}
          onChange={setSelectedCurrency}
        />

        <DepositAmountInput
          selectedCurrency={selectedCurrency}
          amount={amount}
          isValidAmount={isValidAmount}
          meetsMinimum={meetsMinimum}
          amountInBobEquivalent={amountInBobEquivalent}
          onChange={setAmount}
        />

        <DepositSummaryBox
          selectedCurrency={selectedCurrency}
          penToBobRate={penToBobRate}
          rateStatus={rateStatus}
          rateUpdatedAt={rateUpdatedAt}
          receiveBOBH={receiveBOBH}
          serviceFee={serviceFee}
          totalToPay={totalToPay}
          meetsMinimum={meetsMinimum}
          qualifiesForFixedFee={qualifiesForFixedFee}
        />

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
