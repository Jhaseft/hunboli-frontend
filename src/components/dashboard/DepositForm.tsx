"use client";

import React, { useEffect, useMemo, useState } from "react";

type Currency = "BOB" | "PEN";

const FEE_RATE = 0.001; // 0.1%
const MIN_DEPOSIT_BOB = 10_000; // 10 mil Bs

function parseMoney(input: string) {
  const normalized = input.replace(",", ".").trim();
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
}

export function DepositForm() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("BOB");
  const [amount, setAmount] = useState("");

  // Rate state (PEN -> BOB)
  const [penToBobRate, setPenToBobRate] = useState<number | null>(null);
  const [rateStatus, setRateStatus] = useState<"idle" | "loading" | "error">("idle");
  const [rateUpdatedAt, setRateUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (selectedCurrency !== "PEN") {
      setPenToBobRate(null);
      setRateUpdatedAt(null);
      setRateStatus("idle");
      return;
    }

    setRateStatus("loading");

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rates`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Error al obtener rates");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;

        const rate = Number(data.pen_to_bob);
        if (!Number.isFinite(rate) || rate <= 0) {
          setPenToBobRate(null);
          setRateStatus("error");
          return;
        }

        setPenToBobRate(rate);
        setRateUpdatedAt(typeof data.updatedAt === "string" ? data.updatedAt : null);
        setRateStatus("idle");
      })
      .catch(() => {
        if (cancelled) return;
        setRateStatus("error");
        setPenToBobRate(null);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCurrency]);

  const amountNum = useMemo(() => parseMoney(amount), [amount]);
  const isValidAmount = Number.isFinite(amountNum) && amountNum > 0;

  // Equivalente en BOB (para validar mínimo)
  const amountInBobEquivalent = useMemo(() => {
    if (!isValidAmount) return 0;

    if (selectedCurrency === "BOB") return amountNum;

    // PEN -> BOB usando tasa actual
    if (!penToBobRate) return 0;
    return amountNum * penToBobRate;
  }, [isValidAmount, amountNum, selectedCurrency, penToBobRate]);

  const meetsMinimum = amountInBobEquivalent >= MIN_DEPOSIT_BOB;

  // Comisión 0.1% (en la moneda del depósito)
  const serviceFee = useMemo(() => {
    if (!isValidAmount) return 0;
    return amountNum * FEE_RATE;
  }, [isValidAmount, amountNum]);

  // Total a pagar (monto + comisión)
  const totalToPay = useMemo(() => {
    if (!isValidAmount) return 0;
    return amountNum + serviceFee;
  }, [isValidAmount, amountNum, serviceFee]);

  // BOBH a recibir
  const receiveBOBH = useMemo(() => {
    if (!isValidAmount) return 0;

    if (selectedCurrency === "BOB") return amountNum; // 1:1

    if (!penToBobRate) return 0;
    return amountNum * penToBobRate; // PEN -> BOB -> BOBH (1:1 con BOB)
  }, [isValidAmount, amountNum, selectedCurrency, penToBobRate]);

  const needsRate = selectedCurrency === "PEN";
  const hasRate = !!penToBobRate;

  const canSubmit =
    isValidAmount &&
    meetsMinimum &&
    (!needsRate || hasRate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    // IMPORTANTE: en el backend debes recalcular fee, mínimo y expectedBOBH para evitar manipulación.
    console.log("Crear depósito:", {
      currency: selectedCurrency,
      amount: amountNum,
      feeRate: FEE_RATE,
      serviceFee,
      totalToPay,
      expectedBOBH: receiveBOBH,
      rateUsed: selectedCurrency === "PEN" ? penToBobRate : 1,
      minDepositBob: MIN_DEPOSIT_BOB,
    });

    // Próximo paso real:
    // POST `${NEXT_PUBLIC_BACKEND_URL}/deposits` con { currency, amount }
    // y el backend devuelve referenceCode + instrucciones.
  };

  const currencyLabel = selectedCurrency === "BOB" ? "Bs" : "S/";

  return (
    <div className="bg-[#0f1e33] rounded-2xl p-6 shadow-sm border border-gray-800">
      <h2 className="text-2xl font-semibold mb-2 text-white">Depositar Fondos</h2>
      <p className="text-gray-400 mb-6">Depósito mínimo: 10.000 Bs</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Moneda */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Moneda de Depósito
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedCurrency("BOB")}
              className={`py-3 px-4 rounded-lg font-medium transition-all ${
                selectedCurrency === "BOB"
                  ? "bg-teal-600 text-white shadow-md"
                  : "bg-[#0a1628] text-gray-300 hover:bg-[#152b47] border border-gray-700"
              }`}
            >
              BOB (Bs)
            </button>

            <button
              type="button"
              onClick={() => setSelectedCurrency("PEN")}
              className={`py-3 px-4 rounded-lg font-medium transition-all ${
                selectedCurrency === "PEN"
                  ? "bg-teal-600 text-white shadow-md"
                  : "bg-[#0a1628] text-gray-300 hover:bg-[#152b47] border border-gray-700"
              }`}
            >
              PEN (S/)
            </button>
          </div>

          {selectedCurrency === "PEN" && rateStatus === "error" && (
            <p className="mt-2 text-xs text-red-300/90">
              No se pudo cargar el tipo de cambio (revisa BACKEND_URL y /rates).
            </p>
          )}
        </div>

        {/* Monto */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-300 mb-3"
          >
            Monto
          </label>
          <input
            type="text"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-3 bg-[#0a1628] border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white placeholder-gray-500"
          />

          {!isValidAmount && amount.length > 0 && (
            <p className="mt-2 text-xs text-red-300/90">Ingresa un monto válido mayor a 0.</p>
          )}

          {isValidAmount && !meetsMinimum && (
            <p className="mt-2 text-xs text-amber-300/90">
              Depósito mínimo: 10.000 Bs (equivalente). Actualmente: {amountInBobEquivalent.toFixed(2)} Bs.
            </p>
          )}
        </div>

        {/* Tipo de cambio + calculadora + resumen */}
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
            <span className="text-sm text-gray-300">Comisión (0.1%)</span>
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

        {/* Confirmar */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full py-3.5 rounded-lg font-medium transition-colors shadow-md ${
            canSubmit
              ? "bg-teal-600 text-white hover:bg-cyan-700"
              : "bg-gray-700/40 text-gray-400 cursor-not-allowed"
          }`}
        >
          Confirmar Transacción
        </button>
      </form>
    </div>
  );
}
