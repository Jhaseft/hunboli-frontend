"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type DepositStatus =
  | "PENDING"
  | "PROOF_SUBMITTED"
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

  validatedById: string | null;
  validatedAt: string | null;

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

export function AdminDeposits() {
  const { token, isLoading } = useAuth();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [filter, setFilter] = useState<StatusFilter>("PROOF_SUBMITTED");

  const [items, setItems] = useState<AdminDepositItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [actingId, setActingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const canFetch = useMemo(() => !!backendUrl && !!token && !isLoading, [backendUrl, token, isLoading]);

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
    // al cambiar filtro, recargamos desde 0
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

      // update local item status
      setItems((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                status: data.status,
                validatedById: data.validatedById ?? d.validatedById,
                validatedAt: data.validatedAt ?? d.validatedAt,
              }
            : d
        )
      );

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

  return (
    <div className="bg-[#0f1e33] rounded-2xl p-6 shadow-sm border border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-semibold text-white">Admin • Depósitos</h2>
          <p className="text-gray-400 text-sm">Revisa comprobantes y aprueba/rechaza solicitudes.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
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

      {!loading && !error && items.length === 0 && (
        <div className="rounded-xl border border-gray-700 bg-[#0a1628] p-6">
          <p className="text-sm text-gray-300">No hay depósitos en este filtro.</p>
        </div>
      )}

      <div className="space-y-4">
        {items.map((d) => {
          const total = Number(d.totalAmount);
          const expected = Number(d.expectedBOBH);
          const currencyLabel = d.currency === "BOB" ? "Bs" : "S/";

          const created = new Date(d.createdAt).toLocaleString();

          return (
            <div key={d.id} className="rounded-2xl border border-gray-700 bg-[#0a1628] p-5">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
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
                  </div>

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
                      <p className="text-xs text-gray-400">{d.user.email}</p>
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
                      <p className="text-xs text-gray-400 mt-1 break-all">
                        <span className="text-gray-500">Wallet:</span>{" "}
                        {d.user.walletAddress ?? "No registrada"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                      <p className="text-xs text-gray-400">Comprobante</p>

                      {d.proofUrl ? (
                        <>
                          <a
                            href={d.proofUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-teal-300 hover:underline"
                          >
                            Ver archivo
                          </a>
                          {d.proofFileName ? (
                            <p className="text-xs text-gray-500 mt-1">
                              {d.proofFileName} {d.proofMimeType ? `• ${d.proofMimeType}` : ""}
                            </p>
                          ) : null}
                          {d.proofUploadedAt ? (
                            <p className="text-xs text-gray-500 mt-1">
                              Subido: {new Date(d.proofUploadedAt).toLocaleString()}
                            </p>
                          ) : null}
                        </>
                      ) : (
                        <p className="text-xs text-gray-500">Sin comprobante</p>
                      )}
                    </div>
                  </div>

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
                        Válido hasta: <span className="text-gray-200">{new Date(d.rateExpiresAt).toLocaleString()}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="w-full lg:w-[260px]">
                  <div className="rounded-2xl border border-gray-800 bg-[#071225] p-4">
                    <p className="text-sm font-semibold text-white mb-3">Acciones</p>

                    <button
                      type="button"
                      onClick={() => decide(d.id, "APPROVE")}
                      disabled={actingId === d.id || d.status === "MINTED" || (d.currency === "PEN" && d.isRateExpired)}
                      className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                        actingId === d.id || d.status === "MINTED" || (d.currency === "PEN" && d.isRateExpired)
                          ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                          : "bg-teal-600 text-white hover:bg-cyan-700"
                      }`}
                    >
                      {actingId === d.id ? "Procesando..." : "Aprobar"}
                    </button>

                    <button
                      type="button"
                      onClick={() => decide(d.id, "REJECT")}
                      disabled={actingId === d.id || d.status === "MINTED"}
                      className={`mt-2 w-full py-2.5 rounded-lg font-medium transition-colors ${
                        actingId === d.id || d.status === "MINTED"
                          ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      {actingId === d.id ? "Procesando..." : "Rechazar"}
                    </button>

                    {d.validatedAt && (
                      <p className="mt-3 text-xs text-gray-500">
                        Validado: {new Date(d.validatedAt).toLocaleString()}
                      </p>
                    )}
                  </div>

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
    </div>
  );
}
