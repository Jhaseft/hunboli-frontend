'use client';
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { verificationService, VerificationData } from "@/services/verification.service";
import { VerificationStatusCard } from "./VerificationStatusCard";
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, DragEvent, ChangeEvent } from "react";

type Currency = 'BOB' | 'PEN' | null;

interface BankData {
    banco: string;
    numeroCuenta: string;
    titular: string;
    montoRequerido: string;
}

const bankDataByCountry: Record<'BOB' | 'PEN', BankData> = {
    BOB: {
        banco: 'Banco Mercantil Santa Cruz',
        numeroCuenta: '4500-123456-789',
        titular: 'Hunboli S.R.L.',
        montoRequerido: '1000 Bs'
    },
    PEN: {
        banco: 'Banco de Crédito del Perú (BCP)',
        numeroCuenta: '193-12345678-0-12',
        titular: 'Hunboli S.A.C.',
        montoRequerido: '350 Soles'
    }
};

export const VerifyAccountForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(true);
    const [error, setError] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const data = await verificationService.getVerificationStatus();
                if (data) {
                    setVerificationData(data);
                }
            } catch {
                // No pending verification, show form
            } finally {
                setIsCheckingStatus(false);
            }
        };
        checkStatus();
    }, []);

    const handleFileChange = (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            setUploadedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setError('');
        } else if (file) {
            setError('Por favor, sube solo archivos de imagen');
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleFileChange(file);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0] || null;
        handleFileChange(file);
    };

    const removeFile = () => {
        setUploadedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedCurrency) {
            setError('Por favor, selecciona una moneda');
            return;
        }

        if (!uploadedFile) {
            setError('Por favor, adjunta el comprobante de depósito');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const data = await verificationService.uploadVerificationFile(uploadedFile);
            setVerificationData(data);
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                'Error al enviar tu comprobante de pago.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const bankData = selectedCurrency ? bankDataByCountry[selectedCurrency] : null;

    if (isCheckingStatus) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a1929] via-[#0f1f33] to-[#0a1929] flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400 text-sm">Verificando estado...</p>
                </div>
            </div>
        );
    }

    if (verificationData) {
        return <VerificationStatusCard verification={verificationData} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a1929] via-[#0f1f33] to-[#0a1929] flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <Logo width={18} height={18} />

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Verificación de Cuenta
                    </h1>
                    <p className="text-gray-400">
                        Para completar el proceso de verificación, realiza un depósito y adjunta el comprobante.
                    </p>
                </div>

                {/* Selector de Moneda */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                        Selecciona la moneda de depósito
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setSelectedCurrency('BOB')}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${selectedCurrency === 'BOB'
                                ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20'
                                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                                }`}
                        >
                            <span className="text-3xl">🇧🇴</span>
                            <span className="text-white font-semibold">Bolivianos</span>
                            <span className="text-gray-400 text-sm">BOB</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedCurrency('PEN')}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${selectedCurrency === 'PEN'
                                ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20'
                                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                                }`}
                        >
                            <span className="text-3xl">🇵🇪</span>
                            <span className="text-white font-semibold">Soles</span>
                            <span className="text-s text-gray-400">PEN</span>
                        </button>
                    </div>
                </div>

                {/* Datos Bancarios */}
                {bankData && (
                    <div className="mb-6 p-5 rounded-xl bg-gradient-to-r from-gray-800/80 to-gray-700/50 border border-gray-600/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-white">Datos Bancarios</h3>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-600/50">
                                <span className="text-gray-400">Banco</span>
                                <span className="text-white font-medium">{bankData.banco}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-600/50">
                                <span className="text-gray-400">Nº de Cuenta</span>
                                <span className="text-white font-mono font-medium">{bankData.numeroCuenta}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-600/50">
                                <span className="text-gray-400">Titular</span>
                                <span className="text-white font-medium">{bankData.titular}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-400">Monto a depositar</span>
                                <span className="text-emerald-400 font-bold text-lg">{bankData.montoRequerido}</span>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Zona de carga de imagen */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Comprobante de depósito
                        </label>

                        {!previewUrl ? (
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragging
                                    ? 'border-emerald-500 bg-emerald-500/10'
                                    : 'border-gray-600 bg-gray-800/30 hover:border-gray-500 hover:bg-gray-800/50'
                                    }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                    className="hidden"
                                    disabled={isLoading}
                                />

                                <div className="flex flex-col items-center gap-3">
                                    <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-emerald-500/20' : 'bg-gray-700/50'
                                        }`}>
                                        <svg className={`w-8 h-8 ${isDragging ? 'text-emerald-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>

                                    <div>
                                        <p className="text-white font-medium">
                                            {isDragging ? 'Suelta la imagen aquí' : 'Arrastra tu comprobante aquí'}
                                        </p>
                                        <p className="text-gray-500 text-sm mt-1">
                                            o <span className="text-emerald-400 hover:underline">haz clic para seleccionar</span>
                                        </p>
                                    </div>

                                    <p className="text-gray-500 text-xs">
                                        PNG, JPG o JPEG (máx. 10MB)
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden border border-gray-600 bg-gray-800/30">
                                <img
                                    src={previewUrl}
                                    alt="Vista previa del comprobante"
                                    className="w-full h-64 object-contain bg-gray-900/50"
                                />
                                <div className="absolute top-3 right-3">
                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors shadow-lg"
                                    >
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-3 bg-gray-800/80 border-t border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm text-gray-300 truncate">{uploadedFile?.name}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading || !selectedCurrency || !uploadedFile}
                    >
                        {isLoading ? 'Enviando comprobante...' : 'Enviar Comprobante'}
                    </Button>x
                </form>

                <p className="text-center text-gray-500 text-xs mt-8">
                    Tu comprobante será revisado en un plazo de 24 horas
                </p>
            </div>
        </div>
    );
}
