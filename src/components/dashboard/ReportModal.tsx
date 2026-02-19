import { X, CheckCircle, XCircle } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  success: boolean;
  message: string;
}

export default function ReportModal({ isOpen, onClose, success, message }: ReportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-[#1a2332] rounded-2xl shadow-2xl overflow-hidden">

        {/* Header con gradiente dinámico */}
        <div
          className={`px-6 py-5 flex justify-between items-center ${
            success
              ? "bg-linear-to-r from-green-900 to-cyan-900"
              : "bg-linear-to-r from-red-700 to-rose-600"
          }`}
        >
          <h2 className="text-lg font-bold text-white tracking-wide">
            {success ? "Operación exitosa" : "Algo salió mal"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors rounded-full p-0.5 hover:bg-white/10"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="px-6 py-8 flex flex-col items-center gap-4">

          {/* Icono con halo de color */}
          <div
            className={`rounded-full p-4 ${
              success
                ? "bg-green-500/5 ring-1 ring-green-500/20"
                : "bg-red-500/10 ring-2 ring-red-500/30"
            }`}
          >
            {success ? (
              <CheckCircle className="w-12 h-12 text-green-600" />
            ) : (
              <XCircle className="w-12 h-12 text-red-400" />
            )}
          </div>

          {/* Mensaje */}
          <p
            className={`text-center text-sm leading-relaxed font-medium ${
              success ? "text-gray-300" : "text-red-300"
            }`}
          >
            {message}
          </p>
        </div>

        {/* Footer con botón */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 ${
              success
                ? "bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.3)] hover:shadow-[0_0_24px_rgba(6,182,212,0.5)]"
                : "bg-red-600 hover:bg-red-500 shadow-[0_0_16px_rgba(239,68,68,0.25)] hover:shadow-[0_0_24px_rgba(239,68,68,0.4)]"
            }`}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
