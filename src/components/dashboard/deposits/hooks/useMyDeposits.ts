"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { MyDepositItem, MyDepositsResponse } from "../types";

export function useMyDeposits() {
  const { token, isLoading } = useAuth();

  const [items, setItems] = useState<MyDepositItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const canFetch = useMemo(
    () => !!backendUrl && !!token && !isLoading,
    [backendUrl, token, isLoading]
  );

  const fetchPage = useCallback(
    async (cursor?: string | null) => {
      if (!backendUrl) {
        setError("NEXT_PUBLIC_BACKEND_URL no está configurado.");
        return;
      }
      if (!token) {
        setError("Debes iniciar sesión para ver tus depósitos.");
        return;
      }

      const isFirst = !cursor;

      try {
        isFirst ? setLoading(true) : setLoadingMore(true);
        setError(null);

        const params = new URLSearchParams();
        params.set("limit", "10");
        if (cursor) params.set("cursor", cursor);

        const res = await fetch(
          `${backendUrl}/deposits/my?${params.toString()}`,
          { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
        );

        const data = (await res.json().catch(() => null)) as MyDepositsResponse | null;

        if (!res.ok || !data) {
          const msg =
            (data as any)?.message ||
            (res.status === 401
              ? "Sesión expirada. Vuelve a iniciar sesión."
              : "No se pudo cargar el historial.");
          setError(typeof msg === "string" ? msg : "No se pudo cargar el historial.");
          return;
        }

        if (isFirst) {
          setItems(data.items ?? []);
        } else {
          setItems((prev) => [...prev, ...(data.items ?? [])]);
        }

        setNextCursor(data.nextCursor ?? null);
        setHasMore(!!data.hasMore);
      } catch {
        setError("Error de red. Revisa que el backend esté activo y CORS habilitado.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [backendUrl, token]
  );

  const refetch = useCallback(() => fetchPage(null), [fetchPage]);

  useEffect(() => {
    if (!canFetch) return;
    fetchPage(null);
  }, [canFetch, fetchPage]);

  return {
    items,
    nextCursor,
    hasMore,
    loading,
    loadingMore,
    error,
    canFetch,
    fetchPage,
    refetch,
  };
}
