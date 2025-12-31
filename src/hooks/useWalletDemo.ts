import { useState, useCallback, useEffect } from "react";
import { useSuiWallet } from "./useSuiWallet";

export interface WalletState {
  balance: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: "purchase" | "reward" | "stake";
  amount: number;
  description: string;
  timestamp: Date;
}

const INITIAL_BALANCE = 100;

export const useWalletDemo = () => {
  // Use real Sui wallet for connection status
  const { isConnected, shortAddress, walletAddress } = useSuiWallet();
  
  const [walletState, setWalletState] = useState<WalletState>({
    balance: 0,
    transactions: [],
  });

  // When wallet connects, initialize with demo balance
  useEffect(() => {
    if (isConnected && walletState.balance === 0 && walletState.transactions.length === 0) {
      setWalletState({
        balance: INITIAL_BALANCE,
        transactions: [
          {
            id: "init-1",
            type: "reward",
            amount: 100,
            description: "Welcome bonus - Demo ECO tokens",
            timestamp: new Date(),
          },
        ],
      });
    } else if (!isConnected) {
      // Reset when disconnected
      setWalletState({
        balance: 0,
        transactions: [],
      });
    }
  }, [isConnected]);

  const purchase = useCallback((amount: number, itemName: string): boolean => {
    if (!isConnected) return false;
    if (walletState.balance < amount) return false;

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: "purchase",
      amount: -amount,
      description: `Purchased: ${itemName}`,
      timestamp: new Date(),
    };

    setWalletState((prev) => ({
      ...prev,
      balance: prev.balance - amount,
      transactions: [newTransaction, ...prev.transactions],
    }));

    return true;
  }, [isConnected, walletState.balance]);

  const addReward = useCallback((amount: number, reason: string) => {
    if (!isConnected) return;

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: "reward",
      amount: amount,
      description: reason,
      timestamp: new Date(),
    };

    setWalletState((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      transactions: [newTransaction, ...prev.transactions],
    }));
  }, [isConnected]);

  return {
    // Real wallet connection status
    isConnected,
    address: shortAddress,
    fullAddress: walletAddress,
    
    // Demo ECO balance
    balance: walletState.balance,
    transactions: walletState.transactions,
    
    // Actions
    purchase,
    addReward,
  };
};
