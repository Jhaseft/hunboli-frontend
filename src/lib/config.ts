
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, bscTestnet } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'HUNBOLI App',
    projectId: 'TU_PROJECT_ID_DE_WALLETCONNECT', // <--- PEGA TU ID AQUÍ
    chains: [sepolia, bscTestnet], // Las redes que soportas
    ssr: true, // Server Side Rendering (Importante para Next.js)
});