import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { StatsCards } from "@/components/admin/StatsCards";
import { KycAlertBanner } from "@/components/admin/KycAlertBanner";
import { MintRequestsSection } from "@/components/admin/MintRequestsSection";

export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <DashboardHeader
          title="Panel de Control"
          subtitle="Gestión de reservas, emisiones y redenciones"
        />
        <StatsCards />
        <KycAlertBanner pendingCount={3} totalDeposits="45,000 Bs" />
        <MintRequestsSection />
      </div>
    </div>
  );
}
