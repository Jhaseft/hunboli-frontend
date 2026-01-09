
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, bscTestnet } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'HUNBOLI',
    projectId: '693f4df90fbe52ab9283a245264a369c', // <--- PEGA TU ID AQUÍ
    chains: [sepolia, bscTestnet], // Las redes que soportas
    ssr: true, // Server Side Rendering (Importante para Next.js)
});