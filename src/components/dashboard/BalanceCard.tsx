"use client";

import { Wallet, TrendingUp } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance, useChainId, useReadContracts } from "wagmi";
import { formatUnits } from "viem";

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

export function BalanceCard() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const wrongNetwork = isConnected && chainId !== EXPECTED_CHAIN_ID;

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

  return (
    <div className="bg-gradient-to-br from-green-600 to-cyan-700 rounded-2xl p-8 text-white shadow-lg">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          <h2 className="text-lg font-medium">Balance Total</h2>
        </div>

        <div className="flex items-center gap-3">
          <ConnectButton chainStatus="none"/>
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
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="text-cyan-200 text-sm mb-1">Equivalente BOB</div>
          <div className="text-xl font-semibold">{bobUI} Bs</div>
        </div>
        <div>
          <div className="text-cyan-200 text-sm mb-1">Estado KYC</div>
          <div className="text-xl font-semibold">Pendiente</div>
        </div>
      </div>

      {/* Debug opcional */}
      <div className="mt-6 text-xs text-white/60">
        ETH gas: {native?.formatted ? Number(native.formatted).toFixed(4) : "0.0000"} {native?.symbol ?? "ETH"}
      </div>
    </div>
  );
}
