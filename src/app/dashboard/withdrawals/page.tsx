import HistorialRetiroPage from "@/components/dashboard/withdrawals/MyWithdrawals";

export default function WithdrawalsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-x-hidden">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HistorialRetiroPage />
      </div>
    </div>
  );
}