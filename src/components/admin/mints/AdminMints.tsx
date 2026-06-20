"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  AdminDepositReviewCard,
  AdminDepositItem,
  DepositStatus,
} from "./AdminDepositReviewCard";
import { DepositReviewDrawer } from "./DepositReviewDrawer";

type AdminDepositsResponse = {
  items: AdminDepositItem[];
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
  filter: string;
};

type StatusFilter =
  | "ALL"
  | "PENDING"
  | "PROOF_SUBMITTED"
  | "NEED_CORRECTION"
  | "RATE_EXPIRED"
  | "APPROVED"
  | "REJECTED"
  | "MINTED";

type DecisionAction = "APPROVE" | "REJECT";

function isImageMime(mime?: string | null) {
  if (!mime) return false;
  return ["image/jpeg", "image/png", "image/webp"].includes(mime);
}

function isPdfMime(mime?: string | null) {
  return mime === "application/pdf";
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function statusBadgeClass(status: DepositStatus) {
  switch (status) {
    case "PENDING":
      return "border border-amber-500/30 bg-amber-500/10 text-amber-200";
    case "PROOF_SUBMITTED":
      return "border border-cyan-500/30 bg-cyan-500/10 text-cyan-200";
    case "NEED_CORRECTION":
      return "border border-amber-500/30 bg-amber-500/10 text-amber-200";
    case "APPROVED":
      return "border border-teal-500/30 bg-teal-500/10 text-teal-200";
    case "MINTED":
      return "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
    case "REJECTED":
      return "border border-red-500/30 bg-red-500/10 text-red-200";
    case "RATE_EXPIRED":
      return "border border-gray-500/30 bg-gray-500/10 text-gray-200";
    default:
      return "border border-gray-500/30 bg-gray-500/10 text-gray-200";
  }
}

function statusLabel(status: DepositStatus) {
  switch (status) {
    case "PENDING":
      return "Pendiente";
    case "PROOF_SUBMITTED":
      return "Comprobante enviado";
    case "NEED_CORRECTION":
      return "Requiere correccion";
    case "RATE_EXPIRED":
      return "Rate expirado";
    case "APPROVED":
      return "Aprobado";
    case "REJECTED":
      return "Rechazado";
    case "MINTED":
      return "Mint realizado";
    default:
      return status;
  }
}

function fmt(n: number, decimals = 2) {
  return Number.isFinite(n) ? n.toFixed(decimals) : "0.00";
}

function formatDecimalString(value: string, maxDecimals = 6) {
  if (!value) return "0";
  const normalized = value.trim();
  const [intPart, decPart = ""] = normalized.split(".");
  if (maxDecimals <= 0 || decPart.length === 0) return intPart || "0";
  const trimmed = decPart.slice(0, maxDecimals);
  return trimmed ? `${intPart || "0"}.${trimmed}` : intPart || "0";
}

export function AdminMints() {
  const { token, isLoading } = useAuth();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [includeReviewExtras, setIncludeReviewExtras] = useState(false);
  const [search, setSearch] = useState("");

  const [items, setItems] = useState<AdminDepositItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toast, setToast] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({ open: false, type: "success", message: "" });

  const [preview, setPreview] = useState<AdminDepositItem | null>(null);
  const [drawerItem, setDrawerItem] = useState<AdminDepositItem | null>(null);
  const [correctionTarget, setCorrectionTarget] =
    useState<AdminDepositItem | null>(null);
  const [correctionNote, setCorrectionNote] = useState<string>("");
  const [submittingCorrection, setSubmittingCorrection] = useState(false);

  const canFetch = useMemo(
    () => !!backendUrl && !!token && !isLoading,
    [backendUrl, token, isLoading]
  );

  const serverStatus: StatusFilter = "ALL";

  const fetchPage = useCallback(
    async (cursor?: string | null, reset = false) => {
      if (!backendUrl) {
        setError("NEXT_PUBLIC_BACKEND_URL no esta configurado.");
        return null;
      }
      if (!token) {
        setError("Debes iniciar sesion.");
        return null;
      }

      const isFirst = reset || !cursor;

      try {
        if (isFirst) setLoading(true);
        else setLoadingMore(true);

        setError(null);

        const params = new URLSearchParams();
        params.set("limit", "10");
        params.set("status", serverStatus);
        if (!isFirst && cursor) params.set("cursor", cursor);

        const res = await fetch(
          `${backendUrl}/admin/deposits?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }
        );

        const data = (await res.json().catch(() => null)) as
          | AdminDepositsResponse
          | null;

        if (!res.ok || !data) {
          const msg =
            (data as any)?.message ||
            (res.status === 403
              ? "No autorizado (requiere ADMIN/OPERATOR)."
              : "No se pudo cargar.");
          setError(typeof msg === "string" ? msg : "No se pudo cargar.");
          return null;
        }

        if (isFirst) setItems(data.items ?? []);
        else setItems((prev) => [...prev, ...(data.items ?? [])]);

        setNextCursor(data.nextCursor ?? null);
        setHasMore(!!data.hasMore);
        return data;
      } catch {
        setError("Error de red. Revisa backend y CORS.");
        return null;
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [backendUrl, token, serverStatus]
  );

  useEffect(() => {
    if (!canFetch) return;
    fetchPage(null, true);
  }, [canFetch, serverStatus, fetchPage]);

  const refreshList = useCallback(async () => {
    const data = await fetchPage(null, true);
    if (!data) return;
    if (preview) {
      const updated = data.items?.find((d) => d.id === preview.id) ?? null;
      setPreview(updated);
    }
    if (drawerItem) {
      const updatedDrawer =
        data.items?.find((d) => d.id === drawerItem.id) ?? null;
      setDrawerItem(updatedDrawer);
    }
  }, [fetchPage, preview, drawerItem]);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
  }, []);

  const showToast = useCallback(
    (type: "success" | "error", message: string) => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
      setToast({ open: true, type, message });
      toastTimerRef.current = setTimeout(() => {
        setToast((prev) => ({ ...prev, open: false }));
        toastTimerRef.current = null;
      }, 3000);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const decide = async (id: string, action: DecisionAction) => {
    if (!backendUrl || !token) return;

    setActingId(id);
    closeToast();

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
        showToast(
          "error",
          typeof msg === "string" ? msg : "No se pudo actualizar."
        );
        return;
      }

      const newStatus: DepositStatus = data.status;

      setItems((prev) =>
        prev.map((d) =>
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
        return {
          ...p,
          status: newStatus,
          validatedById: data.validatedById ?? p.validatedById,
          validatedAt: data.validatedAt ?? p.validatedAt,
        };
      });

      setDrawerItem((p) => {
        if (!p || p.id !== id) return p;
        return {
          ...p,
          status: newStatus,
          validatedById: data.validatedById ?? p.validatedById,
          validatedAt: data.validatedAt ?? p.validatedAt,
        };
      });

      showToast(
        "success",
        action === "APPROVE" ? "Deposito aprobado." : "Deposito rechazado."
      );
      refreshList();
    } catch {
      showToast("error", "Error de red al actualizar.");
    } finally {
      setActingId(null);
    }
  };

  const requestCorrection = async (
    targetId: string,
    note: string,
    onSuccess?: () => void
  ) => {
    if (!backendUrl || !token) return;
    const trimmed = note.trim();
    if (trimmed.length < 5) {
      showToast("error", "La nota debe tener al menos 5 caracteres.");
      return;
    }

    try {
      setSubmittingCorrection(true);
      setActingId(targetId);
      closeToast();

      const res = await fetch(
        `${backendUrl}/admin/deposits/${targetId}/request-correction`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ note: trimmed }),
        }
      );

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "No se pudo solicitar correccion");
      }

      const data = await res.json();

      setItems((prev) =>
        prev.map((x) => {
          if (x.id !== targetId) return x;
          return {
            ...x,
            status: data.status,
            reviewNote: data.reviewNote ?? trimmed,
            reviewedById: data.reviewedById ?? x.reviewedById,
            reviewedAt: data.reviewedAt ?? new Date().toISOString(),
          };
        })
      );

      setPreview((p) => {
        if (!p || p.id !== targetId) return p;
        return {
          ...p,
          status: data.status,
          reviewNote: data.reviewNote ?? trimmed,
          reviewedById: data.reviewedById ?? p.reviewedById,
          reviewedAt: data.reviewedAt ?? new Date().toISOString(),
        };
      });

      setDrawerItem((p) => {
        if (!p || p.id !== targetId) return p;
        return {
          ...p,
          status: data.status,
          reviewNote: data.reviewNote ?? trimmed,
          reviewedById: data.reviewedById ?? p.reviewedById,
          reviewedAt: data.reviewedAt ?? new Date().toISOString(),
        };
      });

      onSuccess?.();
      showToast("success", "Correccion solicitada.");
      refreshList();
    } catch (e: any) {
      showToast("error", e?.message ?? "Error solicitando correccion");
    } finally {
      setSubmittingCorrection(false);
      setActingId(null);
    }
  };

  async function submitCorrection() {
    if (!correctionTarget) return;
    await requestCorrection(correctionTarget.id, correctionNote, () => {
      setCorrectionTarget(null);
      setCorrectionNote("");
    });
  }

  const proposeMint = async (id: string) => {
    if (!backendUrl || !token) return;

    setActingId(id);
    closeToast();

    try {
      const res = await fetch(`${backendUrl}/admin/deposits/${id}/propose-mint`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        const msg = (data && (data.message || data.error)) || "No se pudo proponer el mint.";
        showToast(
          "error",
          typeof msg === "string" ? msg : "No se pudo proponer el mint."
        );
        return;
      }

      setItems((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                safeTxHash: data.safeTxHash ?? d.safeTxHash,
                safeProposedAt: data.safeProposedAt ?? d.safeProposedAt,
              }
            : d
        )
      );

      setPreview((p) => {
        if (!p || p.id !== id) return p;
        return {
          ...p,
          safeTxHash: data.safeTxHash ?? p.safeTxHash,
          safeProposedAt: data.safeProposedAt ?? p.safeProposedAt,
        };
      });

      setDrawerItem((p) => {
        if (!p || p.id !== id) return p;
        return {
          ...p,
          safeTxHash: data.safeTxHash ?? p.safeTxHash,
          safeProposedAt: data.safeProposedAt ?? p.safeProposedAt,
        };
      });

      showToast("success", "Propuesta creada en Safe.");
      refreshList();
    } catch {
      showToast("error", "Error de red al proponer el mint.");
    } finally {
      setActingId(null);
    }
  };

  const filteredByQueue = useMemo(() => {
    const allowed = new Set<DepositStatus>(["PROOF_SUBMITTED", "APPROVED"]);
    if (includeReviewExtras) {
      allowed.add("NEED_CORRECTION");
      allowed.add("RATE_EXPIRED");
    }

    return items.filter((d) => {
      if (preview?.id && d.id === preview.id) return true;
      if (drawerItem?.id && d.id === drawerItem.id) return true;
      if (!allowed.has(d.status)) return false;
      return true;
    });
  }, [items, includeReviewExtras, preview, drawerItem]);

  const filteredBySearch = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return filteredByQueue;

    return filteredByQueue.filter((d) => {
      const name = `${d.user.firstName} ${d.user.lastName}`.toLowerCase();
      return (
        d.referenceCode.toLowerCase().includes(q) ||
        d.user.email.toLowerCase().includes(q) ||
        name.includes(q) ||
        (d.user.walletAddress ?? "").toLowerCase().includes(q)
      );
    });
  }, [filteredByQueue, search]);

  const orderedItems = useMemo(() => {
    const order: DepositStatus[] = [
      "PROOF_SUBMITTED",
      "NEED_CORRECTION",
      "RATE_EXPIRED",
      "APPROVED",
    ];
    const rank = new Map(order.map((status, index) => [status, index]));

    return [...filteredBySearch].sort((a, b) => {
      const rankA = rank.get(a.status) ?? 99;
      const rankB = rank.get(b.status) ?? 99;
      if (rankA !== rankB) return rankA - rankB;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredBySearch]);

  const onCopy = async (label: string, value: string) => {
    const ok = await copyToClipboard(value);
    if (ok) {
      showToast("success", `${label} copiado.`);
    } else {
      showToast("error", `No se pudo copiar ${label}.`);
    }
  };

  const previewRules = useMemo(() => {
    if (!preview) return null;
    const isMinted =
      preview.status === "MINTED" || !!preview.mintedAt || !!preview.mintTxHash;
    return {
      isMinted,
      canApprove:
        preview.status === "PROOF_SUBMITTED" &&
        !!preview.proofUrl &&
        !(preview.currency === "PEN" && preview.isRateExpired) &&
        !isMinted,
      canReject:
        !isMinted &&
        (preview.status === "PROOF_SUBMITTED" ||
          preview.status === "NEED_CORRECTION"),
      canRequestCorrection:
        preview.status === "PROOF_SUBMITTED" && !!preview.proofUrl && !isMinted,
      canPropose:
        preview.status === "APPROVED" &&
        !!preview.user.walletAddress &&
        !preview.safeTxHash,
    };
  }, [preview]);

  const filterLabel = useMemo(() => {
    return includeReviewExtras
      ? "PROOF_SUBMITTED + NEED_CORRECTION + RATE_EXPIRED + APPROVED"
      : "PROOF_SUBMITTED + APPROVED";
  }, [includeReviewExtras]);

  return (
    <div className="bg-[#0f1e33] rounded-2xl p-6 shadow-sm border border-gray-800">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Depositos y Mint
          </h2>
          <p className="text-gray-400 text-sm">
            Revisa comprobantes y, si procede, propone el mint en la multisig.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIncludeReviewExtras((prev) => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                includeReviewExtras
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
                  : "border-gray-700 bg-[#0a1628] text-gray-300 hover:bg-[#152b47]"
              }`}
            >
              Incluir observados y vencidos
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar: referencia, email, nombre, wallet..."
            className="px-4 py-2 rounded-lg bg-[#0a1628] border border-gray-700 text-gray-200 placeholder:text-gray-500 w-full sm:w-[320px]"
          />

          <button
            type="button"
            onClick={() => refreshList()}
            disabled={!canFetch || loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              !canFetch || loading
                ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                : "bg-[#0a1628] text-gray-200 hover:bg-[#152b47] border border-gray-700"
            }`}
          >
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
      </div>

      {toast.open && (
        <div className="fixed right-6 top-6 z-[70] w-[320px]">
          <div
            className={`rounded-xl border px-4 py-3 shadow-lg backdrop-blur ${
              toast.type === "success"
                ? "border-teal-500/30 bg-teal-500/10 text-teal-200"
                : "border-red-500/30 bg-red-500/10 text-red-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 text-sm">{toast.message}</div>
              <button
                type="button"
                onClick={closeToast}
                className="text-xs text-gray-300 hover:text-white"
                aria-label="Cerrar"
              >
                x
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {loading && items.length === 0 && (
        <div className="rounded-xl border border-gray-700 bg-[#0a1628] p-6">
          <p className="text-sm text-gray-300">Cargando solicitudes...</p>
        </div>
      )}

      {!loading && !error && filteredBySearch.length === 0 && (
        <div className="rounded-xl border border-gray-700 bg-[#0a1628] p-6">
          <p className="text-sm text-gray-300">
            No hay resultados para este filtro/busqueda.
          </p>
        </div>
      )}

      <div className="md:hidden space-y-3">
        {orderedItems.map((d) => {
          const total = Number(d.totalAmount);
          const userName = `${d.user.firstName} ${d.user.lastName}`.trim();
          const dateLabel = new Date(
            d.proofUploadedAt ?? d.createdAt
          ).toLocaleDateString();

          return (
            <div
              key={d.id}
              className="rounded-2xl border border-gray-700 bg-[#0a1628] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusBadgeClass(
                      d.status
                    )}`}
                  >
                    {statusLabel(d.status)}
                  </span>

                  {d.currency === "PEN" && d.isRateExpired && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold border border-red-500/30 bg-red-500/10 text-red-200">
                      Rate vencido
                    </span>
                  )}

                  <span className="text-xs text-gray-200">
                    <span className="text-gray-400">Ref:</span>{" "}
                    <span className="font-semibold text-teal-200">
                      {d.referenceCode}
                    </span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onCopy("Referencia", d.referenceCode)}
                  className="shrink-0 px-2 py-1 rounded-md text-[11px] border border-gray-700 bg-[#071225] text-gray-200 hover:bg-[#152b47]"
                >
                  Copiar
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-xs text-gray-400 truncate">
                  {userName || "Usuario"} • {d.user.email}
                </p>
                <span className="text-[11px] text-gray-500">{dateLabel}</span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="text-xs text-gray-200">
                  <p>
                    <span className="text-gray-400">Total:</span>{" "}
                    {fmt(total)} {d.currency === "BOB" ? "Bs" : "S/"}
                  </p>
                  <p className="text-teal-300">
                    <span className="text-gray-400">Recibe:</span>{" "}
                    {formatDecimalString(d.expectedBOBH, 6)} BOBH
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setDrawerItem(d)}
                  className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-cyan-700 transition-colors"
                >
                  Ver
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden md:block space-y-4">
        {orderedItems.map((d) => (
          <AdminDepositReviewCard
            key={d.id}
            item={d}
            actingId={actingId}
            onApprove={(id) => decide(id, "APPROVE")}
            onReject={(id) => decide(id, "REJECT")}
            onOpenCorrection={(item) => {
              setCorrectionTarget(item);
              setCorrectionNote(item.reviewNote ?? "");
            }}
            onProposeMint={(id) => proposeMint(id)}
            onPreview={(item) => setPreview(item)}
            onCopy={onCopy}
          />
        ))}
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={() => fetchPage(nextCursor)}
          disabled={!canFetch || !hasMore || loadingMore}
          className={`w-full py-3 rounded-lg font-medium transition-colors shadow-md ${
            !canFetch || !hasMore || loadingMore
              ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
              : "bg-teal-600 text-white hover:bg-cyan-700"
          }`}
        >
          {loadingMore ? "Cargando..." : hasMore ? "Cargar mas" : "No hay mas resultados"}
        </button>
      </div>

      <DepositReviewDrawer
        open={!!drawerItem}
        item={drawerItem}
        actingId={actingId}
        submittingCorrection={submittingCorrection}
        onClose={() => setDrawerItem(null)}
        onApprove={(id) => decide(id, "APPROVE")}
        onReject={(id) => decide(id, "REJECT")}
        onRequestCorrection={(id, note) => requestCorrection(id, note)}
        onProposeMint={(id) => proposeMint(id)}
        onPreview={(item) => setPreview(item)}
        onCopy={onCopy}
      />

      {preview && previewRules && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl border border-gray-700 bg-[#0f1e33] shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div>
                <p className="text-white font-semibold">Vista previa</p>
                <p className="text-xs text-gray-400">
                  Ref: <span className="text-teal-300 font-semibold">{preview.referenceCode}</span> - {preview.user.email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreview(null)}
                className="px-3 py-2 rounded-lg text-sm border border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
              >
                Cerrar
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 rounded-2xl border border-gray-800 bg-[#071225] p-3">
                {!preview.proofUrl ? (
                  <p className="text-sm text-gray-300">Sin comprobante.</p>
                ) : isImageMime(preview.proofMimeType) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview.proofUrl}
                    alt="Comprobante"
                    className="w-full max-h-[70vh] object-contain rounded-xl border border-gray-800 bg-[#0a1628]"
                  />
                ) : isPdfMime(preview.proofMimeType) ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-200">PDF cargado.</p>
                    <a
                      href={preview.proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#0a1628] text-teal-300 hover:bg-[#152b47]"
                    >
                      Abrir PDF en nueva pestana
                    </a>
                    <div className="rounded-xl border border-gray-800 overflow-hidden">
                      <iframe
                        src={preview.proofUrl}
                        className="w-full h-[70vh] max-h-[70vh]"
                        title="PDF preview"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-200">Archivo cargado.</p>
                    <a
                      href={preview.proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#0a1628] text-teal-300 hover:bg-[#152b47]"
                    >
                      Abrir archivo
                    </a>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-gray-800 bg-[#071225] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(preview.status)}`}>
                    {statusLabel(preview.status)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onCopy("Referencia", preview.referenceCode)}
                    className="px-3 py-2 rounded-lg text-xs font-medium border border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
                  >
                    Copiar ref
                  </button>
                </div>

                <div className="mt-3 text-sm text-gray-200">
                  <p>
                    <span className="text-gray-400">Total:</span> {fmt(Number(preview.totalAmount))} {preview.currency === "BOB" ? "Bs" : "S/"}
                  </p>
                  <p className="mt-1">
                    <span className="text-gray-400">Recibe:</span> <span className="text-teal-300 font-semibold">{fmt(Number(preview.expectedBOBH))} BOBH</span>
                  </p>
                </div>

                {preview.currency === "PEN" && preview.rateUsed && preview.rateExpiresAt && (
                  <p className="mt-2 text-xs text-gray-400">
                    Rate: <span className="text-gray-200">1 PEN = {Number(preview.rateUsed).toFixed(4)} BOB</span>
                    <br />
                    Vence: <span className="text-gray-200">{new Date(preview.rateExpiresAt).toLocaleString()}</span>
                  </p>
                )}

                {preview.currency === "PEN" && preview.isRateExpired && (
                  <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                    <p className="text-xs text-red-200">Rate vencido: no aprobar.</p>
                  </div>
                )}

                {preview.reviewNote && (
                  <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                    <p className="text-xs text-amber-200 font-semibold">Revision solicitada</p>
                    <p className="text-sm text-amber-100 mt-1 whitespace-pre-line">
                      {preview.reviewNote}
                    </p>
                    {preview.reviewedAt && (
                      <p className="text-xs text-amber-200/70 mt-2">
                        {new Date(preview.reviewedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={() => decide(preview.id, "APPROVE")}
                    disabled={actingId === preview.id || !previewRules.canApprove}
                    className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                      actingId === preview.id || !previewRules.canApprove
                        ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                        : "bg-teal-600 text-white hover:bg-cyan-700"
                    }`}
                  >
                    {actingId === preview.id ? "Procesando..." : "Aprobar"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCorrectionTarget(preview);
                      setCorrectionNote(preview.reviewNote ?? "");
                    }}
                    disabled={actingId === preview.id || !previewRules.canRequestCorrection}
                    className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                      actingId === preview.id || !previewRules.canRequestCorrection
                        ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                        : "bg-amber-600 text-white hover:bg-amber-700"
                    }`}
                  >
                    Solicitar correccion
                  </button>

                  <button
                    type="button"
                    onClick={() => decide(preview.id, "REJECT")}
                    disabled={actingId === preview.id || !previewRules.canReject}
                    className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                      actingId === preview.id || !previewRules.canReject
                        ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {actingId === preview.id ? "Procesando..." : "Rechazar"}
                  </button>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => proposeMint(preview.id)}
                    disabled={actingId === preview.id || !previewRules.canPropose}
                    className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                      actingId === preview.id || !previewRules.canPropose
                        ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                        : "bg-sky-600 text-white hover:bg-sky-700"
                    }`}
                  >
                    {actingId === preview.id ? "Procesando..." : "Proponer mint (Safe)"}
                  </button>
                </div>

                {preview.safeTxHash && (
                  <div className="mt-4 rounded-xl border border-gray-800 bg-[#0a1628] p-3">
                    <p className="text-xs text-gray-400">Propuesto</p>
                    {preview.safeProposedAt && (
                      <p className="mt-1 text-[11px] text-gray-400">
                        {new Date(preview.safeProposedAt).toLocaleString()}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-200 break-all">{preview.safeTxHash}</p>
                  </div>
                )}

                {previewRules.isMinted && (
                  <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                    <p className="text-xs text-emerald-300 font-semibold">Minted</p>
                    {preview.mintedAt && (
                      <p className="mt-1 text-[11px] text-emerald-200/70">
                        {new Date(preview.mintedAt).toLocaleString()}
                      </p>
                    )}
                    {preview.mintTxHash && (
                      <p className="mt-1 text-xs text-emerald-100 break-all">{preview.mintTxHash}</p>
                    )}
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  {preview.proofUrl && (
                    <a
                      href={preview.proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center px-3 py-2 rounded-lg text-sm border border-gray-700 bg-[#0a1628] text-teal-300 hover:bg-[#152b47]"
                    >
                      Abrir
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setPreview(null)}
                    className="flex-1 px-3 py-2 rounded-lg text-sm border border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {correctionTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-800 bg-[#071225] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white font-semibold">Solicitar correccion</p>
                <p className="text-xs text-gray-400 mt-1">
                  Ref: {correctionTarget.referenceCode} - {correctionTarget.user.email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!submittingCorrection) {
                    setCorrectionTarget(null);
                    setCorrectionNote("");
                  }
                }}
                className="text-gray-400 hover:text-white"
              >
                X
              </button>
            </div>

            <label className="block mt-4 text-xs text-gray-300">
              Motivo / indicaciones
            </label>
            <textarea
              value={correctionNote}
              onChange={(e) => setCorrectionNote(e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-xl border border-gray-800 bg-[#0B1B34] p-3 text-sm text-white outline-none focus:border-amber-500/60"
              placeholder="Ej: No se ve el monto ni la fecha. Envia otra foto mas clara."
            />

            <div className="mt-4 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setCorrectionTarget(null);
                  setCorrectionNote("");
                }}
                disabled={submittingCorrection}
                className="px-4 py-2 rounded-lg bg-gray-700/40 text-gray-200 hover:bg-gray-700/60 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={submitCorrection}
                disabled={submittingCorrection || correctionNote.trim().length < 5}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
              >
                {submittingCorrection ? "Enviando..." : "Enviar correccion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
