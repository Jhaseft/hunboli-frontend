type TasaProps = {
  exchangeRate: number;
  currency: 'BOB' | 'PEN';
};

export default function Tasa({ exchangeRate, currency }: TasaProps) {

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-300">
        Tasa de conversión
      </p>

      <div className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 
            border border-teal-700/50 rounded-lg p-4">

        <div className="flex items-center justify-center gap-1 bg-black/20 rounded-md p-3">
          <span className="font-semibold text-white">1 BOBH</span>
          <span className="text-gray-400">→</span>
          <span className="font-semibold text-teal-400">
            {exchangeRate} {currency}
          </span>
        </div>

      </div>
    </div>
  );
}
