import { useEffect, useState } from 'react';
import api from '@/lib/api_axios';

type Bank = {
  id: number;
  name: string;
  country: 'Bolivia' | 'PERU';
  logo_url: string;
};

export default function RetiroForm() {
  const [selectedCurrency, setSelectedCurrency] = useState<'BOB' | 'PEN'>('BOB');
  const [amount, setAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<number | ''>('');

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const { data } = await api.get<Bank[]>('/banks');
        setBanks(data);
      } catch (error) {
        console.error('Error al cargar bancos', error);
      }
    };

    fetchBanks();
  }, []);

  const filteredBanks = banks.filter((bank) => {
    if (selectedCurrency === 'BOB') return bank.country === 'Bolivia';
    if (selectedCurrency === 'PEN') return bank.country === 'PERU';
    return false;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Retirar:', {
      currency: selectedCurrency,
      amount,
      bankId: selectedBankId,
      bankAccount,
    });
  };

  return (
    <div className="bg-[#0f1e33] rounded-2xl p-6 shadow-sm border border-gray-800">
      <h2 className="text-2xl font-semibold mb-2 text-white">Retirar Fondos</h2>
      <p className="text-gray-400 mb-6">Redime tus tokens BOBH por BOB o PEN</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Moneda de Retiro
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedCurrency('BOB')}
              className={`py-3 px-4 rounded-lg font-medium transition-all ${
                selectedCurrency === 'BOB'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-[#0a1628] text-gray-300 hover:bg-[#152b47] border border-gray-700'
              }`}
            >
              BOB (Bs)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCurrency('PEN')}
              className={`py-3 px-4 rounded-lg font-medium transition-all ${
                selectedCurrency === 'PEN'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-[#0a1628] text-gray-300 hover:bg-[#152b47] border border-gray-700'
              }`}
            >
              PEN (S/)
            </button>
          </div>
        </div>

 
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-3">
            Cantidad de BOBH
          </label>
          <input
            type="text"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-3 bg-[#0a1628] border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white placeholder-gray-500"
          />
        </div>

 
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Banco
          </label>
          <select
            value={selectedBankId}
            onChange={(e) => setSelectedBankId(Number(e.target.value))}
            className="w-full px-4 py-3 bg-[#0a1628] border border-gray-700 rounded-lg text-white"
          >
            <option value="">Selecciona un banco</option>
            {filteredBanks.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-300 mb-3">
            Número de Cuenta Bancaria
          </label>
          <input
            type="text"
            id="bankAccount"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            placeholder="Ingresa tu número de cuenta"
            className="w-full px-4 py-3 bg-[#0a1628] border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white placeholder-gray-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors shadow-md"
        >
          Solicitar Retiro
        </button>
      </form>
    </div>
  );
}
