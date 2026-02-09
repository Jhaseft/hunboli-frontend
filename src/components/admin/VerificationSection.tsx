"use client";

import { useEffect, useState } from "react";
import {
    verificationService,
    type VerificationRequest,
} from "@/services/verification.service";
import { Check, X, Eye, Clock, ShieldCheck, ShieldX } from "lucide-react";

type FilterStatus = "PENDING" | "APPROVED" | "REJECTED";

const FILTERS: { label: string; value: FilterStatus; icon: React.ReactNode }[] = [
    { label: "Pendientes", value: "PENDING", icon: <Clock className="w-4 h-4" /> },
    { label: "Aprobados", value: "APPROVED", icon: <ShieldCheck className="w-4 h-4" /> },
    { label: "Rechazados", value: "REJECTED", icon: <ShieldX className="w-4 h-4" /> },
];

export const VerificationSection = () => {
    const [filter, setFilter] = useState<FilterStatus>("PENDING");
    const [requests, setRequests] = useState<VerificationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const fetchRequests = async (status: FilterStatus) => {
        setLoading(true);
        try {
            let data: VerificationRequest[] | null = null;
            if (status === "PENDING") data = await verificationService.getPendingRequests();
            else if (status === "APPROVED") data = await verificationService.getApprovedRequests();
            else data = await verificationService.getRejectedRequests();
            setRequests(data ?? []);
        } catch {
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests(filter);
    }, [filter]);

    const handleApprove = async (id: string) => {
        setActionLoading(id);
        try {
            await verificationService.approveVerificationRequest(id);
            setRequests((prev) => prev.filter((r) => r.id !== id));
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: string) => {
        setActionLoading(id);
        try {
            await verificationService.rejectVerificationRequest(id);
            setRequests((prev) => prev.filter((r) => r.id !== id));
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("es-BO", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const statusBadge = (status: string) => {
        const styles: Record<string, string> = {
            PENDING: "bg-yellow-500/20 text-yellow-300",
            APPROVED: "bg-green-500/20 text-green-300",
            REJECTED: "bg-red-500/20 text-red-300",
        };
        const labels: Record<string, string> = {
            PENDING: "Pendiente",
            APPROVED: "Aprobado",
            REJECTED: "Rechazado",
        };
        return (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status] ?? "bg-gray-700 text-gray-300"}`}>
                {labels[status] ?? status}
            </span>
        );
    };

    return (
        <>
            <div className="space-y-6">
                <div className="bg-[#0f1e33] border border-gray-800 rounded-xl p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-white">
                                Solicitudes de Verificacion
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">
                                Solicitudes de verificacion de identidad
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {FILTERS.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => setFilter(f.value)}
                                    className={`flex items-center gap-2 border font-medium text-sm px-4 py-2 rounded-lg transition-colors ${filter === f.value
                                            ? "border-teal-500 bg-teal-600/20 text-teal-300"
                                            : "border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300"
                                        }`}
                                >
                                    {f.icon}
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-[#0f1e33] border border-gray-800 rounded-xl overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                            <ShieldCheck className="w-12 h-12 mb-3 text-gray-600" />
                            <p className="text-sm">No hay solicitudes {filter === "PENDING" ? "pendientes" : filter === "APPROVED" ? "aprobadas" : "rechazadas"}</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-800 text-gray-400 text-left">
                                    <th className="px-6 py-4 font-medium">Usuario</th>
                                    <th className="px-6 py-4 font-medium">Email</th>
                                    <th className="px-6 py-4 font-medium">Estado</th>
                                    <th className="px-6 py-4 font-medium">Fecha</th>
                                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((req) => (
                                    <tr key={req.id} className="border-b border-gray-800/50 hover:bg-white/2 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-white font-medium">
                                                {req.users.firstName} {req.users.lastName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{req.users.email}</td>
                                        <td className="px-6 py-4">{statusBadge(req.status)}</td>
                                        <td className="px-6 py-4 text-gray-400">{formatDate(req.createdAt)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setPreviewImage(req.imageUrl)}
                                                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                                                    title="Ver documento"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {filter === "PENDING" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(req.id)}
                                                            disabled={actionLoading === req.id}
                                                            className="p-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-400 transition-colors disabled:opacity-50"
                                                            title="Aprobar"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(req.id)}
                                                            disabled={actionLoading === req.id}
                                                            className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-colors disabled:opacity-50"
                                                            title="Rechazar"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {previewImage && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <div
                        className="relative max-w-2xl w-full bg-[#0f1e33] border border-gray-700 rounded-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                            <span className="text-white text-sm font-medium">Documento de verificacion</span>
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 flex items-center justify-center">
                            <img
                                src={previewImage}
                                alt="Documento de verificacion"
                                className="max-h-[70vh] object-contain rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
