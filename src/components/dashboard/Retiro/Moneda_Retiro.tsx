type MonedaRetiroProps = {
  selectedCurrency: 'BOB' | 'PEN';
  setSelectedCurrency: React.Dispatch<React.SetStateAction<'BOB' | 'PEN'>>;
};
export default function Moneda_Retiro({
  selectedCurrency,
  setSelectedCurrency,
}: MonedaRetiroProps) {
    return(
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Moneda de Retiro
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedCurrency('BOB')}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${selectedCurrency === 'BOB'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-[#0a1628] text-gray-300 hover:bg-[#152b47] border border-gray-700'
                  }`}
              >
                BOB (Bs)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCurrency('PEN')}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${selectedCurrency === 'PEN'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-[#0a1628] text-gray-300 hover:bg-[#152b47] border border-gray-700'
                  }`}
              >
                PEN (S/)
              </button>
            </div>
          </div>
    );
}