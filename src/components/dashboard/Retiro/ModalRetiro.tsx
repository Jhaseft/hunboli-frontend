import { X } from 'lucide-react'; 
import { useState } from "react";
import Infoadicional from './Infoadicional';
import Banks from './Banks';

interface ModalRetiroProps {
  isOpen: boolean;
  onClose: () => void;
  currency: 'BOB' | 'PEN';
  amountBOBH: string;
  amountReceived: string;
  walletAmount: string;
  comisionminima: number;
  onConfirm: () => void;
}

export default function ModalRetiro({
  isOpen,
  onClose,
  currency,
  amountBOBH,
  amountReceived,
  walletAmount,
  comisionminima,
  onConfirm,
}: ModalRetiroProps) {
    // Estados para manejar datos del componente Banks
  const [selectedBankId, setSelectedBankId] = useState<number | ''>('');
  const [bankAccount, setBankAccount] = useState('');

  // Convertir a number los valores
  const walletboboenum = parseFloat(walletAmount);
  const amountBOBHNum = parseFloat(amountBOBH);

  // Cálculo de comisión y deducción total
  const comision = comisionminima + (0.001 * amountBOBHNum);
  const gasFee = 0.005;
  const totalDeduction = amountBOBHNum + gasFee + comision;
  const newBalance = walletboboenum - totalDeduction;

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f1e33] border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white hover:border border-teal-700 rounded-xs transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-4">
          Retiro: {amountBOBH} BOBH → {currency}
        </h2>

        <div className="space-y-4">
         
          <Banks
            selectedCurrency={currency}
            onBankChange={setSelectedBankId}
            onAccountChange={setBankAccount}
          />

         
          <Infoadicional
            comision={comision}
            gasFee={gasFee}
            newBalance={newBalance}
            totalDeduction={totalDeduction}
          />

         
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-[#0a1628] font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors"
            >
              Confirmar Retiro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
