"use client";

import { DollarSign, Landmark, TrendingUp, Clock } from "lucide-react";
import type { ReactNode } from "react";

interface StatCard {
  title: string;
  value: string;
  subtitle: string;
  detail?: string;
  detailType?: "positive" | "warning" | "neutral";
  icon: ReactNode;
  iconBg: string;
}

const STATS: StatCard[] = [
  {
    title: "Supply Total",
    value: "2,847,932",
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
    value: "7",
    subtitle: "Requieren atención",
    detail: "5 Mint • 2 Redeem",
    detailType: "neutral",
    icon: <Clock className="w-5 h-5 text-yellow-400" />,
    iconBg: "bg-yellow-500/20",
  },
];

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
          className={`text-xs ${
            stat.detailType ? detailColor[stat.detailType] : "text-gray-400"
          }`}
        >
          {stat.detail}
        </div>
      )}
    </div>
  );
}

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {STATS.map((stat) => (
        <StatCardItem key={stat.title} stat={stat} />
      ))}
    </div>
  );
}
