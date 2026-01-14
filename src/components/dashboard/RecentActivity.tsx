"use client";

import { useEffect, useState } from "react";
import { useAccount, useChainId, usePublicClient, useReadContracts } from "wagmi";
import { formatUnits, parseAbiItem } from "viem";

const EXPECTED_CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "11155111");
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_BOBH_ADDRESS as `0x${string}`;

const TRANSFER_EVENT = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)"
);

type ActivityItem = {
  type: "in" | "out";
  amount: string; // "12,34"
  counterparty: `0x${string}`;
  hash: `0x${string}`;
  blockNumber: bigint;
};

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function RecentActivity() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  // ✅ Fuerza el client a la chain esperada (evita que consulte otra red)
  const client = usePublicClient({ chainId: EXPECTED_CHAIN_ID });

  const wrongNetwork = isConnected && chainId !== EXPECTED_CHAIN_ID;
  const tokenEnabled = !!address && !!TOKEN_ADDRESS && !wrongNetwork && !!client;

  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Leemos decimals y symbol para formatear correctamente
  const { data: meta } = useReadContracts({
    contracts: tokenEnabled
      ? [
          {
            address: TOKEN_ADDRESS,
            abi: [
              {
                type: "function",
                name: "decimals",
                stateMutability: "view",
                inputs: [],
                outputs: [{ type: "uint8" }],
              },
            ] as const,
            functionName: "decimals",
          },
          {
            address: TOKEN_ADDRESS,
            abi: [
              {
                type: "function",
                name: "symbol",
                stateMutability: "view",
                inputs: [],
                outputs: [{ type: "string" }],
              },
            ] as const,
            functionName: "symbol",
          },
        ]
      : [],
    query: { enabled: tokenEnabled },
  });

  const decimals = (meta?.[0]?.result as number | undefined) ?? 6;
  const symbol = (meta?.[1]?.result as string | undefined) ?? "BOBH";

  useEffect(() => {
    if (!tokenEnabled) {
      setItems([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ ARREGLO 1: consultar SOLO los últimos 1000 bloques
        // thirdweb RPC limita eth_getLogs a 1000 bloques máximo.
        const latest = await client!.getBlockNumber();
        const CHUNK = 1000n;

        const fromBlock = latest > CHUNK ? latest - CHUNK : 0n;
        const toBlock = latest;

        const inLogs = await client!.getLogs({
          address: TOKEN_ADDRESS,
          event: TRANSFER_EVENT,
          args: { to: address! },
          fromBlock,
          toBlock,
        });

        const outLogs = await client!.getLogs({
          address: TOKEN_ADDRESS,
          event: TRANSFER_EVENT,
          args: { from: address! },
          fromBlock,
          toBlock,
        });

        const mapLog = (log: any, type: "in" | "out"): ActivityItem => {
          const value = log.args.value as bigint;
          const amountRaw = formatUnits(value, decimals);
          const amount = Number(amountRaw || "0").toFixed(2).replace(".", ",");

          const counterparty =
            type === "in"
              ? (log.args.from as `0x${string}`)
              : (log.args.to as `0x${string}`);

          return {
            type,
            amount,
            counterparty,
            hash: log.transactionHash as `0x${string}`,
            blockNumber: log.blockNumber as bigint,
          };
        };

        const merged = [
          ...inLogs.map((l) => mapLog(l, "in")),
          ...outLogs.map((l) => mapLog(l, "out")),
        ]
          .sort((a, b) => (a.blockNumber > b.blockNumber ? -1 : 1))
          .slice(0, 10);

        if (!cancelled) setItems(merged);
      } catch (e: any) {
        console.error("RecentActivity getLogs error:", e);

        const msg =
          e?.shortMessage ||
          e?.details ||
          e?.message ||
          "No se pudo cargar la actividad reciente.";

        if (!cancelled) {
          setError(msg);
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [tokenEnabled, client, address, decimals]);

  return (
    <div className="bg-[#0f1e33] rounded-2xl p-6 shadow-sm border border-gray-800">
      <h2 className="text-xl font-semibold mb-6 text-white">Actividad Reciente</h2>

      {wrongNetwork && (
        <div className="text-sm text-yellow-300 bg-yellow-600/10 border border-yellow-500/20 rounded-lg px-3 py-2 mb-4">
          Red incorrecta. Conéctate a chainId {EXPECTED_CHAIN_ID}.
        </div>
      )}

      {!TOKEN_ADDRESS && (
        <div className="text-sm text-yellow-300 bg-yellow-600/10 border border-yellow-500/20 rounded-lg px-3 py-2 mb-4">
          Falta NEXT_PUBLIC_BOBH_ADDRESS en .env.local
        </div>
      )}

      {!address && (
        <div className="flex items-center justify-center py-10">
          <p className="text-gray-400 text-center">Conecta tu wallet para ver tu actividad</p>
        </div>
      )}

      {address && tokenEnabled && loading && (
        <div className="flex items-center justify-center py-10">
          <p className="text-gray-400 text-center">Cargando actividad...</p>
        </div>
      )}

      {address && tokenEnabled && !loading && error && (
        <div className="flex items-center justify-center py-10">
          <p className="text-gray-400 text-center">{error}</p>
        </div>
      )}

      {address && tokenEnabled && !loading && !error && items.length === 0 && (
        <div className="flex items-center justify-center py-10">
          <p className="text-gray-400 text-center">No hay transacciones aún</p>
        </div>
      )}

      {address && tokenEnabled && !loading && !error && items.length > 0 && (
        <div className="space-y-3">
          {items.map((tx) => (
            <div
              key={`${tx.hash}-${tx.type}`}
              className="flex items-center justify-between rounded-xl border border-gray-800 bg-white/5 px-4 py-3"
            >
              <div className="min-w-0">
                <div className="text-white font-medium">
                  {tx.type === "in" ? "Received" : "Send"}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {tx.type === "in" ? "from " : "to "} {shortAddr(tx.counterparty)}
                </div>
              </div>

              <div className={`font-semibold ${tx.type === "in" ? "text-green-300" : "text-red-300"}`}>
                {tx.type === "in" ? "+" : "-"} {tx.amount} {symbol}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
