import { useState, useEffect, useCallback } from "react";
import { Plus, Minus } from "lucide-react";
import api from '@/lib/api';
import AddBankModal from "./AddBankModal";
import BankAccountSelect from "./BankAccountSelect";
import { useAuth } from '@/context/AuthContext';
import ReportModal from "../ReportModal";
type Bank = {
  id: number;
  name: string;
  country: 'Bolivia' | 'PERU';
  logo_url: string;
};

type BankAccount = {
  id: string;
  userId: string;
  bankId: number;
  accountNumber: string;
  bank: Bank;
};

interface BanksProps {
  selectedCurrency: "BOB" | "PEN";
  onBankChange: React.Dispatch<React.SetStateAction<string | "">>;
  onAccountChange: React.Dispatch<React.SetStateAction<string>>;
}

export default function Banks({ selectedCurrency, onBankChange, onAccountChange, }: BanksProps) {

  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [catalogBanks, setCatalogBanks] = useState<Bank[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [openModal, setOpenModal] = useState(false);
  const { user } = useAuth();



  const [reportModal, setReportModal] = useState({
    isOpen: false,
    success: true,
    message: ''
  });
  const USER_ID = user?.id;
 
  const fetchBanks = useCallback(async () => {
    if (!USER_ID) return;
    try {
      const { data } = await api.get<BankAccount[]>(`/bank-accounts/user/${USER_ID}`);
      setBanks(data);
    } catch (error: any) {
      setReportModal({
        isOpen: false,
        success: false,
        message: error.response?.data?.message || 'Error al cargar cuentas bancarias'
      });
    }
  }, [USER_ID]);

  const fetchCatalogBanks = useCallback(async () => {
    try {
      const { data } = await api.get<Bank[]>('/banks');
      setCatalogBanks(data);
    } catch (error: any) {
      console.error('Error al cargar catálogo de bancos:', error.response.data.message);
    }
  }, []);

  const handleDeleteBankAccount = async () => {
    if (!selectedAccount) return;

    const confirmed = window.confirm(
      "¿Estás seguro que quieres eliminar esta cuenta bancaria?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/bank-accounts/${selectedAccount}`);
      onBankChange('');
      setSelectedAccount('');
      fetchBanks();

      setReportModal({
        isOpen: true,
        success: true,
        message: 'Cuenta bancaria eliminada correctamente'
      });
    } catch (error: any) {
      setReportModal({
        isOpen: true,
        success: false,
        message: error.response?.data?.message || 'Error al eliminar la cuenta bancaria'
      });
    }
  };


  useEffect(() => {
    fetchBanks();
    fetchCatalogBanks();
  }, [fetchBanks, fetchCatalogBanks]);

  const filteredBanks = banks.filter(account =>
    selectedCurrency === 'BOB'
      ? account.bank.country === 'Bolivia'
      : account.bank.country === 'PERU'
  );

  const filteredCatalogBanks = catalogBanks.filter(bank =>
    selectedCurrency === 'BOB'
      ? bank.country === 'Bolivia'
      : bank.country === 'PERU'
  );

  return (
    <>
      <div className="bg-[#0a1628] border border-gray-700 p-4 rounded-br-4xl flex items-center gap-2">

        <BankAccountSelect
          banks={filteredBanks}
          currency={selectedCurrency}
          value={selectedAccount}
          onChange={(accountId) => {
            setSelectedAccount(accountId); // actualizas el estado local
            // busco el banco asociado
            const account = filteredBanks.find(acc => acc.id === accountId);
            onBankChange(account ? account.id : ""); // paso el ID del banco al padre
          }}
        />

        <div className="flex flex-col gap-1">
          <button
            onClick={() => setOpenModal(true)}
            className="bg-teal-600 p-1 rounded hover:bg-teal-700"
          >
            <Plus size={16} />
          </button>

          <button
            onClick={handleDeleteBankAccount}
            disabled={!selectedAccount}
            className={`p-1 rounded ${selectedAccount
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-gray-600 cursor-not-allowed'
              }`}
          >
            <Minus size={16} />
          </button>
        </div>
      </div>

      <AddBankModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        banks={filteredCatalogBanks}
        userId={USER_ID}
        onSaved={fetchBanks}
      />
      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={() => setReportModal({ ...reportModal, isOpen: false })}
        success={reportModal.success}
        message={reportModal.message}
      />
    </>
  );
}
