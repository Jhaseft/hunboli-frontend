import { X } from "lucide-react";
import { useState } from "react";
import api from "@/lib/api";
import BankSelect from "./BankSelect";
import ReportModal from "../ReportModal";

type Bank = {
    id: number;
    name: string;
    country: 'Bolivia' | 'PERU';
};

interface AddBankModalProps {
    isOpen: boolean;
    onClose: () => void;
    banks: Bank[];
    userId: string;
    onSaved?: () => void;
}

export default function AddBankModal({
    isOpen,
    onClose,
    banks,
    userId,
    onSaved
}: AddBankModalProps) {
    const [bankId, setBankId] = useState<number | ''>('');
    const [accountNumber, setAccountNumber] = useState('');

    const [reportModal, setReportModal] = useState({
        isOpen: false,
        success: true,
        message: ''
    });

    const handleSave = async () => {
        if (!bankId || !accountNumber) {
            setReportModal({
                isOpen: true,
                success: false,
                message: 'Debes completar todos los campos'
            });
            return;
        }

        try {
            await api.post('/bank-accounts', {
                bankId: Number(bankId),
                accountNumber,
                userId
            });


            setReportModal({
                isOpen: true,
                success: true,
                message: 'Cuenta bancaria creada correctamente'
            });
            setBankId('');
            setAccountNumber('');
            onSaved?.();

            setTimeout(() => {
                onClose();
                setReportModal(prev => ({ ...prev, isOpen: false }));
            }, 2000);

        } catch (error: any) {
            setReportModal({
                isOpen: true,
                success: false,
                message: error.response?.data?.message || 'Error al crear cuenta bancaria'
            });
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-[#0a1628] w-full max-w-md rounded-xl p-5 border border-gray-700 relative">


                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-white font-semibold text-lg">
                            Agregar cuenta
                        </h2>
                        <button onClick={onClose}>
                            <X className="text-gray-400 hover:text-white" />
                        </button>
                    </div>


                    <div className="space-y-4">
                        <BankSelect
                            banks={banks}
                            value={bankId}
                            onChange={setBankId}
                        />
                        <input
                            type="text"
                            placeholder="Número de cuenta bancaria"
                            value={accountNumber}
                            onChange={e => setAccountNumber(e.target.value)}
                            className="w-full bg-[#0f1e33] text-white border border-gray-600 rounded py-2 px-2 focus:outline-teal-500"
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

            <ReportModal
                isOpen={reportModal.isOpen}
                onClose={() => setReportModal({ ...reportModal, isOpen: false })}
                success={reportModal.success}
                message={reportModal.message}
            />
        </>
    );
}
