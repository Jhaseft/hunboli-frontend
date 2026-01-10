import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { sepolia, hardhat } from 'wagmi/chains'

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? ''
if (!projectId) {
  // En dev, es mejor fallar rápido si falta
  console.warn('Falta NEXT_PUBLIC_WC_PROJECT_ID (WalletConnect Project ID)')
}

const sepoliaRpc = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL

export const wagmiConfig = getDefaultConfig({
  appName: 'HUNBOLI',
  projectId,
  chains: [sepolia, hardhat],
  ssr: true, // importante en Next/App Router
  transports: {
    [sepolia.id]: sepoliaRpc ? http(sepoliaRpc) : http(),
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
})
