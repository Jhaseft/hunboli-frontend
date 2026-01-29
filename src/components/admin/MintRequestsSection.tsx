"use client";

import { Search } from "lucide-react";

export function MintRequestsSection() {
  return (
    <div className="bg-[#0f1e33] border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">
            Solicitudes de Emisión (Mint)
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Depósitos pendientes de verificación y aprobación
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por usuario..."
              className="bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 w-[220px]"
            />
          </div>
          <button className="border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-sm px-4 py-2 rounded-lg transition-colors">
            Filtros
          </button>
        </div>
      </div>
    </div>
  );
}
