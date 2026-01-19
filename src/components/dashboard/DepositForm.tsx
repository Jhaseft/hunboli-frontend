"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Currency = "BOB" | "PEN";

const FEE_RATE = 0.001; // 0.1%
const MIN_DEPOSIT_BOB = 10_000; // 10 mil Bs

function parseMoney(input: string) {
  const normalized = input.replace(",", ".").trim();
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
}

type DepositInstructions = {
  title: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  note: string;
};

type DepositCreateResponse = {
  depositId: string;
  status: string;
  referenceCode: string;
  currency: Currency;
  amount: number;
  feeRate: number;
  serviceFee: number;
  totalAmount: number;
  rateUsed: number;
  expectedBOBH: number;
  instructions: DepositInstructions;
};

export function DepositForm() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("BOB");
  const [amount, setAmount] = useState("");

  // Rate state (PEN -> BOB) solo para mostrar en UI/calculadora
  const [penToBobRate, setPenToBobRate] = useState<number | null>(null);
  const [rateStatus, setRateStatus] = useState<"idle" | "loading" | "error">(
    "idle"
  );
  const [rateUpdatedAt, setRateUpdatedAt] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DepositCreateResponse | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { token, isLoading } = useAuth();

  const closeModal = () => {
    setIsModalOpen(false);
    // Si quieres limpiar el resultado al cerrar, descomenta:
    // setResult(null);
  };

  // Cuando cambias moneda o monto, limpiamos resultado/errores para no confundir
  useEffect(() => {
    setError(null);
    setResult(null);
    setIsModalOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrency, amount]);

  // Cerrar con ESC + bloquear scroll
  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

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

  // BOBH a recibir (calculadora UI)
  const receiveBOBH = useMemo(() => {
    if (!isValidAmount) return 0;

    if (selectedCurrency === "BOB") return amountNum;

    if (!penToBobRate) return 0;
    return amountNum * penToBobRate;
  }, [isValidAmount, amountNum, selectedCurrency, penToBobRate]);

  const needsRate = selectedCurrency === "PEN";
  const hasRate = !!penToBobRate;

  const canSubmit =
    !isLoading &&
    !!token &&
    isValidAmount &&
    meetsMinimum &&
    (!needsRate || hasRate) &&
    !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (isLoading) return;
    if (!token) {
      setError("Debes iniciar sesión para crear un depósito.");
      return;
    }
    if (!canSubmit) return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      setError("NEXT_PUBLIC_BACKEND_URL no está configurado en el frontend.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${backendUrl}/deposits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currency: selectedCurrency,
          amount: amountNum,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          (res.status === 401
            ? "Sesión expirada. Vuelve a iniciar sesión."
            : "No se pudo crear el depósito.");
        setError(typeof msg === "string" ? msg : "No se pudo crear el depósito.");
        return;
      }

      setResult(data as DepositCreateResponse);
      setIsModalOpen(true);
    } catch {
      setError("Error de red. Revisa que el backend esté activo y CORS habilitado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currencyLabel = selectedCurrency === "BOB" ? "Bs" : "S/";

  return (
    <div className="bg-[#0f1e33] rounded-2xl p-6 shadow-sm border border-gray-800">
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

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-3">
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

      {/* Modal */}
      {isModalOpen && result && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onMouseDown={closeModal}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-teal-500/30 bg-[#0f1e33] shadow-xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-800 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Depósito creado</h3>
                <p className="text-sm text-gray-300">
                  Referencia:{" "}
                  <span className="font-semibold text-teal-200">{result.referenceCode}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-gray-700 bg-[#0a1628] px-3 py-1.5 text-sm text-gray-200 hover:bg-[#152b47]"
              >
                Cerrar
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-700 bg-[#0a1628] p-4">
                  <p className="text-xs text-gray-400 mb-1">Total a pagar</p>
                  <p className="text-base font-semibold text-white">
                    {Number(result.totalAmount).toFixed(2)}{" "}
                    {result.currency === "BOB" ? "Bs" : "S/"}
                  </p>

                  <p className="mt-2 text-xs text-gray-400 mb-1">Recibirás (estimado)</p>
                  <p className="text-base font-semibold text-teal-300">
                    {Number(result.expectedBOBH).toFixed(2)} BOBH
                  </p>
                </div>

                <div className="rounded-xl border border-gray-700 bg-[#0a1628] p-4">
                  <p className="text-xs text-gray-400 mb-2">{result.instructions.title}</p>
                  <p className="text-sm text-gray-200">
                    <span className="text-gray-400">Banco:</span> {result.instructions.bankName}
                  </p>
                  <p className="text-sm text-gray-200">
                    <span className="text-gray-400">Titular:</span>{" "}
                    {result.instructions.accountName}
                  </p>
                  <p className="text-sm text-gray-200">
                    <span className="text-gray-400">Cuenta:</span>{" "}
                    {result.instructions.accountNumber}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-200">{result.instructions.note}</p>

              <p className="mt-2 text-xs text-gray-400">
                Estado actual: <span className="text-gray-200">{result.status}</span>
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-gray-800 px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(result.referenceCode).catch(() => {});
                }}
                className="rounded-lg border border-gray-700 bg-[#0a1628] px-4 py-2 text-sm text-gray-200 hover:bg-[#152b47]"
              >
                Copiar referencia
              </button>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
