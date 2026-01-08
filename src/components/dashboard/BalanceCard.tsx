import { Wallet, TrendingUp } from 'lucide-react';

export function BalanceCard() {
  return (
    <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-2xl p-8 text-white shadow-lg">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          <h2 className="text-lg font-medium">Balance Total</h2>
        </div>
        <TrendingUp className="w-5 h-5 opacity-70" />
      </div>
      
      <div className="mb-8">
        <div className="text-5xl font-bold mb-2">0,00</div>
        <div className="text-cyan-100 text-sm">BOBH</div>
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="text-cyan-200 text-sm mb-1">Equivalente BOB</div>
          <div className="text-xl font-semibold">0,00 Bs</div>
        </div>
        <div>
          <div className="text-cyan-200 text-sm mb-1">Estado KYC</div>
          <div className="text-xl font-semibold">Pendiente</div>
        </div>
      </div>
    </div>
  );
}