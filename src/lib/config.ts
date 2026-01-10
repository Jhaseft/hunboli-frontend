
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, bscTestnet } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: process.env.NEXT_PUBLIC_WC_PROJECT_NAME,
    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID, // <--- PEGA TU ID AQUÍ
    chains: [sepolia, bscTestnet], // Las redes que soportas
    ssr: true, // Server Side Rendering (Importante para Next.js)
});