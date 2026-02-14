// components/dashboard/banks/CountrySection.tsx
'use client';

import { Building2, Trash2 } from "lucide-react";

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

interface CountrySectionProps {
    country: string;
    accounts: BankAccount[];
    flagEmoji: string;
    onDelete: (id: string) => void;
}

export function CountrySection({ country, accounts, flagEmoji, onDelete }: CountrySectionProps) {
    return (
        <div className="bg-[#1a1f2e] border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-700">
                <span className="text-xl text-white">{flagEmoji}</span>
                <div>
                    <h3 className="text-white text-sm font-semibold">{country}</h3>
                    <p className="text-gray-400 text-xs">
                        {accounts.length} {accounts.length === 1 ? 'cuenta' : 'cuentas'}
                    </p>
                </div>
            </div>

            {accounts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Building2 className="text-gray-600 mb-2" size={32} />
                    <p className="text-gray-500 text-xs">
                        Sin cuentas en {country}
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {accounts.map((account) => (
                        <div
                            key={account.id}
                            className="bg-[#0f1419] border border-gray-700 rounded-lg p-3 hover:border-gray-600 transition-colors"
                        >
                            <div className="flex justify-between items-center gap-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="flex items-center justify-center w-10 h-10 flex-shrink-0 rounded overflow-hidden">
                                        <img
                                            src={account.bank.logo_url}
                                            alt={account.bank.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium mb-0.5 truncate">
                                            {account.bank.name}
                                        </p>
                                        <p className="text-gray-300 text-xs font-mono">
                                            {account.accountNumber}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onDelete(account.id)}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded transition-colors flex-shrink-0"
                                    title="Eliminar cuenta"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}