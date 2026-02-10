'use client';
import React from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { VerificationData } from "@/services/verification.service";
import { useRouter } from "next/navigation";

interface VerificationStatusCardProps {
    verification: VerificationData;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; borderColor: string; icon: React.ReactNode }> = {
    pending: {
        label: 'Pendiente de revisión',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/50',
        icon: (
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    approved: {
        label: 'Aprobada',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/50',
        icon: (
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    rejected: {
        label: 'Rechazada',
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/50',
        icon: (
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
};

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export const VerificationStatusCard = ({ verification }: VerificationStatusCardProps) => {
    const router = useRouter();
    const config = statusConfig[verification.status.toLowerCase()] ?? statusConfig.pending;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a1929] via-[#0f1f33] to-[#0a1929] flex items-center justify-center p-4">
            <div className="w-full max-w-lg w-">
                <Logo width={20} height={20} />

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Solicitud de Verificación
                    </h1>
                    <p className="text-gray-400">
                        Aquí puedes ver el estado de tu solicitud.
                    </p>
                </div>

                {/* Status Badge */}
                <div className={`mb-6 p-4 rounded-xl ${config.bgColor} border ${config.borderColor} flex items-center gap-3`}>
                    {config.icon}
                    <div>
                        <p className={`font-semibold ${config.color}`}>{config.label}</p>
                        <p className="text-gray-400 text-sm">
                            {verification.status.toLowerCase() === 'pending' && 'Tu comprobante está siendo revisado por nuestro equipo.'}
                            {verification.status.toLowerCase() === 'approved' && 'Tu cuenta ha sido verificada exitosamente.'}
                            {verification.status.toLowerCase() === 'rejected' && 'Tu solicitud fue rechazada. Puedes enviar una nueva.'}
                        </p>
                    </div>
                </div>

                {/* Details Card */}
                <div className="p-5 rounded-xl bg-gradient-to-r from-gray-800/80 to-gray-700/50 border border-gray-600/50 backdrop-blur-sm mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-white">Detalles de la solicitud</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-600/50">
                            <span className="text-gray-400">ID de solicitud</span>
                            <span className="text-white font-mono text-sm">{verification.id.slice(0, 8)}...</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-600/50">
                            <span className="text-gray-400">Fecha de envío</span>
                            <span className="text-white text-sm">{formatDate(verification.createdAt)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-600/50">
                            <span className="text-gray-400">Última actualización</span>
                            <span className="text-white text-sm">{formatDate(verification.updatedAt)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-400">Estado</span>
                            <span className={`font-semibold ${config.color}`}>{config.label}</span>
                        </div>
                    </div>
                </div>

                {/* Comprobante Preview */}
                {verification.imageUrl && (
                    <div className="mb-6 rounded-xl overflow-hidden border border-gray-600/50">
                        <div className="p-3 bg-gray-800/80 border-b border-gray-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-gray-300">Comprobante enviado</span>
                        </div>
                        <img
                            src={verification.imageUrl}
                            alt="Comprobante de verificación"
                            className="w-full h-64 object-contain bg-gray-900/50"
                        />
                    </div>
                )}

                <p className="text-center text-gray-300 text-xs mt-8">
                    Tu comprobante será revisado en un plazo de 24 horas
                </p>
            </div>
        </div>
    );
};
