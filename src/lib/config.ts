
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, bscTestnet } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: process.env.NEXT_PUBLIC_WC_PROJECT_NAME as string, // <--- PEGA TU NOMBRE AQUÍ
    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID as string, // <--- PEGA TU ID AQUÍ
    chains: [sepolia, bscTestnet], // Las redes que soportas
    ssr: true, // Server Side Rendering (Importante para Next.js)
});