import WalletBalanceCard from "../../components/dashboard/WalletBalanceCard";

export default function BalanceTestPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>
        HUNBOLI – Balance Test (Sepolia)
      </h1>
      <WalletBalanceCard />
    </main>
  );
}
