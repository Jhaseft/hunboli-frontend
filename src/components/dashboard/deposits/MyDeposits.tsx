"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type DepositStatus = 
    | "PENDING"
    | "PROOF_SUBMITTED"
    | "RATE_EXPPIRED"
    | "APPROVED"
    | "REJECTED"
    | "COMPLETED"
    | "MINTED";

type FiatCurrency = "BOB" | "PEN";

type MyDepositItem = {
    id: string;
    referenceCode: string;
    currency: FiatCurrency;
    status: DepositStatus;

    amount: string;
    feeRate: string;
    serviceFee: string;
    totalAmount: string;
    expectedBOBH: string;

    rateUsed: string | null;
    rateSource: string | null;
    rateQuoteTime: string | null;
    rateExpiresAt: string | null;

    proofUrl: string | null;
    proofUploadedAt: string | null;
    prooFileName: string | null;
    proofMimeType: string | null;

    createdAt: string;
};

type MyDepositsResponse = {
  items: MyDepositItem[];
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
};

function formatMoney(n: number, decimals = 2) {
  return Number.isFinite(n) ? n.toFixed(decimals) : "0.00";
}

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
      return "Tipo de cambio expirado";
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

export function MyDeposits() {
  const { token, isLoading } = useAuth();

  const [items, setItems] = useState<MyDepositItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const canFetch = useMemo(() => !!backendUrl && !!token && !isLoading, [backendUrl, token, isLoading]);

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
        if (isFirst) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const params = new URLSearchParams();
        params.set("limit", "10");
        if (cursor) params.set("cursor", cursor);

        const res = await fetch(`${backendUrl}/deposits/my?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const data = (await res.json().catch(() => null)) as MyDepositsResponse | null;

        if (!res.ok || !data) {
          const msg =
            (data as any)?.message ||
            (res.status === 401 ? "Sesión expirada. Vuelve a iniciar sesión." : "No se pudo cargar el historial.");
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

  useEffect(() => {
    if (!canFetch) return;
    fetchPage(null);
  }, [canFetch, fetchPage]);

  return (
    <div className="bg-[#0f1e33] rounded-2xl p-6 shadow-sm border border-gray-800">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Mis Depósitos</h2>
          <p className="text-gray-400 text-sm">Historial de solicitudes, comprobantes y estados.</p>
        </div>

        <button
          type="button"
          onClick={() => fetchPage(null)}
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
          <p className="text-sm text-gray-300">Aún no tienes depósitos.</p>
        </div>
      )}

      <div className="space-y-3">
        {items.map((d) => {
          const total = Number(d.totalAmount);
          const expected = Number(d.expectedBOBH);

          const currencyLabel = d.currency === "BOB" ? "Bs" : "S/";
          const created = new Date(d.createdAt).toLocaleString();

          return (
            <div key={d.id} className="rounded-2xl border border-gray-700 bg-[#0a1628] p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(d.status)}`}>
                    {statusLabel(d.status)}
                  </span>

                  <div className="text-sm text-gray-200">
                    <span className="text-gray-400">Ref:</span>{" "}
                    <span className="font-semibold text-teal-200">{d.referenceCode}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-400">{created}</div>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                  <p className="text-xs text-gray-400">Total a pagar</p>
                  <p className="text-base font-semibold text-white">
                    {formatMoney(total)} {currencyLabel}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                  <p className="text-xs text-gray-400">Recibirás (estimado)</p>
                  <p className="text-base font-semibold text-teal-300">
                    {formatMoney(expected)} BOBH
                  </p>
                </div>

                <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                  <p className="text-xs text-gray-400">Moneda</p>
                  <p className="text-base font-semibold text-white">
                    {d.currency === "BOB" ? "BOB (Bs)" : "PEN (S/)"}
                  </p>
                </div>
              </div>

              {d.currency === "PEN" && d.rateUsed && d.rateExpiresAt && (
                <div className="mt-3 rounded-xl border border-gray-800 bg-[#071225] p-3">
                  <p className="text-xs text-gray-400">
                    Tipo de cambio fijado:{" "}
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

              {d.proofUrl ? (
                <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <p className="text-xs text-gray-400">
                    Comprobante:{" "}
                    <a
                      href={d.proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-teal-300 hover:underline"
                    >
                      Ver archivo
                    </a>
                    {d.proofFileName ? <span className="text-gray-500"> • {d.proofFileName}</span> : null}
                  </p>

                  <p className="text-xs text-gray-500">
                    {d.proofUploadedAt ? `Subido: ${new Date(d.proofUploadedAt).toLocaleString()}` : ""}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-xs text-gray-500">Sin comprobante aún.</p>
              )}
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