import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { networkConfig } from "@/lib/sui-config";
import "@mysten/dapp-kit/dist/index.css";

const queryClient = new QueryClient();

interface SuiWalletProviderProps {
  children: React.ReactNode;
}

export const SuiWalletProvider = ({ children }: SuiWalletProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
        <WalletProvider autoConnect>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};
