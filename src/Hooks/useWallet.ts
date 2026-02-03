import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { connectorsForWallets, wallet } from '@rainbow-me/rainbowkit';

export const useWallet = () => {
  const { connectAsync } = useConnect({
    connector: wallet.metaMask({ chains: [{ id: 11155111, name: 'Sepolia' }] }),
  });
  const { disconnectAsync } = useDisconnect();
  const { address, isConnected } = useAccount();

  const connect = async () => {
    const { account } = await connectAsync();
    return account;
  };

  const disconnect = async () => await disconnectAsync();

  return { connect, disconnect, address, isConnected };
};
