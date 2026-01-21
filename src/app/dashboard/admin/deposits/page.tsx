import { AdminDeposits } from "@/components/dashboard/deposits/AdminDeposits";

export default function AdminDepositsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-x-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminDeposits />
        </div>
    </div>
  );
}
