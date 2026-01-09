"use client";

import { useEffect, useMemo, useState } from "react";
import { BrowserProvider, Contract, formatEther, formatUnits } from "ethers";
import { Wallet, TrendingUp } from "lucide-react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

const EXPECTED_CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "11155111");
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_BOBH_ADDRESS as string;

export function BalanceCard() {
  const [address, setAddress] = useState<string>("");
  const [chainId, setChainId] = useState<number | null>(null);

  const [nativeBalance, setNativeBalance] = useState<string>("0");
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [tokenSymbol, setTokenSymbol] = useState<string>("BOBH");
  const [tokenDecimals, setTokenDecimals] = useState<number>(6);

  const [error, setError] = useState<string>("");

  const hasMetaMask = typeof window !== "undefined" && !!window.ethereum;

  const provider = useMemo(() => {
    if (!hasMetaMask) return null;
    return new BrowserProvider(window.ethereum);
  }, [hasMetaMask]);

  const wrongNetwork = chainId !== null && chainId !== EXPECTED_CHAIN_ID;

  async function connect() {
    setError("");
    if (!hasMetaMask) {
      setError("MetaMask no está instalado.");
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    await refresh();
  }

  async function refresh() {
    setError("");
    if (!provider) return;

    const network = await provider.getNetwork();
    const currentChainId = Number(network.chainId);
    setChainId(currentChainId);

    const signer = await provider.getSigner();
    const addr = await signer.getAddress();
    setAddress(addr);

    // ETH (gas) - útil para debug/mostrar si quieres
    const nb = await provider.getBalance(addr);
    setNativeBalance(formatEther(nb));

    // Token (BOBH)
    try {
      if (!TOKEN_ADDRESS) throw new Error("Falta NEXT_PUBLIC_BOBH_ADDRESS");

      const token = new Contract(TOKEN_ADDRESS, ERC20_ABI, provider);
      const [dec, sym, bal] = await Promise.all([
        token.decimals(),
        token.symbol(),
        token.balanceOf(addr),
      ]);

      setTokenDecimals(Number(dec));
      setTokenSymbol(String(sym));
      setTokenBalance(formatUnits(bal, Number(dec)));

      if (Number(dec) !== 6) {
        setError(
          `Ojo: el contrato ${TOKEN_ADDRESS} reporta decimals=${Number(dec)} (tú esperabas 6). Puede que NO sea el token BOBH.`
        );
      }
    } catch {
      setError(
        `No pude leer el token en ${TOKEN_ADDRESS}. Probablemente la address no es un ERC-20 correcto.`
      );
      setTokenBalance("0");
    }
  }

  useEffect(() => {
    if (!hasMetaMask) return;

    const onAccountsChanged = () => refresh();
    const onChainChanged = () => refresh();

    window.ethereum.on("accountsChanged", onAccountsChanged);
    window.ethereum.on("chainChanged", onChainChanged);

    // si ya estaba conectada, carga sin popup
    window.ethereum.request({ method: "eth_accounts" }).then((accs: string[]) => {
      if (accs?.length) refresh();
    });

    return () => {
      window.ethereum.removeListener("accountsChanged", onAccountsChanged);
      window.ethereum.removeListener("chainChanged", onChainChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMetaMask, provider]);

  // UI helpers
  const tokenBalanceUI = Number(tokenBalance || "0").toFixed(2).replace(".", ",");
  const equivalenteBOBUI = tokenBalanceUI; // 1 BOBH = 1 Bs (por ahora)
  const shortAddr = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";

  return (
    <div className="bg-gradient-to-br from-teal-400 to-cyan-700 rounded-2xl p-8 text-white shadow-lg">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          <h2 className="text-lg font-medium">Balance Total</h2>
        </div>

        <div className="flex items-center gap-3">
          {!address ? (
            <button
              onClick={connect}
              className="text-sm px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition"
            >
              Conectar
            </button>
          ) : (
            <>
              <button
                onClick={refresh}
                className="text-sm px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition"
              >
                Actualizar
              </button>
              <span className="text-xs text-white/80">{shortAddr}</span>
            </>
          )}

          <TrendingUp className="w-5 h-5 opacity-70" />
        </div>
      </div>

      <div className="mb-8">
        <div className="text-5xl font-bold mb-2">{tokenBalanceUI}</div>
        <div className="text-cyan-100 text-sm">{tokenSymbol}</div>

        {wrongNetwork && (
          <div className="mt-4 text-sm bg-black/20 rounded-lg px-3 py-2">
            Red incorrecta. Conéctate a Sepolia (chainId {EXPECTED_CHAIN_ID}).
          </div>
        )}

        {error && (
          <div className="mt-4 text-sm bg-black/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="text-cyan-200 text-sm mb-1">Equivalente BOB</div>
          <div className="text-xl font-semibold">{equivalenteBOBUI} Bs</div>
        </div>

        <div>
          <div className="text-cyan-200 text-sm mb-1">Estado KYC</div>
          <div className="text-xl font-semibold">Pendiente</div>
        </div>
      </div>

      {/* Debug opcional: bórralo si no quieres */}
      <div className="mt-6 text-xs text-white/60">
        ETH (gas): {Number(nativeBalance || "0").toFixed(4)} | decimals: {tokenDecimals}
      </div>
    </div>
  );
}
