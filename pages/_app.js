// pages/_app.js
import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

// 1. Define Base as a custom chain
const baseChain = {
  id: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://mainnet.base.org'] },
    public: { http: ['https://mainnet.base.org'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://base.blockscout.com' },
  },
  testnet: false,
};

// 2. Configure chains & providers
const { chains, provider } = configureChains(
  [baseChain],
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
    }),
    publicProvider(),
  ]
);

// 3. Get RainbowKit’s connectors (uses wagmi under the hood)
const { connectors } = getDefaultWallets({
  appName: 'OTEC dApp',
  chains,
});

// 4. Create the Wagmi client
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
