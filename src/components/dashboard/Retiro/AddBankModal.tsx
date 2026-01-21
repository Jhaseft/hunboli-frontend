import { X } from "lucide-react";
import { useState } from "react";
import api from "@/lib/api_axios";
import BankSelect from "./BankSelect";

type Bank = {
    id: number;
    name: string;
    country: 'Bolivia' | 'PERU';
};

interface AddBankModalProps {
    isOpen: boolean;
    onClose: () => void;
    banks: Bank[];
    currency: 'BOB' | 'PEN';
    onSaved?: () => void;
}

export default function AddBankModal({
    isOpen,
    onClose,
    banks,
    currency,
    onSaved
}: AddBankModalProps) {
    const [bankId, setBankId] = useState<number | ''>('');
    const [accountNumber, setAccountNumber] = useState('');

    if (!isOpen) return null;

    const filteredBanks = banks.filter(b =>
        currency === 'BOB' ? b.country === 'Bolivia' : b.country === 'PERU'
    );

    const handleSave = async () => {
        if (!bankId || !accountNumber) return;

        try {
            console.log(bankId);
            console.log(accountNumber);
            console.log(currency);
            // await api.post('/bank-accounts', {
            //     bank_id: bankId,
            //     account_number: accountNumber,
            //     currency
            // });

            onSaved?.();
            onClose();
            setBankId('');
            setAccountNumber('');
        } catch (error) {
            console.error('Error al guardar cuenta', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#0a1628] w-full max-w-md rounded-xl p-5 border border-gray-700">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-white font-semibold text-lg">
                        Agregar cuenta ({currency})
                    </h2>
                    <button onClick={onClose}>
                        <X className="text-gray-400 hover:text-white" />
                    </button>
                </div>

                <div className="space-y-4">

                    <BankSelect
                        banks={banks}
                        currency={currency}
                        value={bankId}
                        onChange={setBankId}
                    />


                    <input
                        type="text"
                        placeholder="Número de cuenta bancaria"
                        value={accountNumber}
                        onChange={e => setAccountNumber(e.target.value)}
                        className="w-full bg-[#0f1e33] text-white border border-gray-600 rounded py-2 px-2"
                    />

                    <button
                        onClick={handleSave}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded"
                    >
                        Guardar cuenta
                    </button>
                </div>
            </div>
        </div>
    );
}
