"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type DepositStatus =
  | "PENDING"
  | "PROOF_SUBMITTED"
  | "NEED_CORRECTION"
  | "RATE_EXPIRED"
  | "APPROVED"
  | "REJECTED"
  | "MINTED";

type FiatCurrency = "BOB" | "PEN";

type AdminDepositItem = {
  id: string;
  referenceCode: string;
  currency: FiatCurrency;
  status: DepositStatus;
  isRateExpired: boolean;

  amount: string;
  totalAmount: string;
  expectedBOBH: string;

  rateUsed: string | null;
  rateSource: string | null;
  rateQuotedAt: string | null;
  rateExpiresAt: string | null;

  proofUrl: string | null;
  proofUploadedAt: string | null;
  proofFileName: string | null;
  proofMimeType: string | null;

  reviewNote: string | null;
  reviewedById: string | null;
  reviewedAt: string | null;

  validatedById: string | null;
  validatedAt: string | null;

  safeTxHash: string | null;
  safeProposedAt: string | null;

  mintTxHash: string | null;
  mintedAt: string | null;

  createdAt: string;

  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    country: "BOLIVIA" | "PERU";
    kycStatus: string;
    walletAddress: string | null;
  };
};

type AdminDepositsResponse = {
  items: AdminDepositItem[];
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
  filter: string;
};

type StatusFilter =
  | "PROOF_SUBMITTED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "RATE_EXPIRED"
  | "MINTED"
  | "ALL";

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
      return "Requiere corrección";
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

