import { useState } from 'react';
import ModalRetiro from './ModalRetiro';
import Moneda_Retiro from './Moneda_Retiro';
import Tasa from './Tasa';
import Flecha from './Flecha';
import RectanguloDerecha from './RectanguloDerecha';

type RetiroFormProps = {
  amount_wallet: string;
};

export default function RetiroForm({ amount_wallet }: RetiroFormProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<'BOB' | 'PEN'>('BOB');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const MAX_AMOUNT = Number(amount_wallet) || 0;

  const MIN_AMOUNT = 10000;          // mínimo permitido

  const MAX_DECIMALS = 2;

  const comisionminima=100;


  //Esto saldra de una API en un futuro
  const exchangeRates = {
    BOB: 1,      // 1 BOBH = 1 BOB
    PEN: 0.52    // 1 BOBH = 0.52 PEN
  };

  const validateAmount = (value: string): string => {
    if (!value) return '';

    const num = Number(value);

    if (isNaN(num)) {
      return 'Ingresa un número válido';
    }

    if (num < MIN_AMOUNT) {
      return `El monto mínimo es ${MIN_AMOUNT} BOBH`;
    }

    if (num > MAX_AMOUNT) {
      return `El monto máximo es ${MAX_AMOUNT} BOBH`;
    }

    const decimals = value.split('.')[1];
    if (decimals && decimals.length > MAX_DECIMALS) {
      return `Máximo ${MAX_DECIMALS} decimales permitidos`;
    }

    return '';
  };


  const calculateReceived = (): string => {
    const amountNum = parseFloat(amount) || 0;
    const rate = exchangeRates[selectedCurrency];
    return (amountNum * rate).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount && parseFloat(amount) > 0) {
      setIsModalOpen(true);
    }
  };

  const handleConfirmRetiro = () => {
    console.log('Retirar:', {
      currency: selectedCurrency,
      amount,
      received: calculateReceived()
    });

    // Aquí iría la llamada a la API
    setIsModalOpen(false);

    // Resetear formulario
    setAmount('');
  };

  return (
    <>
      <div className="bg-[#0f1e33] rounded-2xl p-6 shadow-sm border border-gray-800">
        <h2 className="text-2xl font-semibold mb-2 text-white">Retirar Fondos</h2>
        <p className="text-gray-400 mb-6">Redime tus tokens BOBH por BOB o PEN</p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <Moneda_Retiro
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
          />

          <Tasa
            exchangeRates={exchangeRates}
          />

          <div className="bg-[#0a1628] border border-gray-700 rounded-xl p-5">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Tienes {amount_wallet} BOBH</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    const validationError = validateAmount(value);

                    setAmount(value);
                    setError(validationError);
                  }}
                  placeholder="0.00"
                  step="0.01"
                  min={MIN_AMOUNT}
                  max={MAX_AMOUNT}
                  className={`w-full px-4 py-3 bg-[#152b47] border rounded-lg
                      focus:ring-2 outline-none text-white text-lg font-semibold
                      ${error
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-600 focus:ring-teal-500'
                    }`}
                />
                <p className="text-xs text-gray-500">Ingresa la cantidad a retirar</p>
                {error && (
                  <p className="text-xs text-red-400 font-medium">
                    {error}
                  </p>
                )}
              </div>
              <Flecha />
              <RectanguloDerecha
                calculateReceived={calculateReceived}
                exchangeRates={exchangeRates}
                selectedCurrency={selectedCurrency}
              />

            </div>
          </div>

          <button
            type="submit"
            disabled={!amount || !!error}
            className="w-full py-3.5 bg-teal-600 text-white rounded-lg font-medium
                      hover:bg-teal-700 transition-colors shadow-md
                      disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Iniciar Retiro
          </button>
        </form>
      </div>

      <ModalRetiro
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currency={selectedCurrency}
        amountBOBH={amount}
        amountReceived={calculateReceived()}
        walletAmount={amount_wallet}
        comisionminima={comisionminima}
        onConfirm={handleConfirmRetiro}
      />
    </>
  );
}