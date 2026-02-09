import { useState } from 'react';
import { useAuth } from "@/context/AuthContext";

import { useAccount, useWalletClient } from 'wagmi';
import ABI from '@/abi/BobH.json';

import ReportModal from "../ReportModal";
import { useRouter } from 'next/navigation';

type RetiroFormProps = {
    amount_wallet: string;
};

export default function RetiroForm({ amount_wallet }: RetiroFormProps) {
    const [reportModal, setReportModal] = useState({
        isOpen: false,
        success: true,
        message: ''
    });
    const [amount, setAmount] = useState('');
    const [destinationWallet, setDestinationWallet] = useState('');
    const [error, setError] = useState('');

    const { data: walletClient } = useWalletClient();
    const { address, isConnected } = useAccount();
    const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BOBH_ADDRESS as `0x${string}`;
    const { user } = useAuth();
    const router = useRouter();

    // Validar formato de wallet
    const validateWallet = (wallet: string) => {
        if (!wallet) return 'La wallet destino es requerida';
        if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) return 'Formato de wallet inválido';
        if (wallet.toLowerCase() === address?.toLowerCase()) return 'No puedes transferir a tu propia wallet';
        return '';
    };

    // Validar monto
    const validateAmount = (value: string) => {
        if (!value) return 'El monto es requerido';
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) return 'El monto debe ser mayor a 0';
        if (num > parseFloat(amount_wallet)) return 'Fondos insuficientes';
        return '';
    };

    const handleAmountChange = (value: string) => {
        setAmount(value);
        setError(validateAmount(value));
    };

    const handleWalletChange = (value: string) => {
        setDestinationWallet(value);
        const walletError = validateWallet(value);
        if (walletError) setError(walletError);
        else setError(validateAmount(amount));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setReportModal({
                isOpen: true,
                success: false,
                message: "Debes iniciar sesión"
            });
            return;
        }

        // Validaciones de usuario
        if (!user.isVerified) {
            setReportModal({
                isOpen: true,
                success: false,
                message: "Verifica tu cuenta para continuar"
            });
            setTimeout(() => router.push('/dashboard/settings/verification'), 2000);
            return;
        }

        if (user.kycStatus !== "VERIFIED") {
            setReportModal({
                isOpen: true,
                success: false,
                message: "Completa el proceso de KYC para continuar"
            });
            setTimeout(() => router.push('/dashboard/kyc'), 2000);
            return;
        }

        if (!user.isOnboardingCompleted) {
            setReportModal({
                isOpen: true,
                success: false,
                message: "Completa el onboarding para continuar"
            });
            setTimeout(() => router.push('/onboarding'), 2000);
            return;
        }

        // Validar campos
        const amountError = validateAmount(amount);
        const walletError = validateWallet(destinationWallet);

        if (amountError || walletError) {
            setError(amountError || walletError);
            return;
        }

        // Si todo está bien, proceder con la transferencia
        handleConfirmTransfer();
    };

    const handleConfirmTransfer = async () => {
        try {
            if (!isConnected || !walletClient) {
                setReportModal({
                    isOpen: true,
                    success: false,
                    message: 'Conecta tu wallet'
                });
                return;
            }
            const DECIMALS = 6n;
            // Convertir el monto a la unidad correcta (Wei si es necesario)
            const amountInUnits = BigInt(
                Math.round(Number(amount) * Number(10n ** DECIMALS))
            ); // Ajusta según decimales de tu token

            // Enviar transacción al contrato
            const txHash = await walletClient.writeContract({
                address: CONTRACT_ADDRESS,
                abi: ABI,
                functionName: 'transfer',
                args: [
                    destinationWallet as `0x${string}`,
                    amountInUnits
                ],
            });

            setReportModal({
                isOpen: true,
                success: true,
                message: `Transferencia exitosa. Hash: ${txHash}`
            });

            // Limpiar formulario
            setAmount('');
            setDestinationWallet('');
            setError('');

        } catch (err: any) {
            console.error(err);
            setReportModal({
                isOpen: true,
                success: false,
                message: err?.message || 'Error en la transferencia'
            });
        }
    };

    return (
        <>
            <div className="bg-[#0f1e33] rounded-2xl px-6 md:p-6 border border-gray-800 max-h-[calc(100vh-200px)] md:max-h-none overflow-y-auto md:overflow-visible">
                <h2 className="text-2xl font-semibold text-white mb-2">Transfiere Fondos</h2>
                <p className="text-gray-400 mb-6">Transfiere tus tokens BOBH a otra billetera</p>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="bg-[#0a1628] border border-gray-700 rounded-xl p-5">
                        <label className="text-sm text-gray-300 block mb-2">
                            Balance Disponible
                        </label>
                        <p className="text-2xl font-bold text-white">{amount_wallet} BOBH</p>
                    </div>


                    <div>
                        <label className="text-sm text-gray-300 block mb-2">
                            Monto a Transferir
                        </label>
                        <input
                            type="number"
                            step="0.000001"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            className="w-full bg-[#0a1628] border border-gray-700 rounded-lg px-4 py-3 
                                text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
                        />
                    </div>


                    <div>
                        <label className="text-sm text-gray-300 block mb-2">
                            Wallet Destino
                        </label>
                        <input
                            type="text"
                            placeholder="0x..."
                            value={destinationWallet}
                            onChange={(e) => handleWalletChange(e.target.value)}
                            className="w-full bg-[#0a1628] border border-gray-700 rounded-lg px-4 py-3 
                                text-white placeholder-gray-500 focus:outline-none focus:border-teal-500
                                font-mono text-sm"
                        />
                    </div>


                    {error && (
                        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 
                            rounded-lg px-4 py-2">
                            {error}
                        </p>
                    )}


                    <button
                        type="submit"
                        disabled={!amount || !destinationWallet || !!error}
                        className="w-full py-3 bg-teal-600 text-white rounded-lg font-medium
                            hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors"
                    >
                        Transferir Fondos
                    </button>
                </form>
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