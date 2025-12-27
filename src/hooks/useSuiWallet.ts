import { 
  useCurrentAccount, 
  useCurrentWallet,
  useDisconnectWallet,
  useSignAndExecuteTransaction,
  useSuiClient,
  useConnectWallet,
  useWallets
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

export const useSuiWallet = () => {
  const currentAccount = useCurrentAccount();
  const { currentWallet, connectionStatus } = useCurrentWallet();
  const { mutate: disconnect } = useDisconnectWallet();
  const { mutate: signAndExecute, isPending: isExecuting } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();

  const isConnected = connectionStatus === "connected";
  const isConnecting = connectionStatus === "connecting";

  const walletAddress = useMemo(() => {
    return currentAccount?.address || null;
  }, [currentAccount]);

  const shortAddress = useMemo(() => {
    if (!walletAddress) return null;
    return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  }, [walletAddress]);

  const executeTransaction = useCallback(
    async (transaction: Transaction, options?: { onSuccess?: () => void; onError?: (error: Error) => void }) => {
      if (!isConnected) {
        toast.error("Please connect your wallet first");
        return null;
      }

      return new Promise((resolve, reject) => {
        signAndExecute(
          { transaction },
          {
            onSuccess: (result) => {
              toast.success("Transaction successful!");
              console.log("Transaction result:", result);
              options?.onSuccess?.();
              resolve(result);
            },
            onError: (error) => {
              toast.error(`Transaction failed: ${error.message}`);
              console.error("Transaction error:", error);
              options?.onError?.(error);
              reject(error);
            },
          }
        );
      });
    },
    [isConnected, signAndExecute]
  );

  const getBalance = useCallback(async () => {
    if (!walletAddress) return null;
    try {
      const balance = await suiClient.getBalance({
        owner: walletAddress,
      });
      return balance;
    } catch (error) {
      console.error("Error fetching balance:", error);
      return null;
    }
  }, [walletAddress, suiClient]);

  const connectWallet = useCallback((wallet: typeof wallets[0]) => {
    connect({ wallet });
  }, [connect]);

  const disconnectWallet = useCallback(() => {
    disconnect();
    toast.success("Wallet disconnected");
  }, [disconnect]);

  return {
    // Connection state
    isConnected,
    isConnecting,
    isExecuting,
    connectionStatus,
    
    // Wallet info
    currentWallet,
    currentAccount,
    walletAddress,
    shortAddress,
    wallets,
    
    // Actions
    connectWallet,
    disconnectWallet,
    executeTransaction,
    getBalance,
    suiClient,
  };
};
