import { useEffect, useState } from "react";
import type { FiatCurrency } from "../types";

export function usePenRate(selectedCurrency: FiatCurrency, backendUrl?: string) {
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

  return { penToBobRate, rateStatus, rateUpdatedAt };
}
