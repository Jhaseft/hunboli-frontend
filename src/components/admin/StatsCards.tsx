"use client";

import { retiroService } from "@/services/retiro.service";
import { verificationService } from "@/services/verification.service";
import { DollarSign, Landmark, TrendingUp, Clock } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useAccount, useWalletClient, useReadContract } from 'wagmi';
import ABI from '@/abi/BobH.json';


interface StatCard {
  title: string;
  value: string;
  subtitle: string;
  detail?: string;
  detailType?: "positive" | "warning" | "neutral";
  icon: ReactNode;
  iconBg: string;
}

function StatCardItem({ stat }: { stat: StatCard }) {
  const detailColor = {
    positive: "text-green-400",
    warning: "text-yellow-400",
    neutral: "text-gray-400",
  };

  return (
    <div className="bg-[#0f1e33] border border-gray-800 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{stat.title}</span>
        <div className={`${stat.iconBg} rounded-lg p-2`}>{stat.icon}</div>
      </div>
      <div>
        <div className="text-3xl font-bold text-yellow-400">{stat.value}</div>
        <div className="text-xs text-gray-500 mt-1">{stat.subtitle}</div>
      </div>
      {stat.detail && (
        <div
          className={`text-xs ${stat.detailType ? detailColor[stat.detailType] : "text-gray-400"
            }`}
        >
          {stat.detail}
        </div>
      )}
    </div>
  );
}

export function StatsCards() {
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [pendingVerifications, setPendingVerifications] = useState<number | null | undefined>(null);
  
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BOBH_ADDRESS as `0x${string}`;

  // LEER TOTAL SUPPLY DEL CONTRATO
  const { data: totalSupply, isLoading: isLoadingSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'totalSupply',
  });

  // Convertir de Wei a número legible (asumiendo 6 decimales)
  const totalSupplyFormatted = totalSupply 
    ? (Number(totalSupply) / 10 ** 6).toLocaleString('es-BO', { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
      })
    : '0';

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const data = await retiroService.pendingacoounts();
        setPendingCount(data.pendingCount);
        const response = await verificationService.getQuantity();
        setPendingVerifications(response?.quantity);
      } catch (error) {
        console.error("Error al cargar retiros pendientes:", error);
      }
    };
    fetchPendingCount();
    // Opcional: Actualizar cada 30 segundos
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const STATS: StatCard[] = [
    {
      title: "Supply Total",
      value: isLoadingSupply ? "Cargando..." : totalSupplyFormatted,
      subtitle: "BOBH en circulación",
      detail: "↑ 12.5%  vs mes anterior",
      detailType: "positive",
      icon: <DollarSign className="w-5 h-5 text-teal-400" />,
      iconBg: "bg-teal-500/20",
    },
    {
      title: "Reservas en BOB",
      value: "2,847,932",
      subtitle: "Bs en banco local",
      detail: "✓ 100% Respaldado",
      detailType: "positive",
      icon: <Landmark className="w-5 h-5 text-teal-400" />,
      iconBg: "bg-teal-500/20",
    },
    { 
      title: "Liquidez Inmediata",
      value: "854,380",
      subtitle: "30% del total (BOB)",
      detail: "⚠ Nivel moderado",
      detailType: "warning",
      icon: <TrendingUp className="w-5 h-5 text-teal-400" />,
      iconBg: "bg-teal-500/20",
    },
    {
      title: "Solicitudes Pendientes",
      value: pendingCount !== null ? `${pendingCount + (pendingVerifications || 0)}` : "Cargando...",
      subtitle: "Requieren atención",
      detail: "Verificaciones: "+(pendingVerifications) +" - Retiros: "+(pendingCount) ,
      detailType: "neutral",
      icon: <Clock className="w-5 h-5 text-yellow-400" />,
      iconBg: "bg-yellow-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {STATS.map((stat) => (
        <StatCardItem key={stat.title} stat={stat} />
      ))}
    </div>
  );
}