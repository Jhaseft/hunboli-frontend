import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { handleKycGateResponse } from "@/lib/kyc-errors";
import type { FiatCurrency, DepositCreateResponse } from "../types";
import { parseMoney, calcDepositFees } from "../depositFees";
import { usePenRate } from "./usePenRate";

export { MIN_DEPOSIT_BOB } from "../depositFees";

export function useDepositForm() {
  const { token, isLoading } = useAuth();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Form state
  const [selectedCurrency, setSelectedCurrency] = useState<FiatCurrency>("BOB");
  const [amount, setAmount] = useState("");

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DepositCreateResponse | null>(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setIsQrModalOpen(false);
  };

  // PEN rate
  const { penToBobRate, rateStatus, rateUpdatedAt } = usePenRate(selectedCurrency, backendUrl);

  // Reset on currency/amount change
  useEffect(() => {
    setError(null);
    setResult(null);
    setIsModalOpen(false);
    setIsQrModalOpen(false);
  }, [selectedCurrency, amount]);

  // ESC key + scroll lock
  useEffect(() => {
    if (!isModalOpen && !isQrModalOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (isQrModalOpen) {
        setIsQrModalOpen(false);
        return;
      }
      closeModal();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isModalOpen, isQrModalOpen]);

  // Fee calculations
  const amountNum = useMemo(() => parseMoney(amount), [amount]);
  const isValidAmount = Number.isFinite(amountNum) && amountNum > 0;

  const fees = useMemo(
    () => calcDepositFees(amountNum, isValidAmount, selectedCurrency, penToBobRate),
    [amountNum, isValidAmount, selectedCurrency, penToBobRate]
  );

  const canSubmit =
    !isLoading &&
    !!token &&
    isValidAmount &&
    fees.meetsMinimum &&
    (selectedCurrency !== "PEN" || !!penToBobRate) &&
    !isSubmitting;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (isLoading) return;
    if (!token) {
      setError("Debes iniciar sesión para crear un depósito.");
      return;
    }
    if (!canSubmit) return;

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
        body: JSON.stringify({ currency: selectedCurrency, amount: amountNum }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (handleKycGateResponse(res.status, data)) return;
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

  return {
    // Form state
    selectedCurrency,
    setSelectedCurrency,
    amount,
    setAmount,
    isSubmitting,
    error,
    result,
    canSubmit,
    handleSubmit,
    // Rate info
    penToBobRate,
    rateStatus,
    rateUpdatedAt,
    // Calculated values
    isValidAmount,
    amountInBobEquivalent: fees.amountInBobEquivalent,
    meetsMinimum: fees.meetsMinimum,
    qualifiesForFixedFee: fees.qualifiesForFixedFee,
    serviceFee: fees.serviceFee,
    totalToPay: fees.totalToPay,
    receiveBOBH: fees.receiveBOBH,
    // Modals
    isModalOpen,
    isQrModalOpen,
    setIsQrModalOpen,
    closeModal,
  };
}
