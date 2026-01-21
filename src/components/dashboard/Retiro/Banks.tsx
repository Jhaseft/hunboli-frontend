import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import api from '@/lib/api_axios';
import AddBankModal from "./AddBankModal";
import BankAccountSelect from "./BankAccountSelect";

type Bank = {
  id: number;
  name: string;
  country: 'Bolivia' | 'PERU';
};

interface BanksProps {
  selectedCurrency: 'BOB' | 'PEN';
  onBankChange?: (bankId: number | '') => void;
}

export default function Banks({ selectedCurrency, onBankChange }: BanksProps) {

  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<number | ''>('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);

  const fetchBanks = async () => {
    try {
      const { data } = await api.get<Bank[]>('/banks');
      setBanks(data);
    } catch (error) {
      console.error('Error al cargar bancos', error);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const filteredBanks = banks.filter(bank =>
    selectedCurrency === 'BOB'
      ? bank.country === 'Bolivia'
      : bank.country === 'PERU'
  );

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === '' ? '' : Number(e.target.value);
    setSelectedBankId(value);
    onBankChange?.(value);
  };

  return (
    <>
      <div className="bg-[#0a1628] border border-gray-700 p-4 rounded-br-4xl flex items-center gap-2">

        <BankAccountSelect
  banks={banks}
  currency={selectedCurrency}
  value={selectedAccount}
  onChange={setSelectedAccount}
/>

        <div className="flex flex-col gap-1">
          <button
            onClick={() => setOpenModal(true)}
            className="bg-teal-600 p-1 rounded hover:bg-teal-700"
          >
            <Plus size={16} />
          </button>

          <button
            className="bg-red-600 p-1 rounded hover:bg-red-700"
          >
            <Minus size={16} />
          </button>
        </div>
      </div>

      <AddBankModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        banks={banks}
        currency={selectedCurrency}
        onSaved={fetchBanks}
      />
    </>
  );
}
