"use client";

import { useState } from "react";
import { RedeemRequest } from "@/components/admin/redeem/redeem.types";

type EditModalProps = {
  request: RedeemRequest;
  onClose: () => void;
  onSave: (data: { status: string; payoutTxRef: string; file?: File }) => void;
};

export default function EditModal({ request, onClose, onSave }: EditModalProps) {
  const [status, setStatus] = useState(request.operation?.status || "PENDING");
  const [payoutTxRef, setPayoutTxRef] = useState(request.payoutTxRef || "");
  const [file, setFile] = useState<File | null>(null);

  const handleStatusChange = (value: string) => {
    setStatus(value);

    // Si ya no está PROCESSED, limpiamos el archivo
    if (value !== "PROCESSED") {
      setFile(null);
    }
  };

  const handleSubmit = () => {
    onSave({
      status,
      payoutTxRef,
      file: status === "PROCESSED" ? file || undefined : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-white font-bold">Editar Retiro</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-gray-400 text-sm mb-2">Referencia</p>
            <p className="text-white font-mono">
              {request.operation?.referenceCode || "N/A"}
            </p>
          </div>

          <div>
            <label className="block text-white text-sm mb-2 font-semibold">
              Estado
            </label>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="PENDING">Pendiente</option>
              <option value="PROCESSED">Procesado</option>
              <option value="REJECTED">Rechazado</option>
            </select>
          </div>

          <label className="block text-white text-sm mb-2 font-semibold">
                Detalle de pago o rechazo
              </label>
              <input
                type="text"
                value={payoutTxRef}
                onChange={(e) => setPayoutTxRef(e.target.value)}
                placeholder="Ej: BANK-TRX-123456"
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />


          {status === "PROCESSED" && (
            <div>
              
              <label className="block text-white text-sm mb-2 font-semibold">
                Subir Comprobante
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              {file && (
                <p className="text-green-400 text-sm mt-2">
                  Archivo seleccionado: {file.name}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}