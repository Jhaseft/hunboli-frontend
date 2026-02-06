'use client';

import { useEffect, useState } from 'react';
import { P2PService } from '@/services/p2p.service';
import { ExchangeResponse } from '@/types/exchange';
import ProviderCard from '@/components/exchange/ProviderCard';
import { Loader2, RefreshCw, TrendingDown } from 'lucide-react';

export default function Page() {
  const [data, setData] = useState<ExchangeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await P2PService.p2pservice();
      setData(response);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#181A20] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando proveedores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#181A20] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181A20] mt-16">
   
      <div className="border-b border-[#2B3139] bg-[#1E2026]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Comprar USDT con PEN
              </h1>
              <p className="text-gray-400 text-sm">
                {data?.total || 0} proveedores disponibles
              </p>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 bg-[#2B3139] hover:bg-[#3B4149] text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
          </div>

          <div className="flex gap-4 text-sm">
            <button className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-medium">
              Vender
            </button>
            <button className="px-4 py-2 bg-[#2B3139] text-gray-400 rounded-lg hover:text-white">
              Comprar
            </button>
          </div>
        </div>
      </div>

  
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-3">
          {data?.data.map((provider, index) => (
            <ProviderCard key={index} provider={provider} />
          ))}
        </div>

        
        <div className="mt-8 p-4 bg-[#1E2026] rounded-lg border border-[#2B3139]">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <TrendingDown className="w-4 h-4" />
              <span>Mejor precio: </span>
              <span className="text-green-500 font-bold">
                S/. {Math.min(...(data?.data.map(p => p.precio) || [])).toFixed(3)}
              </span>
            </div>
            <div className="text-gray-400">
              Última actualización: {new Date().toLocaleTimeString('es-PE')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}