import { ExchangeProvider } from '@/types/exchange';
import { User, TrendingUp, Clock } from 'lucide-react';

interface ProviderCardProps {
  provider: ExchangeProvider;
}
 
export default function ProviderCard({ provider }: ProviderCardProps) {
  // Calcular porcentaje de rating (de 0 a 100)
  const rating = provider.aceptacion_porcentaje;
  
  // Formatear números
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-PE').format(num);
  };

  return (
    <div className="bg-[#1E2026] hover:bg-[#2B3139] border border-[#2B3139] rounded-lg p-4 transition-colors cursor-pointer">
      <div className="flex items-start justify-between gap-4">
        
     
        <div className="flex-1 min-w-0">
       
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-medium text-sm truncate">
                {provider.proveedor}
              </h3>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{formatNumber(provider.operaciones_mes)} órdenes</span>
                <span>|</span>
                <span>{rating.toFixed(2)}% Completado</span>
              </div>
            </div>
          </div>

      
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-gray-400">👍</span>
              <span className="text-green-500 font-medium">{rating.toFixed(2)}%</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-3 h-3" />
              <span>15 min</span>
            </div>
          </div>
        </div>

     
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            S/. {provider.precio.toFixed(3)}
          </div>
        </div>

      
        <div className="text-right min-w-[180px]">
          <div className="text-white font-medium mb-1">
            {formatNumber(provider.liquidez.tradableQuantity)} USDT
          </div>
          <div className="text-xs text-gray-400">
            {provider.rango_pen.texto}
          </div>
        </div>

     
        <div className="flex flex-wrap gap-2 min-w-[200px]">
          {provider.bancos.slice(0, 3).map((banco, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded text-xs font-medium ${
                banco.nombre === 'Banco de Credito'
                  ? 'bg-orange-500/20 text-orange-400'
                  : banco.nombre === 'Credit Bank of Peru'
                  ? 'bg-blue-500/20 text-blue-400'
                  : banco.nombre === 'Interbank'
                  ? 'bg-green-500/20 text-green-400'
                  : banco.nombre === 'Yape'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-gray-500/20 text-gray-400'
              }`}
            >
              {banco.nombre === 'Credit Bank of Peru' ? 'BCP' : banco.nombre}
            </span>
          ))}
          {provider.bancos.length > 3 && (
            <button className="text-gray-400 text-xs hover:text-white">
              ▼
            </button>
          )}
        </div>

        
        <div className="flex-shrink-0">
          <button className="px-6 py-2 bg-gray-700 text-gray-400 rounded-md text-sm font-medium cursor-not-allowed flex items-center gap-2">
            <span className="w-4 h-4 border border-gray-400 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-xs">ⓘ</span>
            </span>
            Restringido
          </button>
          <p className="text-[10px] text-gray-500 text-center mt-1">
            Requiere verificación
          </p>
        </div>
      </div>
    </div>
  );
}