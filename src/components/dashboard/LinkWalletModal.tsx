'use client';

import { useState } from 'react';
import { Eye, EyeOff, Wallet, X, Loader2 } from 'lucide-react';
import { walletService } from '@/services/wallet.service';
import { useAuth } from '@/context/AuthContext';

interface LinkWalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    walletAddress: string;
    onSuccess: () => void;
}

export function LinkWalletModal({ isOpen, onClose, walletAddress, onSuccess }: LinkWalletModalProps) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { updateWalletAddress } = useAuth();

    if (!isOpen) return null;

    const shortenAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!password.trim()) {
            setError('Por favor ingresa tu contraseña');
            return;
        }

        setIsLoading(true);

        try {
            await walletService.linkWallet(walletAddress, password);
            updateWalletAddress(walletAddress);
            setPassword('');
            onSuccess();
            onClose();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            const message = error.response?.data?.message || 'Error al vincular la wallet. Verifica tu contraseña.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setPassword('');
        setError(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <div className="relative w-full max-w-md bg-[#1a2332] rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-linear-to-r from-green-600 to-cyan-700 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Wallet className="w-6 h-6 text-white" />
                        <h2 className="text-xl font-bold text-white">Vincular Wallet</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-white/80 hover:text-white transition-colors"
                        aria-label="Cerrar modal"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <p className="text-gray-300 text-sm mb-4">
                            Para vincular la wallet a tu cuenta de HUNBOLI, ingresa tu contraseña:
                        </p>

                        <div className="bg-[#0f1419] rounded-lg px-4 py-3 mb-4">
                            <p className="text-gray-400 text-xs mb-1">Wallet a vincular</p>
                            <p className="text-cyan-400 font-mono text-sm">{shortenAddress(walletAddress)}</p>
                        </div>

                        <div className="relative">
                            <label className="block text-gray-400 text-sm mb-2">
                                Contraseña de HUNBOLI
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Ingresa tu contraseña"
                                    className="w-full bg-[#0f1419] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors pr-12"
                                    disabled={isLoading}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-3 text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !password.trim()}
                            className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Vinculando...
                                </>
                            ) : (
                                'Vincular Wallet'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
