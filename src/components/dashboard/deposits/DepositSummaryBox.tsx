"use client";

import React from "react";
import type { FiatCurrency } from "./types";

interface Props {
  selectedCurrency: FiatCurrency;
  penToBobRate: number | null;
  rateStatus: "idle" | "loading" | "error";
  rateUpdatedAt: string | null;
  receiveBOBH: number;
  serviceFee: number;
  totalToPay: number;
  meetsMinimum: boolean;
  qualifiesForFixedFee: boolean;
}

export function DepositSummaryBox({
  selectedCurrency,
  penToBobRate,
  rateStatus,
  rateUpdatedAt,
  receiveBOBH,
  serviceFee,
  totalToPay,
  meetsMinimum,
  qualifiesForFixedFee,
}: Props) {
  const currencyLabel = selectedCurrency === "BOB" ? "Bs" : "S/";

  return (
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
  );
}
