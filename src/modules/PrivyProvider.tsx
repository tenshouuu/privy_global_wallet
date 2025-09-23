import { PrivyProvider as PrivyProviderBase } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { NEURA_PROVIDER_APP_ID, PRIVY_APP_ID } from './const';
import { neuraTestnet, wagmiConfig } from './config';

import { PrivySample } from './PrivySample';

const queryClient = new QueryClient();

interface PrivyProviderProps {
  children?: React.ReactNode;
}

export function PrivyProvider({ children }: PrivyProviderProps) {
  // @ts-ignore
  // @ts-ignore
  return (
    <PrivyProviderBase
      appId={PRIVY_APP_ID}
      config={{
        loginMethodsAndOrder: { primary: [`privy:${NEURA_PROVIDER_APP_ID}`] },
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },


          showWalletUIs: true,
          // @ts-ignore
          requireUserPasswordOnCreate: true,
        },
        appearance: {
          showWalletLoginFirst: true,
        },
        defaultChain: neuraTestnet,
        supportedChains: [neuraTestnet],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
          <PrivySample />
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProviderBase>
  );
}