export function AdminDeposits() {
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
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

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

      // Si el filtro no es ALL, y el nuevo status ya no pertenece, lo removemos del listado (más limpio)
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

      // si estaba abierto el preview del que cambió, actualízalo/cierra según el caso
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

  const proposeMint = async (id: string) => {
    if (!backendUrl || !token) return;

    setActingId(id);
    setToast(null);

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
        setToast({ type: "err", msg: typeof msg === "string" ? msg : "No se pudo proponer el mint." });
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

      setToast({ type: "ok", msg: "Propuesta creada en Safe." });
    } catch {
      setToast({ type: "err", msg: "Error de red al proponer el mint." });
    } finally {
      setActingId(null);
    }
  };

  async function submitCorrection() {
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
  }

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
    setToast(ok ? { type: "ok", msg: `${label} copiado ✅` } : { type: "err", msg: `No se pudo copiar ${label}.` });
  };

  return (
    <div className="bg-[#0f1e33] rounded-2xl p-6 shadow-sm border border-gray-800">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-semibold text-white">Admin • Depósitos</h2>
          <p className="text-gray-400 text-sm">Verifica comprobantes y aprueba/rechaza.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar: referencia, email, nombre, wallet..."
            className="px-4 py-2 rounded-lg bg-[#0a1628] border border-gray-700 text-gray-200 placeholder:text-gray-500 w-full sm:w-[320px]"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as StatusFilter)}
            className="px-4 py-2 rounded-lg bg-[#0a1628] border border-gray-700 text-gray-200"
          >
            <option value="PROOF_SUBMITTED">Comprobante enviado</option>
            <option value="PENDING">Pendiente</option>
            <option value="APPROVED">Aprobado</option>
            <option value="REJECTED">Rechazado</option>
            <option value="RATE_EXPIRED">Rate expirado</option>
            <option value="MINTED">Mint realizado</option>
            <option value="ALL">Todos</option>
          </select>

          <button
            type="button"
            show-toast="false"
            onClick={() => fetchPage(null, true)}
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

      {toast && (
        <div
          className={`mb-4 rounded-xl border p-4 ${
            toast.type === "ok"
              ? "border-teal-500/30 bg-teal-500/10 text-teal-200"
              : "border-red-500/30 bg-red-500/10 text-red-200"
          }`}
        >
          <p className="text-sm">{toast.msg}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {loading && items.length === 0 && (
        <div className="rounded-xl border border-gray-700 bg-[#0a1628] p-6">
          <p className="text-sm text-gray-300">Cargando depósitos...</p>
        </div>
      )}

      {!loading && !error && filteredBySearch.length === 0 && (
        <div className="rounded-xl border border-gray-700 bg-[#0a1628] p-6">
          <p className="text-sm text-gray-300">
            No hay resultados para este filtro/búsqueda.
          </p>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {filteredBySearch.map((d) => {
          const total = Number(d.totalAmount);
          const expected = Number(d.expectedBOBH);
          const currencyLabel = d.currency === "BOB" ? "Bs" : "S/";
          const created = new Date(d.createdAt).toLocaleString();

          const canApprove =
            d.status !== "MINTED" &&
            d.status !== "NEED_CORRECTION" &&
            !(d.currency === "PEN" && d.isRateExpired) &&
            !!d.proofUrl; // regla: no aprobar sin proof

          const canReject =
            d.status !== "MINTED" &&
            (d.status === "PROOF_SUBMITTED" || d.status === "NEED_CORRECTION");
          const canRequestCorrection =
            d.status === "PROOF_SUBMITTED" && !!d.proofUrl;
          const canProposeMint =
            d.status === "APPROVED" &&
            !!d.user.walletAddress &&
            !d.safeTxHash &&
            d.status !== "MINTED";

          const showImageThumb = !!d.proofUrl && isImageMime(d.proofMimeType);

          return (
            <div key={d.id} className="rounded-2xl border border-gray-700 bg-[#0a1628] p-5">
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                {/* LEFT */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(d.status)}`}>
                      {statusLabel(d.status)}
                    </span>

                    {d.currency === "PEN" && d.isRateExpired && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold border border-red-500/30 bg-red-500/10 text-red-200">
                        Rate vencido
                      </span>
                    )}

                    <p className="text-sm text-gray-200">
                      <span className="text-gray-400">Ref:</span>{" "}
                      <span className="font-semibold text-teal-200">{d.referenceCode}</span>
                    </p>

                    <p className="text-xs text-gray-500">{created}</p>

                    <button
                      type="button"
                      onClick={() => onCopy("Referencia", d.referenceCode)}
                      className="ml-auto xl:ml-0 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700 bg-[#071225] text-gray-200 hover:bg-[#152b47]"
                    >
                      Copiar referencia
                    </button>
                  </div>

                  {d.currency === "PEN" && d.isRateExpired && (
                    <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                      <p className="text-xs text-red-200">
                        Este depósito no debería aprobarse: el tipo de cambio expiró. Pide al usuario crear un nuevo depósito.
                      </p>
                    </div>
                  )}

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                      <p className="text-xs text-gray-400">Total a pagar</p>
                      <p className="text-base font-semibold text-white">
                        {fmt(total)} {currencyLabel}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                      <p className="text-xs text-gray-400">Recibe (estimado)</p>
                      <p className="text-base font-semibold text-teal-300">
                        {fmt(expected)} BOBH
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                      <p className="text-xs text-gray-400">Usuario</p>
                      <p className="text-sm font-semibold text-white">
                        {d.user.firstName} {d.user.lastName}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-gray-400 break-all">{d.user.email}</p>
                        <button
                          type="button"
                          onClick={() => onCopy("Email", d.user.email)}
                          className="px-2 py-1 rounded-md text-xs border border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                      <p className="text-xs text-gray-400">País / KYC / Wallet</p>
                      <p className="text-sm text-gray-200">
                        <span className="text-gray-400">País:</span> {d.user.country}
                        {"  "}•{"  "}
                        <span className="text-gray-400">KYC:</span> {d.user.kycStatus}
                      </p>

                      <div className="mt-1 flex items-start justify-between gap-2">
                        <p className="text-xs text-gray-400 break-all">
                          <span className="text-gray-500">Wallet:</span>{" "}
                          {d.user.walletAddress ?? "No registrada"}
                        </p>
                        {d.user.walletAddress && (
                          <button
                            type="button"
                            onClick={() => onCopy("Wallet", d.user.walletAddress!)}
                            className="shrink-0 px-2 py-1 rounded-md text-xs border border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
                          >
                            Copiar
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                      <p className="text-xs text-gray-400">Comprobante</p>

                      {!d.proofUrl ? (
                        <p className="text-xs text-gray-500 mt-1">Sin comprobante</p>
                      ) : (
                        <>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <a
                              href={d.proofUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-2 rounded-lg text-xs font-medium border border-gray-700 bg-[#0a1628] text-teal-300 hover:bg-[#152b47]"
                            >
                              Abrir
                            </a>

                            <button
                              type="button"
                              onClick={() => setPreview(d)}
                              className="px-3 py-2 rounded-lg text-xs font-medium border border-gray-700 bg-[#0a1628] text-gray-200 hover:bg-[#152b47]"
                            >
                              Vista previa
                            </button>

                            {d.proofFileName ? (
                              <span className="text-xs text-gray-500">
                                {d.proofFileName}
                                {d.proofMimeType ? ` • ${d.proofMimeType}` : ""}
                              </span>
                            ) : null}
                          </div>

                          {d.proofUploadedAt ? (
                            <p className="text-xs text-gray-500 mt-2">
                              Subido: {new Date(d.proofUploadedAt).toLocaleString()}
                            </p>
                          ) : null}

                          {/* Thumbnail */}
                          {showImageThumb && (
                            <button
                              type="button"
                              onClick={() => setPreview(d)}
                              className="mt-3 w-full text-left"
                              title="Abrir vista previa"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={d.proofUrl}
                                alt="Comprobante"
                                className="w-full max-h-44 object-cover rounded-xl border border-gray-800 bg-[#0a1628]"
                              />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {d.status === "NEED_CORRECTION" && d.reviewNote && (
                    <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                      <p className="text-xs font-semibold text-amber-300">Observado</p>
                      <p className="mt-1 text-sm text-amber-100">{d.reviewNote}</p>
                      {d.reviewedAt && (
                        <p className="mt-2 text-[11px] text-amber-200/70">
                          {new Date(d.reviewedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  {d.currency === "PEN" && d.rateUsed && d.rateExpiresAt && (
                    <div className="mt-3 rounded-xl border border-gray-800 bg-[#071225] p-3">
                      <p className="text-xs text-gray-400">
                        Rate fijado:{" "}
                        <span className="text-gray-200 font-semibold">
                          1 PEN = {Number(d.rateUsed).toFixed(4)} BOB
                        </span>{" "}
                        {d.rateSource ? <span className="text-gray-500">({d.rateSource})</span> : null}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Válido hasta:{" "}
                        <span className="text-gray-200">
                          {new Date(d.rateExpiresAt).toLocaleString()}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* RIGHT ACTIONS */}
                <div className="w-full xl:w-[270px]">
                  <div className="rounded-2xl border border-gray-800 bg-[#071225] p-4">
                    <p className="text-sm font-semibold text-white mb-3">Acciones</p>

                    <button
                      type="button"
                      onClick={() => decide(d.id, "APPROVE")}
                      disabled={actingId === d.id || !canApprove}
                      className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                        actingId === d.id || !canApprove
                          ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                          : "bg-teal-600 text-white hover:bg-cyan-700"
                      }`}
                    >
                      {actingId === d.id ? "Procesando..." : "Aprobar"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCorrectionTarget(d);
                        setCorrectionNote(d.reviewNote ?? "");
                      }}
                      disabled={actingId === d.id || submittingCorrection || !canRequestCorrection}
                      className={`mt-2 w-full py-2.5 rounded-lg font-medium transition-colors ${
                        actingId === d.id || submittingCorrection || !canRequestCorrection
                          ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                          : "bg-amber-600 text-white hover:bg-amber-700"
                      }`}
                    >
                      Solicitar corrección
                    </button>

                    <button
                      type="button"
                      onClick={() => decide(d.id, "REJECT")}
                      disabled={actingId === d.id || !canReject}
                      className={`mt-2 w-full py-2.5 rounded-lg font-medium transition-colors ${
                        actingId === d.id || !canReject
                          ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      {actingId === d.id ? "Procesando..." : "Rechazar"}
                    </button>

                    {canProposeMint && (
                      <button
                        type="button"
                        onClick={() => proposeMint(d.id)}
                        disabled={actingId === d.id}
                        className={`mt-2 w-full py-2.5 rounded-lg font-medium transition-colors ${
                          actingId === d.id
                            ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                            : "bg-sky-600 text-white hover:bg-sky-700"
                        }`}
                      >
                        {actingId === d.id ? "Procesando..." : "Proponer mint"}
                      </button>
                    )}

                    {!d.proofUrl && (
                      <p className="mt-3 text-xs text-gray-500">
                        Para aprobar, debe existir comprobante.
                      </p>
                    )}

                    {d.validatedAt && (
                      <p className="mt-3 text-xs text-gray-500">
                        Validado: {new Date(d.validatedAt).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {d.safeTxHash && (
                    <div className="mt-3 rounded-2xl border border-gray-800 bg-[#071225] p-4">
                      <p className="text-xs text-gray-400">Propuesta creada</p>
                      {d.safeProposedAt && (
                        <p className="mt-1 text-[11px] text-gray-400">
                          {new Date(d.safeProposedAt).toLocaleString()}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-200 break-all">{d.safeTxHash}</p>
                    </div>
                  )}

                  {d.mintTxHash && (
                    <div className="mt-3 rounded-2xl border border-gray-800 bg-[#071225] p-4">
                      <p className="text-xs text-gray-400">Mint Tx</p>
                      <p className="mt-1 text-xs text-gray-200 break-all">{d.mintTxHash}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
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
          {loadingMore ? "Cargando..." : hasMore ? "Cargar más" : "No hay más resultados"}
        </button>
      </div>

      {/* PREVIEW MODAL */}
      {preview && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl rounded-2xl border border-gray-700 bg-[#0f1e33] shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div>
                <p className="text-white font-semibold">Vista previa</p>
                <p className="text-xs text-gray-400">
                  Ref: <span className="text-teal-300 font-semibold">{preview.referenceCode}</span>{" "}
                  • {preview.user.email}
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
              {/* media */}
              <div className="lg:col-span-2 rounded-2xl border border-gray-800 bg-[#071225] p-3">
                {!preview.proofUrl ? (
                  <p className="text-sm text-gray-300">Sin comprobante.</p>
                ) : isImageMime(preview.proofMimeType) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview.proofUrl}
                    alt="Comprobante"
                    className="w-full max-h-[560px] object-contain rounded-xl border border-gray-800 bg-[#0a1628]"
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
                      Abrir PDF en nueva pestaña
                    </a>
                    <div className="rounded-xl border border-gray-800 overflow-hidden">
                      <iframe
                        src={preview.proofUrl}
                        className="w-full h-[520px]"
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

              {/* actions */}
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
                    <span className="text-gray-400">Total:</span>{" "}
                    {fmt(Number(preview.totalAmount))}{" "}
                    {preview.currency === "BOB" ? "Bs" : "S/"}
                  </p>
                  <p className="mt-1">
                    <span className="text-gray-400">Recibe:</span>{" "}
                    <span className="text-teal-300 font-semibold">
                      {fmt(Number(preview.expectedBOBH))} BOBH
                    </span>
                  </p>

                  {preview.currency === "PEN" && preview.rateUsed && preview.rateExpiresAt && (
                    <p className="mt-2 text-xs text-gray-400">
                      Rate: <span className="text-gray-200">1 PEN = {Number(preview.rateUsed).toFixed(4)} BOB</span>
                      <br />
                      Vence: <span className="text-gray-200">{new Date(preview.rateExpiresAt).toLocaleString()}</span>
                    </p>
                  )}
                </div>

                {preview.currency === "PEN" && preview.isRateExpired && (
                  <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                    <p className="text-xs text-red-200">
                      Rate vencido: no aprobar.
                    </p>
                  </div>
                )}

                {preview.reviewNote && (
                  <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                    <p className="text-xs text-amber-200 font-semibold">Revisión solicitada</p>
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
                    disabled={
                      actingId === preview.id ||
                      preview.status === "MINTED" ||
                      (preview.currency === "PEN" && preview.isRateExpired) ||
                      !preview.proofUrl
                    }
                    className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                      actingId === preview.id ||
                      preview.status === "MINTED" ||
                      (preview.currency === "PEN" && preview.isRateExpired) ||
                      !preview.proofUrl
                        ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                        : "bg-teal-600 text-white hover:bg-cyan-700"
                    }`}
                  >
                    {actingId === preview.id ? "Procesando..." : "Aprobar"}
                  </button>

                  <button
                    type="button"
                    onClick={() => decide(preview.id, "REJECT")}
                    disabled={actingId === preview.id || preview.status === "MINTED"}
                    className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                      actingId === preview.id || preview.status === "MINTED"
                        ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {actingId === preview.id ? "Procesando..." : "Rechazar"}
                  </button>

                  {preview.status === "APPROVED" &&
                    !!preview.user.walletAddress &&
                    !preview.safeTxHash &&
                    preview.status !== "MINTED" && (
                      <button
                        type="button"
                        onClick={() => proposeMint(preview.id)}
                        disabled={actingId === preview.id}
                        className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                          actingId === preview.id
                            ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                            : "bg-sky-600 text-white hover:bg-sky-700"
                        }`}
                      >
                        {actingId === preview.id ? "Procesando..." : "Proponer mint"}
                      </button>
                    )}
                </div>

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

                {preview.safeTxHash && (
                  <div className="mt-4 rounded-xl border border-gray-800 bg-[#0a1628] p-3">
                    <p className="text-xs text-gray-400">Propuesta creada</p>
                    {preview.safeProposedAt && (
                      <p className="mt-1 text-[11px] text-gray-400">
                        {new Date(preview.safeProposedAt).toLocaleString()}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-200 break-all">{preview.safeTxHash}</p>
                  </div>
                )}
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
                <p className="text-white font-semibold">Solicitar corrección</p>
                <p className="text-xs text-gray-400 mt-1">
                  Ref: {correctionTarget.referenceCode} • {correctionTarget.user.email}
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
                ✕
              </button>
            </div>

            <label className="block mt-4 text-xs text-gray-300">Motivo / indicaciones</label>
            <textarea
              value={correctionNote}
              onChange={(e) => setCorrectionNote(e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-xl border border-gray-800 bg-[#0B1B34] p-3 text-sm text-white outline-none focus:border-amber-500/60"
              placeholder="Ej: No se ve el monto ni la fecha. Envia otra foto más clara."
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
                {submittingCorrection ? "Enviando..." : "Enviar corrección"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
