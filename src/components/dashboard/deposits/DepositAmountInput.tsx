"use client";

import React from "react";
import type { FiatCurrency } from "./types";

interface Props {
  selectedCurrency: FiatCurrency;
  amount: string;
  isValidAmount: boolean;
  meetsMinimum: boolean;
  amountInBobEquivalent: number;
  onChange: (value: string) => void;
}

export function DepositAmountInput({
  selectedCurrency,
  amount,
  isValidAmount,
  meetsMinimum,
  amountInBobEquivalent,
  onChange,
}: Props) {
  const prefix = selectedCurrency === "PEN" ? "S/" : "Bs";

  return (
    <div>
      <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-3">
        Monto{selectedCurrency === "PEN" && <span className="ml-1 text-gray-400">(S/)</span>}
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium select-none">
          {prefix}
        </span>
        <input
          type="text"
          id="amount"
          value={amount}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className="w-full pl-10 pr-4 py-3 bg-[#0a1628] border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white placeholder-gray-500"
        />
      </div>

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
  );
}
