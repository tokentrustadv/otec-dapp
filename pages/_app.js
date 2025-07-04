import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import { base } from 'wagmi/chains';
import { Toaster } from 'react-hot-toast';

const { chains, publicClient } = configureChains(
  [base],
  [
    jsonRpcProvider({
      rpc: () => ({ http: 'https://mainnet.base.org' }),
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'OTEC Licensing Dapp',
  projectId: 'ced749b38222900677e11e8d3b875b2e', // reuse or update project ID
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <main className="font-sans">
          <Component {...pageProps} />
        </main>
        <Toaster position="top-right" />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
