"use client";

import { useEffect, useMemo, useState } from "react";
import { BrowserProvider, Contract, formatEther, formatUnits } from "ethers";

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

export default function WalletBalanceCard() {
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

    // Saldo nativo (ETH) para gas
    const nb = await provider.getBalance(addr);
    setNativeBalance(formatEther(nb));

    // Saldo token (BOBH)
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

      // Si esperas 6 y el contrato dice otro, probablemente es la address equivocada
      if (Number(dec) !== 6) {
        setError(
          `Ojo: el contrato ${TOKEN_ADDRESS} reporta decimals=${Number(dec)} (tú esperabas 6). Puede que NO sea el token BOBH.`
        );
      }
    } catch (e: any) {
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

  const wrongNetwork = chainId !== null && chainId !== EXPECTED_CHAIN_ID;

  const tokenBalanceUI = Number(tokenBalance || "0").toFixed(2);
  const equivalenteBOBUI = tokenBalanceUI; // si 1 BOBH = 1 Bs

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <div
        style={{
          background: "#0c8f75",
          color: "white",
          padding: 20,
          borderRadius: 14,
        }}
      >
        <div style={{ opacity: 0.9, marginBottom: 8 }}>Balance Total</div>

        <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1 }}>
          {tokenBalanceUI}
        </div>

        <div style={{ marginTop: 6, opacity: 0.9 }}>
          {tokenSymbol} {tokenDecimals !== 6 ? `(decimals=${tokenDecimals})` : ""}
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 40, opacity: 0.95 }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>Equivalente BOB</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{equivalenteBOBUI} Bs</div>
          </div>

          <div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>Saldo ETH (gas)</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              {Number(nativeBalance || "0").toFixed(4)} ETH
            </div>
          </div>
        </div>

        {wrongNetwork && (
          <div
            style={{
              marginTop: 12,
              background: "rgba(0,0,0,0.25)",
              padding: 10,
              borderRadius: 10,
            }}
          >
            Red incorrecta. Conéctate a Sepolia (chainId {EXPECTED_CHAIN_ID}).
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: 12,
              background: "rgba(0,0,0,0.25)",
              padding: 10,
              borderRadius: 10,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
          {!address ? (
            <button onClick={connect} style={{ padding: "10px 14px", borderRadius: 10 }}>
              Conectar MetaMask
            </button>
          ) : (
            <>
              <button onClick={refresh} style={{ padding: "10px 14px", borderRadius: 10 }}>
                Actualizar
              </button>
              <div style={{ alignSelf: "center", opacity: 0.9, fontSize: 12 }}>
                {address.slice(0, 6)}…{address.slice(-4)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* DEBUG TEMPORAL */}
      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.85 }}>
        <div>ChainId leído: {chainId ?? "—"}</div>
        <div>Token address: {TOKEN_ADDRESS ?? "—"}</div>
        <div>Wallet: {address || "—"}</div>
      </div>

      <div style={{ marginTop: 14, fontSize: 12, opacity: 0.75 }}>
        Modo prueba (Testnet). Tokens sin valor real.
      </div>
    </div>
  );
}
