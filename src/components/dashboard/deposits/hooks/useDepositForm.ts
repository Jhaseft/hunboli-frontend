import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { handleKycGateResponse } from "@/lib/kyc-errors";
import type { FiatCurrency, DepositCreateResponse } from "../types";

const FEE_RATE = 0.001; // 0.1%
const FIXED_FEE_BOB = 100; // 100 Bs
const FIXED_FEE_MIN_BOB = 10_000;
const FIXED_FEE_MAX_BOB = 100_000;
export const MIN_DEPOSIT_BOB = 10_000;

function parseMoney(input: string): number {
  const normalized = input.replace(",", ".").trim();
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
}

export function useDepositForm() {
  const { token, isLoading } = useAuth();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Form state
  const [selectedCurrency, setSelectedCurrency] = useState<FiatCurrency>("BOB");
  const [amount, setAmount] = useState("");

  // PEN rate
  const [penToBobRate, setPenToBobRate] = useState<number | null>(null);
  const [rateStatus, setRateStatus] = useState<"idle" | "loading" | "error">("idle");
  const [rateUpdatedAt, setRateUpdatedAt] = useState<string | null>(null);

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

  // PEN rate fetch
  useEffect(() => {
    let cancelled = false;

    if (selectedCurrency !== "PEN") {
      setPenToBobRate(null);
      setRateUpdatedAt(null);
      setRateStatus("idle");
      return;
    }

    setRateStatus("loading");

    fetch(`${backendUrl}/rates`, { cache: "no-store" })
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
  }, [selectedCurrency, backendUrl]);

  // Fee calculations
  const amountNum = useMemo(() => parseMoney(amount), [amount]);
  const isValidAmount = Number.isFinite(amountNum) && amountNum > 0;

  const amountInBobEquivalent = useMemo(() => {
    if (!isValidAmount) return 0;
    if (selectedCurrency === "BOB") return amountNum;
    if (!penToBobRate) return 0;
    return amountNum * penToBobRate;
  }, [isValidAmount, amountNum, selectedCurrency, penToBobRate]);

  const meetsMinimum = amountInBobEquivalent >= MIN_DEPOSIT_BOB;

  const qualifiesForFixedFee =
    amountInBobEquivalent >= FIXED_FEE_MIN_BOB &&
    amountInBobEquivalent < FIXED_FEE_MAX_BOB;

  const serviceFee = useMemo(() => {
    if (!isValidAmount) return 0;
    if (amountInBobEquivalent < MIN_DEPOSIT_BOB) return 0;
    if (qualifiesForFixedFee) {
      if (selectedCurrency === "PEN") {
        if (!penToBobRate) return 0;
        return FIXED_FEE_BOB / penToBobRate;
      }
      return FIXED_FEE_BOB;
    }
    return amountNum * FEE_RATE;
  }, [
    isValidAmount,
    amountNum,
    amountInBobEquivalent,
    qualifiesForFixedFee,
    selectedCurrency,
    penToBobRate,
  ]);

  const totalToPay = useMemo(() => {
    if (!isValidAmount) return 0;
    return amountNum + serviceFee;
  }, [isValidAmount, amountNum, serviceFee]);

  const receiveBOBH = useMemo(() => {
    if (!isValidAmount) return 0;
    if (selectedCurrency === "BOB") return amountNum;
    if (!penToBobRate) return 0;
    return amountNum * penToBobRate;
  }, [isValidAmount, amountNum, selectedCurrency, penToBobRate]);

  const canSubmit =
    !isLoading &&
    !!token &&
    isValidAmount &&
    meetsMinimum &&
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
    amountInBobEquivalent,
    meetsMinimum,
    qualifiesForFixedFee,
    serviceFee,
    totalToPay,
    receiveBOBH,
    // Modals
    isModalOpen,
    isQrModalOpen,
    setIsQrModalOpen,
    closeModal,
  };
}
