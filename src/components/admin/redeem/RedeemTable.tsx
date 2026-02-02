"use client";

import { RedeemRequest } from "@/components/admin/redeem/redeem.types";
import StatusBadge from "@/components/admin/redeem/StatusBadge";

type RedeemTableProps = {
  requests: RedeemRequest[];
  onViewDetail: (request: RedeemRequest) => void;
  onEdit: (request: RedeemRequest) => void;
};

export default function RedeemTable({ requests, onViewDetail, onEdit }: RedeemTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-white font-semibold">Referencia</th>
            <th className="px-4 py-3 text-left text-white font-semibold">Usuario</th>
            <th className="px-4 py-3 text-left text-white font-semibold">Monto</th>
            <th className="px-4 py-3 text-left text-white font-semibold">Moneda</th>
            <th className="px-4 py-3 text-left text-white font-semibold">BOBH Quemado</th>
            <th className="px-4 py-3 text-left text-white font-semibold">Fiat Enviado</th>
            <th className="px-4 py-3 text-left text-white font-semibold">Estado</th>
            <th className="px-4 py-3 text-left text-white font-semibold">Fecha</th>
            <th className="px-4 py-3 text-center text-white font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border-t border-gray-700 hover:bg-gray-750 transition">
              <td className="px-4 py-3 text-white text-sm font-mono">
                {req.operation?.referenceCode || "N/A"}
              </td>
              <td className="px-4 py-3 text-white text-sm">
                {req.operation?.user?.firstName || ""} {req.operation?.user?.lastName || ""}
                {!req.operation?.user?.firstName && !req.operation?.user?.lastName && "N/A"}
              </td>
              <td className="px-4 py-3 text-white text-sm">
                {req.operation?.amount 
                  ? parseFloat(req.operation.amount).toLocaleString() 
                  : "0"}
              </td>
              <td className="px-4 py-3 text-white text-sm font-semibold">
                {req.operation?.currency || "N/A"}
              </td>
              <td className="px-4 py-3 text-white text-sm">
                {req.burnedBOBH 
                  ? parseFloat(req.burnedBOBH).toLocaleString() 
                  : "0"}
              </td>
              <td className="px-4 py-3 text-white text-sm">
                {req.fiatSent 
                  ? parseFloat(req.fiatSent).toLocaleString() 
                  : "0"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={req.operation?.status || "UNKNOWN"} />
              </td>
              <td className="px-4 py-3 text-white text-sm">
                {req.operation?.createdAt 
                  ? new Date(req.operation.createdAt).toLocaleDateString() 
                  : "N/A"}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => onViewDetail(req)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
                  >
                    Ver Detalle
                  </button>
                  <button
                    onClick={() => onEdit(req)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition"
                  >
                    Editar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}