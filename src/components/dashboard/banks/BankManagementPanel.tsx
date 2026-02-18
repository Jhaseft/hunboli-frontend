// components/dashboard/banks/BankManagementPanel.tsx
'use client';

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import AddBankModal from "../Retiro/AddBankModal";
import ReportModal from "../ReportModal";
import { CountrySection } from "./CountrySection";
import { Plus, Building2 } from "lucide-react";

type Bank = {
    id: number;
    name: string;
    country: 'Bolivia' | 'PERU';
    logo_url: string;
};

type BankAccount = {
    id: string;
    accountNumber: string;
    bank: Bank;
};

export function BankManagementPanel() {
    const { user } = useAuth();
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [catalogBanks, setCatalogBanks] = useState<Bank[]>([]);
    const [openModal, setOpenModal] = useState(false);

    const [reportModal, setReportModal] = useState({
        isOpen: false,
        success: true,
        message: ''
    });

    const USER_ID = user?.id;
 
    const fetchAccounts = useCallback(async () => {
        if (!USER_ID) return;
        try {
            const { data } = await api.get<BankAccount[]>(`/bank-accounts/user/${USER_ID}`);
            setAccounts(data);
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
            const { data } = await api.get("/banks");
            setCatalogBanks(data);
        } catch (error) {
            console.error("Error cargando bancos");
        }
    }, []);

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("¿Eliminar esta cuenta bancaria?");
        if (!confirmed) return;

        try {
            await api.delete(`/bank-accounts/${id}`);
            fetchAccounts();

            setReportModal({
                isOpen: true,
                success: true,
                message: "Cuenta eliminada correctamente"
            });
        } catch (error: any) {
            setReportModal({
                isOpen: true,
                success: false,
                message: error.response?.data?.message || "Error al eliminar cuenta"
            });
        }
    };

    useEffect(() => {
        fetchAccounts();
        fetchCatalogBanks();
    }, [fetchAccounts, fetchCatalogBanks]);

    // Separar cuentas por país
    const boliviaAccounts = accounts.filter(acc => acc.bank.country === 'Bolivia');
    const peruAccounts = accounts.filter(acc => acc.bank.country === 'PERU');

    return (
        <>
            <div className="bg-[#0f1419] border border-gray-700 rounded-xl p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                    <div>
                        <h1 className="text-white text-lg font-semibold mb-1">
                            Cuentas Bancarias
                        </h1>
                        <p className="text-gray-400 text-xs">
                            {accounts.length} {accounts.length === 1 ? 'cuenta registrada' : 'cuentas registradas'}
                        </p>
                    </div>

                    <button
                        onClick={() => setOpenModal(true)}
                        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded text-white text-sm font-medium transition-colors"
                    >
                        <Plus size={16} />
                        Agregar cuenta
                    </button>
                </div>

                {accounts.length === 0 ? (
                    <div className="bg-[#1a1f2e] border border-gray-700 rounded-lg p-10 text-center">
                        <Building2 className="mx-auto text-gray-600 mb-3" size={40} />
                        <p className="text-white text-sm font-medium mb-1">
                            No tienes cuentas bancarias
                        </p>
                        <p className="text-gray-500 text-xs">
                            Agrega tu primera cuenta para comenzar
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <CountrySection 
                            country="Bolivia" 
                            accounts={boliviaAccounts} 
                            flagEmoji="🇧🇴"
                            onDelete={handleDelete}
                        />
                        <CountrySection 
                            country="Perú" 
                            accounts={peruAccounts} 
                            flagEmoji="🇵🇪"
                            onDelete={handleDelete}
                        />
                    </div>
                )}
            </div>

            <AddBankModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                banks={catalogBanks}
                userId={user?.id}
                onSaved={fetchAccounts}
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