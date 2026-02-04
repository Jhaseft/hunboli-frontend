"use client";

import { RedeemRequest } from "@/components/admin/redeem/redeem.types";
import StatusBadge from "@/components/admin/redeem/StatusBadge";

type DetailModalProps = {
  request: RedeemRequest;
  onClose: () => void;
};

export default function DetailModal({ request, onClose }: DetailModalProps) {
  console.log("Request data:", request);
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f1e33] rounded-2xl border border-gray-800 p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
          <h2 className="text-xl sm:text-2xl text-white font-semibold">Detalles del Retiro</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 sm:space-y-6 text-white">
          {/* Información Principal */}
          <div className="rounded-xl border border-gray-800 bg-[#0a1628] p-4">
            <h3 className="text-base sm:text-lg font-semibold mb-3 text-teal-400">Información Principal</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                <p className="text-xs text-gray-400">Referencia</p>
                <p className="font-semibold text-sm sm:text-base text-teal-200">{request.operation?.referenceCode || "N/A"}</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                <p className="text-xs text-gray-400">Estado</p>
                <div className="mt-1">
                  <StatusBadge status={request.operation?.status || "UNKNOWN"} />
                </div>
              </div>
              <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                <p className="text-xs text-gray-400">Monto Solicitado</p>
                <p className="font-semibold text-sm sm:text-base">
                  {request.operation?.amount
                    ? parseFloat(request.operation.amount).toLocaleString()
                    : "0"} {request.operation?.currency || "N/A"}
                </p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                <p className="text-xs text-gray-400">BOBH Quemado</p>
                <p className="font-semibold text-sm sm:text-base text-teal-300">
                  {request.burnedBOBH
                    ? parseFloat(request.burnedBOBH).toLocaleString()
                    : "0"} BOBH
                </p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                <p className="text-xs text-gray-400">Fiat Enviado</p>
                <p className="font-semibold text-sm sm:text-base">
                  {request.fiatSent
                    ? parseFloat(request.fiatSent).toLocaleString()
                    : "0"} {request.operation?.currency || "N/A"}
                </p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                <p className="text-xs text-gray-400">Tasa Usada</p>
                <p className="font-semibold text-sm sm:text-base">{request.operation?.rateUsed || "N/A"}</p>
              </div>
              {request?.TxHash && (
                <div className="rounded-xl border border-gray-800 bg-[#071225] p-3 sm:col-span-2">
                  <p className="text-xs text-gray-400">Hash de Transacción</p>
                  <p className="font-mono text-xs break-all text-gray-300 mt-1">{request.TxHash}</p>
                </div>
              )}
            </div>
          </div>

        
          <div className="rounded-xl border border-gray-800 bg-[#0a1628] p-4">
            <h3 className="text-base sm:text-lg font-semibold mb-3 text-teal-400">
              Cuenta Bancaria Destino
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-gray-800 bg-[#071225] p-4">
              
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-white rounded-lg border border-gray-600 flex-shrink-0">
                {request.bankAccount?.bank?.logo_url ? (
                  <img
                    src={request.bankAccount.bank.logo_url}
                    alt={request.bankAccount.bank.name}
                    className="max-h-10 sm:max-h-12 object-contain p-2"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">Sin logo</span>
                )}
              </div>

              {/* Información del Banco */}
              <div className="flex-1 text-white space-y-2 w-full">
                <div>
                  <p className="text-xs text-gray-400">Banco</p>
                  <p className="font-semibold text-sm sm:text-base">
                    {request.bankAccount?.bank?.name || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Número de Cuenta</p>
                  <p className="font-mono text-sm break-all">
                    {request.bankAccount?.accountNumber || "N/A"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-400">País:</span>{" "}
                    <span className="text-gray-200">{request.bankAccount?.bank?.country || "N/A"}</span>
                  </div>

                  {request.payoutTxRef && (
                    <div>
                      <span className="text-gray-400">Referencia:</span>{" "}
                      <span className="font-mono text-gray-200">{request.payoutTxRef}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detalles de Comisiones */}
          <div className="rounded-xl border border-gray-800 bg-[#0a1628] p-4">
            <h3 className="text-base sm:text-lg font-semibold mb-3 text-teal-400">Detalles de Comisiones</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                <p className="text-xs text-gray-400">Fee Rate</p>
                <p className="font-semibold text-sm sm:text-base">
                  {request.operation?.feeRate
                    ? (parseFloat(request.operation.feeRate) * 100).toFixed(2)
                    : "0"}%
                </p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                <p className="text-xs text-gray-400">Service Fee</p>
                <p className="font-semibold text-sm sm:text-base">
                  {request.operation?.serviceFee
                    ? parseFloat(request.operation.serviceFee).toLocaleString()
                    : "0"}
                </p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-[#071225] p-3 sm:col-span-2 lg:col-span-1">
                <p className="text-xs text-gray-400">Monto Total</p>
                <p className="font-semibold text-sm sm:text-base">
                  {request.operation?.totalAmount
                    ? parseFloat(request.operation.totalAmount).toLocaleString()
                    : "0"}
                </p>
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="rounded-xl border border-gray-800 bg-[#0a1628] p-4">
            <h3 className="text-base sm:text-lg font-semibold mb-3 text-teal-400">Fechas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                <p className="text-xs text-gray-400">Fecha de Creación</p>
                <p className="text-sm">
                  {request.operation?.createdAt
                    ? new Date(request.operation.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              {request.operation?.processedAt && (
                <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                  <p className="text-xs text-gray-400">Fecha de Procesamiento</p>
                  <p className="text-sm">{new Date(request.operation.processedAt).toLocaleString()}</p>
                </div>
              )}
              {request.paidAt && (
                <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                  <p className="text-xs text-gray-400">Fecha de Pago</p>
                  <p className="text-sm">{new Date(request.paidAt).toLocaleString()}</p>
                </div>
              )}
              {request.operation?.validatedAt && (
                <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                  <p className="text-xs text-gray-400">Fecha de Validación</p>
                  <p className="text-sm">{new Date(request.operation.validatedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Comprobante de Pago */}
          {request.logProofUrl && (
            <div className="rounded-xl border border-gray-800 bg-[#0a1628] p-4">
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-teal-400">
                Comprobante de Pago
              </h3>

              <div className="space-y-3">
                {request.payoutTxRef && (
                  <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                    <p className="text-xs text-gray-400">Referencia Bancaria</p>
                    <p className="font-mono text-sm text-white break-all">{request.payoutTxRef}</p>
                  </div>
                )}

                {request.proofUploadedAt && (
                  <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                    <p className="text-xs text-gray-400">Fecha de Subida</p>
                    <p className="text-sm text-white">
                      {new Date(request.proofUploadedAt).toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="rounded-xl border border-gray-800 bg-[#071225] p-3">
                  <p className="text-xs text-gray-400 mb-3">Archivo</p>

                  {request.logProofUrl.match(/\.(png|jpg|jpeg|webp)$/i) ? (
                    <img
                      src={request.logProofUrl}
                      alt="Comprobante de pago"
                      className="max-h-64 w-full object-contain rounded-lg border border-gray-700"
                    />
                  ) : (
                    <p className="text-sm text-gray-300">
                      Archivo no previsualizable
                    </p>
                  )}

                  <a
                    href={request.logProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 px-4 py-2 bg-teal-600 hover:bg-cyan-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Ver / Descargar comprobante
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm sm:text-base"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}