"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Wallet, TrendingUp, Link as LinkIcon, AlertTriangle } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance, useChainId, useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { useAuth } from "@/context/AuthContext";
type BalanceCardProps = {
  onBalanceChange?: (balance: string) => void;
};
const EXPECTED_CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "11155111");
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_BOBH_ADDRESS as `0x${string}`;

// ABI minimal ERC20 (Viem style)
const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
] as const;

export function BalanceCard({ onBalanceChange }: BalanceCardProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { user } = useAuth();
  const router = useRouter();

  const wrongNetwork = isConnected && chainId !== EXPECTED_CHAIN_ID;

  // Estados de wallet - normalizar a minúsculas para comparación consistente
  const hasLinkedWallet = !!user?.walletAddress;
  const linkedWalletLower = user?.walletAddress?.toLowerCase();
  const connectedWalletLower = address?.toLowerCase();
  const isWalletLinked = isConnected && address && linkedWalletLower === connectedWalletLower;
  const isWrongWallet = isConnected && address && hasLinkedWallet && linkedWalletLower !== connectedWalletLower;
  const canLinkWallet = isConnected && address && !hasLinkedWallet;

  const handleGoToLinkWallet = () => {
    router.push("/dashboard/settings/security");
  };

  const { data: native } = useBalance({
    address,
    query: { enabled: !!address },
  });

  const tokenEnabled = !!address && !!TOKEN_ADDRESS && !wrongNetwork;

  const { data: tokenReads } = useReadContracts({
    contracts: tokenEnabled
      ? [
        { address: TOKEN_ADDRESS, abi: ERC20_ABI, functionName: "decimals" },
        { address: TOKEN_ADDRESS, abi: ERC20_ABI, functionName: "symbol" },
        { address: TOKEN_ADDRESS, abi: ERC20_ABI, functionName: "balanceOf", args: [address!] },
      ]
      : [],
    query: { enabled: tokenEnabled },
  }); // hook oficial para múltiples lecturas :contentReference[oaicite:5]{index=5}

  const decimals = (tokenReads?.[0]?.result as number | undefined) ?? 6;
  const symbol = (tokenReads?.[1]?.result as string | undefined) ?? "BOBH";
  const rawBal = (tokenReads?.[2]?.result as bigint | undefined) ?? 0n;

  const tokenBalance = formatUnits(rawBal, decimals);
  const tokenUI = Number(tokenBalance || "0").toFixed(2).replace(".", ",");
  const bobUI = tokenUI;

  useEffect(() => {
    if (onBalanceChange) {
      onBalanceChange(tokenBalance); // valor real (no formateado)
    }
  }, [tokenBalance, onBalanceChange]);

  return (
    <div className="bg-gradient-to-br from-green-600 to-cyan-700 rounded-2xl p-8 text-white shadow-lg">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          <h2 className="text-lg font-medium">Balance Total</h2>
        </div>

        <div className="flex items-center gap-3">
          <ConnectButton
            label="Conectar"
            chainStatus="none"
            showBalance={false}
          />
          <TrendingUp className="w-5 h-5 opacity-70" />
        </div>
      </div>

      <div className="mb-8">
        <div className="text-5xl font-bold mb-2">{tokenUI}</div>
        <div className="text-cyan-100 text-sm">{symbol}</div>

        {wrongNetwork && (
          <div className="mt-4 text-sm bg-black/20 rounded-lg px-3 py-2">
            Red incorrecta. Conéctate a chainId {EXPECTED_CHAIN_ID}.
          </div>
        )}

        {!TOKEN_ADDRESS && (
          <div className="mt-4 text-sm bg-black/20 rounded-lg px-3 py-2">
            Falta NEXT_PUBLIC_BOBH_ADDRESS en .env.local
          </div>
        )}

        {/* Mostrar botón de vincular si no tiene wallet vinculada */}
        {canLinkWallet && !wrongNetwork && (
          <button
            onClick={handleGoToLinkWallet}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg px-4 py-3 transition-colors"
          >
            <LinkIcon className="w-4 h-4" />
            Vincular esta wallet a mi cuenta
          </button>
        )}

        {/* Advertencia: wallet conectada diferente a la vinculada */}
        {isWrongWallet && !wrongNetwork && (
          <div className="mt-3 flex items-center gap-2 bg-amber-500/20 text-amber-200 rounded-lg px-3 py-2 text-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Wallet no vinculada —</span>
            <button
              onClick={handleGoToLinkWallet}
              className="underline hover:text-white transition-colors font-medium"
            >
              Cambiar en ajustes
            </button>
          </div>
        )}

        {/* Mensaje de éxito: wallet vinculada correctamente */}
        {isWalletLinked && (
          <div className="mt-4 text-sm bg-green-500/20 text-white rounded-lg px-3 py-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Wallet vinculada a tu cuenta
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="text-cyan-200 text-sm mb-1">Equivalente BOB</div>
          <div className="text-xl font-semibold">{bobUI} Bs</div>
        </div>
        <div>
          <div className="text-cyan-200 text-sm mb-1">BNB gas:</div>
          <div className="text-xl font-semibold">
            {native?.formatted ? Number(native.formatted).toFixed(4) : "0.0000"} {native?.symbol ?? "ETH"}
          </div>
        </div>
      </div>

    </div>
  );
}
