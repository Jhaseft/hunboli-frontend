import React, { useEffect, useMemo, useState } from "react";

type Currency = "BOB" | "PEN";

// Fees (comisión separada)
const SERVICE_FEE_BOB = 2; // Bs
const SERVICE_FEE_PEN = 1; // S/ 

function parseMoney(input: string) {
  const normalized = input.replace(",", ".").trim();
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
}

export function DepositForm() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("BOB");
  const [amount, setAmount] = useState("");

  // Rate state (para PEN)
  const [penToBobRate, setPenToBobRate] = useState<number | null>(null);
  const [rateStatus, setRateStatus] = useState<"idle" | "loading" | "error">(
    "idle"
  );
  const [rateUpdatedAt, setRateUpdatedAt] = useState<string | null>(null);

  // Fetch rate solo cuando se elige PEN
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

  // Cálculos derivados
  const amountNum = useMemo(() => parseMoney(amount), [amount]);
  const isValidAmount = Number.isFinite(amountNum) && amountNum > 0;

  const serviceFee = useMemo(() => {
    if (!isValidAmount) return 0;
    return selectedCurrency === "BOB" ? SERVICE_FEE_BOB : SERVICE_FEE_PEN;
  }, [isValidAmount, selectedCurrency]);

  const receiveBOBH = useMemo(() => {
    if (!isValidAmount) return 0;

    if (selectedCurrency === "BOB") return amountNum; // 1:1 con BOB

    // PEN -> BOB -> BOBH (1:1 con BOB)
    if (!penToBobRate) return 0;
    return amountNum * penToBobRate;
  }, [isValidAmount, amountNum, selectedCurrency, penToBobRate]);

  const totalToPay = useMemo(() => {
    if (!isValidAmount) return 0;
    return amountNum + serviceFee;
  }, [isValidAmount, amountNum, serviceFee]);

  const canSubmit =
    isValidAmount && (selectedCurrency !== "PEN" || !!penToBobRate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    console.log("Depositar:", {
      currency: selectedCurrency,
      amount: amountNum,
      expectedBOBH: receiveBOBH,
      serviceFee,
      totalToPay,
      rateUsed: selectedCurrency === "PEN" ? penToBobRate : 1,
    });

    // Próximo paso: POST /api/deposits para crear el "deposit intent" (PENDING)
  };

  const currencyLabel = selectedCurrency === "BOB" ? "Bs" : "S/";

  return (
    <div className="bg-[#0f1e33] rounded-2xl p-6 shadow-sm border border-gray-800">
      <h2 className="text-2xl font-semibold mb-2 text-white">Depositar Fondos</h2>
      <p className="text-gray-400 mb-6">
        Deposita BOB o PEN para recibir tokens BOBH
      </p>

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
              No se pudo cargar el tipo de cambio. Revisa /api/rates y tu .env.local
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
            <p className="mt-2 text-xs text-red-300/90">
              Ingresa un monto válido mayor a 0.
            </p>
          )}
        </div>

        {/* Tipo de cambio + calculadora + resumen */}
        <div className="rounded-2xl border border-gray-700 bg-[#0a1628] p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Tipo de cambio</span>
            <span className="text-sm font-semibold text-white">
              {selectedCurrency === "BOB" && "1 BOB = 1 BOBH"}
              {selectedCurrency === "PEN" && (
                rateStatus === "loading"
                  ? "Cargando..."
                  : penToBobRate
                    ? `1 PEN = ${penToBobRate} BOB`
                    : "No disponible"
              )}
            </span>
          </div>

          {selectedCurrency === "PEN" && rateUpdatedAt && (
            <p className="mt-1 text-xs text-gray-400">
              Actualizado: {rateUpdatedAt}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-300">Recibirás</span>
            <span className="text-lg font-semibold text-teal-300">
              {receiveBOBH.toFixed(2)} BOBH
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-300">Comisión de servicio</span>
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