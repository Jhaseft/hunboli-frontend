import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type {
  AdminDepositItem,
  AdminDepositsResponse,
  DepositStatus,
  StatusFilter,
} from "../types";
import { copyToClipboard } from "../depositUtils";

export type Toast = { type: "ok" | "err"; msg: string };

export function useAdminDeposits() {
  const { token, isLoading } = useAuth();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [filter, setFilter] = useState<StatusFilter>("PROOF_SUBMITTED");
  const [search, setSearch] = useState("");

  const [items, setItems] = useState<AdminDepositItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [actingId, setActingId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const [preview, setPreview] = useState<AdminDepositItem | null>(null);
  const [correctionTarget, setCorrectionTarget] = useState<AdminDepositItem | null>(null);
  const [correctionNote, setCorrectionNote] = useState<string>("");
  const [submittingCorrection, setSubmittingCorrection] = useState(false);

  const canFetch = useMemo(
    () => !!backendUrl && !!token && !isLoading,
    [backendUrl, token, isLoading]
  );

  const fetchPage = useCallback(
    async (cursor?: string | null, reset = false) => {
      if (!backendUrl) {
        setError("NEXT_PUBLIC_BACKEND_URL no está configurado.");
        return;
      }
      if (!token) {
        setError("Debes iniciar sesión.");
        return;
      }

      const isFirst = reset || !cursor;

      try {
        if (isFirst) setLoading(true);
        else setLoadingMore(true);

        setError(null);

        const params = new URLSearchParams();
        params.set("limit", "10");
        params.set("status", filter);
        if (!isFirst && cursor) params.set("cursor", cursor);

        const res = await fetch(`${backendUrl}/admin/deposits?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const data = (await res.json().catch(() => null)) as AdminDepositsResponse | null;

        if (!res.ok || !data) {
          const msg =
            (data as any)?.message ||
            (res.status === 403 ? "No autorizado (requiere ADMIN/OPERATOR)." : "No se pudo cargar.");
          setError(typeof msg === "string" ? msg : "No se pudo cargar.");
          return;
        }

        if (isFirst) setItems(data.items ?? []);
        else setItems((prev) => [...prev, ...(data.items ?? [])]);

        setNextCursor(data.nextCursor ?? null);
        setHasMore(!!data.hasMore);
      } catch {
        setError("Error de red. Revisa backend y CORS.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [backendUrl, token, filter]
  );

  useEffect(() => {
    if (!canFetch) return;
    fetchPage(null, true);
  }, [canFetch, filter, fetchPage]);

  const decide = async (id: string, action: "APPROVE" | "REJECT") => {
    if (!backendUrl || !token) return;

    setActingId(id);
    setToast(null);

    try {
      const res = await fetch(`${backendUrl}/admin/deposits/${id}/decision`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = (data && (data.message || data.error)) || "No se pudo actualizar.";
        setToast({ type: "err", msg: typeof msg === "string" ? msg : "No se pudo actualizar." });
        return;
      }

      const newStatus: DepositStatus = data.status;
      const shouldRemove =
        filter !== "ALL" && newStatus !== (filter as unknown as DepositStatus);

      setItems((prev) =>
        shouldRemove
          ? prev.filter((d) => d.id !== id)
          : prev.map((d) =>
              d.id === id
                ? {
                    ...d,
                    status: newStatus,
                    validatedById: data.validatedById ?? d.validatedById,
                    validatedAt: data.validatedAt ?? d.validatedAt,
                  }
                : d
            )
      );

      setPreview((p) => {
        if (!p || p.id !== id) return p;
        if (shouldRemove) return null;
        return {
          ...p,
          status: newStatus,
          validatedById: data.validatedById ?? p.validatedById,
          validatedAt: data.validatedAt ?? p.validatedAt,
        };
      });

      setToast({
        type: "ok",
        msg: action === "APPROVE" ? "Depósito aprobado." : "Depósito rechazado.",
      });
    } catch {
      setToast({ type: "err", msg: "Error de red al actualizar." });
    } finally {
      setActingId(null);
    }
  };

  const submitCorrection = async () => {
    if (!backendUrl || !token || !correctionTarget) return;
    const note = correctionNote.trim();
    if (note.length < 5) {
      alert("La nota debe tener al menos 5 caracteres.");
      return;
    }

    try {
      setSubmittingCorrection(true);
      setActingId(correctionTarget.id);

      const res = await fetch(
        `${backendUrl}/admin/deposits/${correctionTarget.id}/request-correction`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ note }),
        }
      );

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "No se pudo solicitar corrección");
      }

      const data = await res.json();

      setItems((prev) => {
        if (filter === "PROOF_SUBMITTED") {
          return prev.filter((x) => x.id !== correctionTarget.id);
        }
        return prev.map((x) => {
          if (x.id !== correctionTarget.id) return x;
          return {
            ...x,
            status: data.status,
            reviewNote: data.reviewNote ?? note,
            reviewedById: data.reviewedById ?? x.reviewedById,
            reviewedAt: data.reviewedAt ?? new Date().toISOString(),
          };
        });
      });

      setPreview((p) => {
        if (!p || p.id !== correctionTarget.id) return p;
        return {
          ...p,
          status: data.status,
          reviewNote: data.reviewNote ?? note,
          reviewedById: data.reviewedById ?? p.reviewedById,
          reviewedAt: data.reviewedAt ?? new Date().toISOString(),
        };
      });

      setCorrectionTarget(null);
      setCorrectionNote("");
    } catch (e: any) {
      alert(e?.message ?? "Error solicitando corrección");
    } finally {
      setSubmittingCorrection(false);
      setActingId(null);
    }
  };

  const filteredBySearch = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;

    return items.filter((d) => {
      const name = `${d.user.firstName} ${d.user.lastName}`.toLowerCase();
      return (
        d.referenceCode.toLowerCase().includes(q) ||
        d.user.email.toLowerCase().includes(q) ||
        name.includes(q) ||
        (d.user.walletAddress ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, search]);

  const onCopy = async (label: string, value: string) => {
    const ok = await copyToClipboard(value);
    setToast(
      ok
        ? { type: "ok", msg: `${label} copiado ✅` }
        : { type: "err", msg: `No se pudo copiar ${label}.` }
    );
  };

  return {
    filter,
    setFilter,
    search,
    setSearch,
    filteredBySearch,
    loading,
    loadingMore,
    hasMore,
    nextCursor,
    canFetch,
    fetchPage,
    error,
    toast,
    actingId,
    decide,
    correctionTarget,
    setCorrectionTarget,
    correctionNote,
    setCorrectionNote,
    submittingCorrection,
    submitCorrection,
    preview,
    setPreview,
    onCopy,
  };
}
