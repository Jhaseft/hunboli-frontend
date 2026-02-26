"use client";

import React from "react";
import type { FiatCurrency } from "./types";

interface Props {
  selectedCurrency: FiatCurrency;
  rateStatus: "idle" | "loading" | "error";
  onChange: (currency: FiatCurrency) => void;
}

export function DepositCurrencySelector({ selectedCurrency, rateStatus, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-3">
        Moneda de Depósito
      </label>
      <div className="grid grid-cols-2 gap-3">
        {(["BOB", "PEN"] as FiatCurrency[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
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
  );
}
