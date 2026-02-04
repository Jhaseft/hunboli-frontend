"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { StatsCards } from "@/components/admin/StatsCards";
import { KycAlertBanner } from "@/components/admin/KycAlertBanner";
import { MintRequestsSection } from "@/components/admin/MintRequestsSection";
import { adminKycService } from "@/services/adminKyc.service";

export default function AdminDashboardPage() {
  const [pendingKyc, setPendingKyc] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    adminKycService
      .getPendingCount()
      .then((count) => {
        if (mounted) setPendingKyc(count ?? 0);
      })
      .catch(() => {
        if (mounted) setPendingKyc(0);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <DashboardHeader
          title="Panel de Control"
          subtitle="Gestión de reservas, emisiones y redenciones"
        />
        <StatsCards />
        <KycAlertBanner pendingCount={pendingKyc} totalDeposits="—" />
        <MintRequestsSection />
      </div>
    </div>
  );
}
