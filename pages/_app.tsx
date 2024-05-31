import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http } from 'wagmi';
import {
  sepolia
} from 'wagmi/chains';
import { Chain, getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';

const anvil: Chain = {
  id: 31_337,
  name: 'Anvil',
  nativeCurrency: {
    decimals: 18,
    symbol: 'AETH',
    name: 'Anvil Ether',
  },
  rpcUrls: {
    public: {http: ['http://localhost:8545']},
    default: {http: ['http://localhost:8545']}
  },
  testnet: true
}

const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    anvil,
    sepolia
  ],
  ssr: true,
});

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
