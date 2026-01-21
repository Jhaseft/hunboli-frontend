type RectanguloDerechaProps = {
  selectedCurrency: 'BOB' | 'PEN';
  calculateReceived: () => string;
  exchangeRates: {
    BOB: number;
    PEN: number;
  };
};

export default function RectanguloDerecha({
  selectedCurrency,
  calculateReceived,
  exchangeRates,
}: RectanguloDerechaProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
                Recibes {selectedCurrency === 'BOB' ? 'Bolivianos' : 'Soles'}
            </label>
            <div className="w-full px-4 py-3 bg-teal-900/30 border border-teal-600 rounded-lg text-lg font-semibold text-teal-400">
                {calculateReceived()} {selectedCurrency}
            </div>
            <p className="text-xs text-gray-500">
                Tasa: 1 BOBH = {exchangeRates[selectedCurrency]} {selectedCurrency}
            </p>
        </div>
    );
}