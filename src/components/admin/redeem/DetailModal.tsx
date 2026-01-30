"use client";

import { RedeemRequest } from "./redeem.types";
import StatusBadge from "./StatusBadge";

type DetailModalProps = {
  request: RedeemRequest;
  onClose: () => void;
};

export default function DetailModal({ request, onClose }: DetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
          <h2 className="text-2xl text-white font-bold">Detalles del Retiro</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 text-white">

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">Información Principal</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Referencia</p>
                <p className="font-semibold text-lg">{request.operation.referenceCode}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Estado</p>
                <StatusBadge status={request.operation.status} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Monto Solicitado</p>
                <p className="font-semibold text-lg">{parseFloat(request.operation.amount).toLocaleString()} {request.operation.currency}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">BOBH Quemado</p>
                <p className="font-semibold text-lg">{parseFloat(request.burnedBOBH).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Fiat Enviado</p>
                <p className="font-semibold text-lg">{parseFloat(request.fiatSent).toLocaleString()} {request.operation.currency}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Tasa Usada</p>
                <p className="font-semibold">{request.operation.rateUsed}</p>
              </div>
            </div>
          </div>


          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">Información del Usuario</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Nombre Completo</p>
                <p className="font-semibold">{request.operation.user.firstName} {request.operation.user.lastName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="break-all">{request.operation.user.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">País</p>
                <p>{request.operation.user.country}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">KYC Status</p>
                <p>{request.operation.user.kycStatus}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 text-sm">Wallet Address</p>
                <p className="font-mono text-xs break-all">{request.operation.user.walletAddress}</p>
              </div>
            </div>
          </div>


          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">Cuenta Bancaria Destino</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Banco</p>
                <p className="font-semibold">{request.bankAccount.bank.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Número de Cuenta</p>
                <p className="font-mono">{request.bankAccount.accountNumber}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">País del Banco</p>
                <p>{request.bankAccount.bank.country}</p>
              </div>
              {request.payoutTxRef && (
                <div>
                  <p className="text-gray-400 text-sm">Referencia de Pago</p>
                  <p className="font-mono">{request.payoutTxRef}</p>
                </div>
              )}
            </div>
          </div>


          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">Detalles de Comisiones</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Fee Rate</p>
                <p>{parseFloat(request.operation.feeRate) * 100}%</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Service Fee</p>
                <p>{parseFloat(request.operation.serviceFee).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Monto Total</p>
                <p className="font-semibold">{parseFloat(request.operation.totalAmount).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">Fechas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Fecha de Creación</p>
                <p>{new Date(request.operation.createdAt).toLocaleString()}</p>
              </div>
              {request.operation.processedAt && (
                <div>
                  <p className="text-gray-400 text-sm">Fecha de Procesamiento</p>
                  <p>{new Date(request.operation.processedAt).toLocaleString()}</p>
                </div>
              )}
              {request.paidAt && (
                <div>
                  <p className="text-gray-400 text-sm">Fecha de Pago</p>
                  <p>{new Date(request.paidAt).toLocaleString()}</p>
                </div>
              )}
              {request.operation.validatedAt && (
                <div>
                  <p className="text-gray-400 text-sm">Fecha de Validación</p>
                  <p>{new Date(request.operation.validatedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {request.logProofUrl && (
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              Comprobante de Pago
            </h3>

            <div className="space-y-3">
              {request.payoutTxRef && (
                <div>
                  <p className="text-gray-400 text-sm">Referencia Bancaria</p>
                  <p className="font-mono text-white">{request.payoutTxRef}</p>
                </div>
              )}

              {request.proofUploadedAt && (
                <div>
                  <p className="text-gray-400 text-sm">Fecha de Subida</p>
                  <p className="text-white">{new Date(request.proofUploadedAt).toLocaleString()}</p>
                </div>
              )}

              <div>
                <p className="text-gray-400 text-sm mb-2">Archivo</p>

                {request.logProofUrl.match(/\.(png|jpg|jpeg|webp)$/i) ? (
                  <img
                    src={request.logProofUrl}
                    alt="Comprobante de pago"
                    className="max-h-64 rounded border border-gray-600"
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
                  className="inline-block mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                >
                  Ver / Descargar comprobante
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}