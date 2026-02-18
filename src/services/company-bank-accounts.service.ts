import api from '@/lib/axios';

export interface CompanyBankAccount {
    currency: string;
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    cci: string | null;
    qrImageUrl: string | null;
    qrPublicId: string | null;
}

export const companyBankAccountsService = {
    getByCurrency: async (currency: 'BOB' | 'PEN'): Promise<CompanyBankAccount> => {
        const { data } = await api.get<CompanyBankAccount>(`company-bank-accounts/${currency}`);
        return data;
    },
};
