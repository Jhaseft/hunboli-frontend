"use client";

import { useEffect, useState, useCallback } from "react";
import {
    eventLogsService,
    type EventLogItem,
    type ContractEventType,
} from "@/services/eventLogs.service";
import { Search, FileText } from "lucide-react";

const EVENT_TYPES: { label: string; value: ContractEventType | "ALL" }[] = [
    { label: "Todos", value: "ALL" },
    { label: "Minted", value: "MINTED" },
    { label: "Burned", value: "BURNED" },
    { label: "Redenc. Solicitada", value: "REDEMPTION_REQUESTED" },
    { label: "Redenc. Finalizada", value: "REDEMPTION_FINALIZED" },
    { label: "Redenc. Rechazada", value: "REDEMPTION_REJECTED" },
    { label: "Confiscado", value: "CONFISCATED" },
    { label: "Pausa", value: "SYSTEM_PAUSED" },
    { label: "Reanudado", value: "SYSTEM_UNPAUSED" },
    { label: "Blacklist +", value: "ADDED_TO_BLACKLIST" },
    { label: "Blacklist -", value: "REMOVED_FROM_BLACKLIST" },
    { label: "Tokens Recup.", value: "TOKENS_RECOVERED" },
    { label: "Transfer", value: "TRANSFER" },
];

const EVENT_BADGE_STYLES: Record<string, string> = {
    MINTED: "bg-green-500/20 text-green-300",
    BURNED: "bg-red-500/20 text-red-300",
    REDEMPTION_REQUESTED: "bg-yellow-500/20 text-yellow-300",
    REDEMPTION_FINALIZED: "bg-green-500/20 text-green-300",
    REDEMPTION_REJECTED: "bg-red-500/20 text-red-300",
    CONFISCATED: "bg-red-500/20 text-red-300",
    SYSTEM_PAUSED: "bg-orange-500/20 text-orange-300",
    SYSTEM_UNPAUSED: "bg-teal-500/20 text-teal-300",
    ADDED_TO_BLACKLIST: "bg-red-500/20 text-red-300",
    REMOVED_FROM_BLACKLIST: "bg-blue-500/20 text-blue-300",
    TOKENS_RECOVERED: "bg-purple-500/20 text-purple-300",
    TRANSFER: "bg-blue-500/20 text-blue-300",
};

export const LogsSection = () => {
    const [items, setItems] = useState<EventLogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [eventType, setEventType] = useState<ContractEventType | "ALL">("ALL");
    const [userAddress, setUserAddress] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchLogs = useCallback(async (currentPage: number, currentEventType: ContractEventType | "ALL") => {
        setLoading(true);
        setError(null);
        try {
            const res = await eventLogsService.list({
                page: currentPage,
                limit: 10,
                eventType: currentEventType === "ALL" ? undefined : currentEventType,
                userAddress: userAddress.trim() || undefined,
                dateFrom: dateFrom || undefined,
                dateTo: dateTo || undefined,
            });
            setItems(res.items ?? []);
            setTotalPages(res.totalPages ?? 1);
            setTotal(res.total ?? 0);
        } catch {
            setError("No se pudieron cargar los logs.");
        } finally {
            setLoading(false);
        }
    }, [userAddress, dateFrom, dateTo]);

    useEffect(() => {
        fetchLogs(page, eventType);
    }, [page, eventType, fetchLogs]);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("es-BO", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const shortenHash = (hash: string) =>
        `${hash.slice(0, 6)}...${hash.slice(-4)}`;

    const shortenAddress = (addr: string | null) =>
        addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "-";

    const formatAmount = (amount: string | null) => {
        if (!amount) return "-";
        const num = parseFloat(amount);
        return num.toLocaleString("es-BO", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
        });
    };

    const handleFilterSubmit = () => {
        setPage(1);
        fetchLogs(1, eventType);
    };

    return (
        <div className="space-y-6">
            {/* Header + Filtros */}
            <div className="bg-[#0f1e33] border border-gray-800 rounded-xl p-6">
                <div className="mb-4">
                    <h2 className="text-lg font-bold text-white">Event Logs</h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Registro de eventos del smart contract
                    </p>
                </div>

                {/* Filtro por tipo de evento */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {EVENT_TYPES.map((et) => (
                        <button
                            key={et.value}
                            onClick={() => {
                                setPage(1);
                                setEventType(et.value);
                            }}
                            className={`border font-medium text-xs px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${eventType === et.value
                                ? "border-teal-500 bg-teal-600/20 text-teal-300"
                                : "border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300"
                                }`}
                        >
                            {et.label}
                        </button>
                    ))}
                </div>

                {/* Filtros adicionales */}
                <div className="flex flex-col md:flex-row gap-3 mt-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Filtrar por direccion de usuario (0x...)"
                            value={userAddress}
                            onChange={(e) => setUserAddress(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[#0a1628] border border-gray-700 text-gray-200 text-sm placeholder-gray-500"
                        />
                    </div>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[#0a1628] border border-gray-700 text-gray-200 text-sm"
                    />
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[#0a1628] border border-gray-700 text-gray-200 text-sm"
                    />
                    <button
                        onClick={handleFilterSubmit}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600/20 border border-teal-500 text-teal-300 text-sm hover:bg-teal-600/30 transition-colors whitespace-nowrap"
                    >
                        <Search className="w-4 h-4" />
                        Buscar
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-200 text-sm">
                    {error}
                </div>
            )}

            {/* Tabla */}
            <div className="bg-[#0f1e33] border border-gray-800 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                        <FileText className="w-12 h-12 mb-3 text-gray-600" />
                        <p className="text-sm">No hay eventos registrados</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[700px]">
                            <thead>
                                <tr className="border-b border-gray-800 text-gray-400 text-left">
                                    <th className="px-4 py-4 font-medium">Evento</th>
                                    <th className="px-4 py-4 font-medium">Tx Hash</th>
                                    <th className="px-4 py-4 font-medium">Usuario</th>
                                    <th className="px-4 py-4 font-medium">Monto</th>
                                    <th className="px-4 py-4 font-medium">Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-gray-800/50 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-4 py-4">
                                            <span
                                                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${EVENT_BADGE_STYLES[item.eventType] ??
                                                    "bg-gray-700 text-gray-300"
                                                    }`}
                                            >
                                                {item.eventType}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-gray-300 font-mono text-xs">
                                            {shortenHash(item.txHash)}
                                        </td>
                                        <td className="px-4 py-4 text-gray-300 font-mono text-xs">
                                            {shortenAddress(item.userAddress)}
                                        </td>
                                        <td className="px-4 py-4 text-gray-200">
                                            {formatAmount(item.amount)}
                                        </td>
                                        <td className="px-4 py-4 text-gray-400 whitespace-nowrap">
                                            {formatDate(item.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Paginacion */}
            {!loading && items.length > 0 && (
                <div className="flex items-center justify-between">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className={`px-3 py-2 rounded-lg text-sm ${page <= 1
                            ? "bg-gray-700/40 text-gray-500 cursor-not-allowed"
                            : "bg-[#0a1628] border border-gray-700 text-gray-200 hover:bg-[#152b47]"
                            }`}
                    >
                        Anterior
                    </button>
                    <span className="text-xs text-gray-400">
                        Pagina {page} / {totalPages} ({total} eventos)
                    </span>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className={`px-3 py-2 rounded-lg text-sm ${page >= totalPages
                            ? "bg-gray-700/40 text-gray-500 cursor-not-allowed"
                            : "bg-[#0a1628] border border-gray-700 text-gray-200 hover:bg-[#152b47]"
                            }`}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
};
