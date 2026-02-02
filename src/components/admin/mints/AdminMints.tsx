"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type MintStatus =
  | "PENDING"
  | "PROOF_SUBMITTED"
  | "NEED_CORRECTION"
  | "RATE_EXPIRED"
  | "APPROVED"
  | "REJECTED"
  | "PROCESSED"
  | "FAILED"
  | "MINTED";

type AdminMintItem = {
  id: string;
  referenceCode: string;
  currency: "BOB" | "PEN";
  status: MintStatus;
  expectedBOBH: string;
  safeTxHash: string | null;
  safeProposedAt: string | null;
  mintTxHash: string | null;
  mintedAt: string | null;
  createdAt: string;
  user: {
    email: string;
    walletAddress: string | null;
  };
};

type AdminMintsResponse = {
  items: AdminMintItem[];
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
};

function statusBadgeClass(status: MintStatus) {
  switch (status) {
    case "APPROVED":
      return "border border-teal-500/30 bg-teal-500/10 text-teal-200";
    case "MINTED":
      return "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
    case "PROCESSED":
      return "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
    case "REJECTED":
      return "border border-red-500/30 bg-red-500/10 text-red-200";
    default:
      return "border border-gray-500/30 bg-gray-500/10 text-gray-200";
  }
}

function statusLabel(status: MintStatus) {
  switch (status) {
    case "APPROVED":
      return "Aprobado";
    case "MINTED":
      return "Mint realizado";
    case "PROCESSED":
      return "Procesado";
    case "REJECTED":
      return "Rechazado";
    default:
      return status;
  }
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

  const [items, setItems] = useState<AdminMintItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const canFetch = useMemo(
    () => !!backendUrl && !!token && !isLoading,
    [backendUrl, token, isLoading]
  );

  const fetchPage = useCallback(
    async (cursor?: string | null, reset = false) => {
      if (!backendUrl) {
        setError("NEXT_PUBLIC_BACKEND_URL no esta configurado.");
        return;
      }
      if (!token) {
        setError("Debes iniciar sesion.");
        return;
      }

      const isFirst = reset || !cursor;

      try {
        if (isFirst) setLoading(true);
        else setLoadingMore(true);

        setError(null);

        const params = new URLSearchParams();
        params.set("limit", "10");
        if (!isFirst && cursor) params.set("cursor", cursor);

        const res = await fetch(`${backendUrl}/admin/mints?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const data = (await res.json().catch(() => null)) as AdminMintsResponse | null;

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
    [backendUrl, token]
  );

  useEffect(() => {
    if (!canFetch) return;
    fetchPage(null, true);
  }, [canFetch, fetchPage]);

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

      setToast({ type: "ok", msg: "Propuesta creada en Safe." });
    } catch {
      setToast({ type: "err", msg: "Error de red al proponer el mint." });
    } finally {
      setActingId(null);
    }
  };

  const filteredBySearch = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;

    return items.filter((d) => {
      return (
        d.referenceCode.toLowerCase().includes(q) ||
        d.user.email.toLowerCase().includes(q) ||
        (d.user.walletAddress ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, search]);

  return (
    <div className="bg-[#0f1e33] rounded-2xl p-6 shadow-sm border border-gray-800">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-semibold text-white">Solicitudes Mint</h2>
          <p className="text-gray-400 text-sm">
            Depositos aprobados para proponer en la multisig.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar: referencia, email, wallet..."
            className="px-4 py-2 rounded-lg bg-[#0a1628] border border-gray-700 text-gray-200 placeholder:text-gray-500 w-full sm:w-[320px]"
          />

          <button
            type="button"
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

      <div className="space-y-4">
        {filteredBySearch.map((d) => {
          const created = new Date(d.createdAt).toLocaleString();
          const canPropose =
            d.status === "APPROVED" && !!d.user.walletAddress && !d.safeTxHash;

          return (
            <div key={d.id} className="rounded-2xl border border-gray-700 bg-[#0a1628] p-5">
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(d.status)}`}>
                      {statusLabel(d.status)}
                    </span>

                    <p className="text-sm text-gray-200">
                      <span className="text-gray-400">Ref:</span>{" "}
                      <span className="font-semibold text-teal-200">{d.referenceCode}</span>
                    </p>

                    <p className="text-xs text-gray-500">{created}</p>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                      <p className="text-xs text-gray-400">Expected BOBH</p>
                      <p className="text-base font-semibold text-white">
                        {formatDecimalString(d.expectedBOBH, 6)} BOBH
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                      <p className="text-xs text-gray-400">Usuario</p>
                      <p className="text-sm text-gray-200 break-all">{d.user.email}</p>
                    </div>

                    <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                      <p className="text-xs text-gray-400">Wallet</p>
                      <p className="text-sm text-gray-200 break-all">
                        {d.user.walletAddress ?? "Sin wallet"}
                      </p>
                    </div>
                  </div>

                  {d.safeTxHash && (
                    <div className="mt-3 rounded-xl border border-gray-800 bg-[#071225] p-3">
                      <p className="text-xs text-gray-400">Safe Tx Hash</p>
                      {d.safeProposedAt && (
                        <p className="text-[11px] text-gray-400 mt-1">
                          {new Date(d.safeProposedAt).toLocaleString()}
                        </p>
                      )}
                      <p className="text-xs text-gray-200 break-all mt-1">{d.safeTxHash}</p>
                    </div>
                  )}

                  {d.mintTxHash && (
                    <div className="mt-3 rounded-xl border border-gray-800 bg-[#071225] p-3">
                      <p className="text-xs text-gray-400">Mint Tx</p>
                      {d.mintedAt && (
                        <p className="text-[11px] text-gray-400 mt-1">
                          {new Date(d.mintedAt).toLocaleString()}
                        </p>
                      )}
                      <p className="text-xs text-gray-200 break-all mt-1">{d.mintTxHash}</p>
                    </div>
                  )}
                </div>

                <div className="w-full xl:w-[270px]">
                  <div className="rounded-2xl border border-gray-800 bg-[#071225] p-4">
                    <p className="text-sm font-semibold text-white mb-3">Acciones</p>

                    <button
                      type="button"
                      onClick={() => proposeMint(d.id)}
                      disabled={actingId === d.id || !canPropose}
                      className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                        actingId === d.id || !canPropose
                          ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                          : "bg-sky-600 text-white hover:bg-sky-700"
                      }`}
                    >
                      {actingId === d.id ? "Procesando..." : "Proponer mint (Safe)"}
                    </button>

                    {!d.user.walletAddress && (
                      <p className="mt-3 text-xs text-gray-500">
                        El usuario no tiene wallet registrada.
                      </p>
                    )}
                    {d.safeTxHash && (
                      <p className="mt-3 text-xs text-gray-500">
                        Ya existe una propuesta en Safe.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
    </div>
  );
}
