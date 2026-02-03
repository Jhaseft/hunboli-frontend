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
    <div className="overflow-x-auto rounded-lg border border-gray-800">
      <table className="w-full bg-[#0f1e33]">
        <thead className="bg-gray-800/50">
          <tr>
            <th className="px-3 lg:px-4 py-3 text-left text-white font-semibold text-xs lg:text-sm">Referencia</th>
            <th className="px-3 lg:px-4 py-3 text-left text-white font-semibold text-xs lg:text-sm">Usuario</th>
            <th className="px-3 lg:px-4 py-3 text-left text-white font-semibold text-xs lg:text-sm">Monto</th>
            <th className="px-3 lg:px-4 py-3 text-left text-white font-semibold text-xs lg:text-sm hidden md:table-cell">Moneda</th>
            <th className="px-3 lg:px-4 py-3 text-left text-white font-semibold text-xs lg:text-sm hidden lg:table-cell">BOBH Quemado</th>
            <th className="px-3 lg:px-4 py-3 text-left text-white font-semibold text-xs lg:text-sm hidden lg:table-cell">Fiat Enviado</th>
            <th className="px-3 lg:px-4 py-3 text-left text-white font-semibold text-xs lg:text-sm">Estado</th>
            <th className="px-3 lg:px-4 py-3 text-left text-white font-semibold text-xs lg:text-sm hidden sm:table-cell">Fecha</th>
            <th className="px-3 lg:px-4 py-3 text-center text-white font-semibold text-xs lg:text-sm">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border-t border-gray-800 hover:bg-white/5 transition">
              <td className="px-3 lg:px-4 py-3 text-white text-xs lg:text-sm font-mono">
                {req.operation?.referenceCode || "N/A"}
              </td>
              <td className="px-3 lg:px-4 py-3 text-white text-xs lg:text-sm">
                {req.operation?.user?.firstName || ""} {req.operation?.user?.lastName || ""}
                {!req.operation?.user?.firstName && !req.operation?.user?.lastName && "N/A"}
              </td>
              <td className="px-3 lg:px-4 py-3 text-white text-xs lg:text-sm">
                {req.operation?.amount
                  ? parseFloat(req.operation.amount).toLocaleString()
                  : "0"}
              </td>
              <td className="px-3 lg:px-4 py-3 text-white text-xs lg:text-sm font-semibold hidden md:table-cell">
                {req.operation?.currency || "N/A"}
              </td>
              <td className="px-3 lg:px-4 py-3 text-white text-xs lg:text-sm hidden lg:table-cell">
                {req.burnedBOBH
                  ? parseFloat(req.burnedBOBH).toLocaleString()
                  : "0"}
              </td>
              <td className="px-3 lg:px-4 py-3 text-white text-xs lg:text-sm hidden lg:table-cell">
                {req.fiatSent
                  ? parseFloat(req.fiatSent).toLocaleString()
                  : "0"}
              </td>
              <td className="px-3 lg:px-4 py-3">
                <StatusBadge status={req.operation?.status || "UNKNOWN"} />
              </td>
              <td className="px-3 lg:px-4 py-3 text-white text-xs lg:text-sm hidden sm:table-cell">
                {req.operation?.createdAt
                  ? new Date(req.operation.createdAt).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="px-3 lg:px-4 py-3">
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    onClick={() => onViewDetail(req)}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs lg:text-sm transition whitespace-nowrap"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => onEdit(req)}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs lg:text-sm transition whitespace-nowrap"
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