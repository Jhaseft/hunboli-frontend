"use client";

import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { StatsCards } from "@/components/admin/StatsCards";

export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <DashboardHeader
          title="Panel de Control"
          subtitle="Gestión de reservas, emisiones y redenciones"
        />
        <StatsCards />
      </div>
    </div>
  );
}
