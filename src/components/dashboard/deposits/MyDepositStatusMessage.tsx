"use client";

import React from "react";
import type { MyDepositItem } from "./types";

interface Props {
  deposit: MyDepositItem;
}

export function MyDepositStatusMessage({ deposit: d }: Props) {
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
