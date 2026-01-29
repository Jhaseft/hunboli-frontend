"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface KycAlertBannerProps {
  pendingCount: number;
  totalDeposits: string;
}

export function KycAlertBanner({ pendingCount, totalDeposits }: KycAlertBannerProps) {
  if (pendingCount === 0) return null;

  return (
    <div className="bg-[#0f1e33] border border-gray-800 rounded-xl px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="bg-yellow-500/20 rounded-full p-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <p className="text-white font-semibold">
            {pendingCount} usuarios con KYC pendiente de revisión
          </p>
          <p className="text-sm text-gray-400">
            Depósitos totales: {totalDeposits}
          </p>
        </div>
      </div>
      <Link
        href="/admin/kyc"
        className="bg-red-500 hover:bg-red-400 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
      >
        Revisar
      </Link>
    </div>
  );
}
