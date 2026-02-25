"use client";

import React from "react";
import { ProofUploader } from "./ProofUploader";
import { statusBadgeClass, statusLabel, fmt } from "./depositUtils";
import type { MyDepositItem } from "./types";

interface MyDepositCardProps {
  deposit: MyDepositItem;
  onUploaded: () => void;
}

function canUploadProof(status: string) {
  return status === "PENDING" || status === "NEED_CORRECTION";
}

function StatusMessage({ deposit: d }: { deposit: MyDepositItem }) {
  switch (d.status) {
    case "PENDING":
      return (
        <div className="rounded-xl border border-gray-700 bg-[#0a1628] p-3">
          <p className="text-xs text-gray-400">
            Sube tu comprobante para iniciar la revisión.
          </p>
        </div>
      );
    case "PROOF_SUBMITTED":
      return (
        <p className="mt-3 text-xs text-gray-300">
          Comprobante enviado. Estamos verificando tu depósito.
        </p>
      );
    case "NEED_CORRECTION":
      return (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
          <p className="text-xs font-semibold text-amber-300">
            Tu comprobante fue observado
          </p>
          <p className="mt-1 text-sm text-amber-100">
            {d.reviewNote ?? "Necesitamos que reenvíes el comprobante."}
          </p>
          {d.reviewedAt && (
            <p className="mt-2 text-[11px] text-amber-200/70">
              Fecha de observación: {new Date(d.reviewedAt).toLocaleString()}
            </p>
          )}
          <p className="mt-2 text-xs text-amber-200/80">
            Sube un nuevo comprobante más claro (monto, fecha y referencia visibles).
          </p>
        </div>
      );
    case "RATE_EXPIRED":
      return (
        <p className="mt-3 text-xs text-red-300">
          El tipo de cambio expiró antes de subir el comprobante. Crea un nuevo depósito.
        </p>
      );
    case "APPROVED":
      return (
        <p className="mt-3 text-xs text-green-300">
          Depósito aprobado. (El mint se realizará más adelante.)
        </p>
      );
    case "REJECTED":
      return (
        <p className="mt-3 text-xs text-red-300">
          Depósito rechazado. Si crees que es un error, crea un nuevo depósito o contacta soporte.
        </p>
      );
    case "MINTED":
    case "COMPLETED":
      return <p className="text-xs text-gray-400">Completado.</p>;
    default:
      return null;
  }
}

export function MyDepositCard({ deposit: d, onUploaded }: MyDepositCardProps) {
  const total = Number(d.totalAmount);
  const expected = Number(d.expectedBOBH);
  const currencyLabel = d.currency === "BOB" ? "Bs" : "S/";
  const created = new Date(d.createdAt).toLocaleString();

  return (
    <div className="rounded-2xl border border-gray-700 bg-[#0a1628] p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(d.status)}`}
          >
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
            {fmt(total)} {currencyLabel}
          </p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
          <p className="text-xs text-gray-400">Recibirás (estimado)</p>
          <p className="text-base font-semibold text-teal-300">
            {fmt(expected)} BOBH
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
            {d.rateSource ? (
              <span className="text-gray-500">({d.rateSource})</span>
            ) : null}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Válido hasta:{" "}
            <span className="text-gray-200">
              {new Date(d.rateExpiresAt).toLocaleString()}
            </span>
          </p>
        </div>
      )}

      <div className="mt-3">
        <StatusMessage deposit={d} />
      </div>

      {canUploadProof(d.status) && (
        <div className="mt-3">
          <ProofUploader depositId={d.id} onUploaded={onUploaded} />
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
            {d.proofFileName ? (
              <span className="text-gray-500"> • {d.proofFileName}</span>
            ) : null}
          </p>
          <p className="text-xs text-gray-500">
            {d.proofUploadedAt
              ? `Subido: ${new Date(d.proofUploadedAt).toLocaleString()}`
              : ""}
          </p>
        </div>
      ) : (
        <p className="mt-3 text-xs text-gray-500">Sin comprobante aún.</p>
      )}
    </div>
  );
}
