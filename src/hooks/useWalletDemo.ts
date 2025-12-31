import { useState, useCallback } from "react";

export interface WalletState {
  isConnected: boolean;
  address: string | null;
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

const DEMO_ADDRESS = "0x7b2c...4f8a";
const INITIAL_BALANCE = 100;

export const useWalletDemo = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: 0,
    transactions: [],
  });

  const connect = useCallback(() => {
    setWallet({
      isConnected: true,
      address: DEMO_ADDRESS,
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
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      isConnected: false,
      address: null,
      balance: 0,
      transactions: [],
    });
  }, []);

  const purchase = useCallback((amount: number, itemName: string): boolean => {
    if (!wallet.isConnected) return false;
    if (wallet.balance < amount) return false;

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: "purchase",
      amount: -amount,
      description: `Purchased: ${itemName}`,
      timestamp: new Date(),
    };

    setWallet((prev) => ({
      ...prev,
      balance: prev.balance - amount,
      transactions: [newTransaction, ...prev.transactions],
    }));

    return true;
  }, [wallet.isConnected, wallet.balance]);

  const addReward = useCallback((amount: number, reason: string) => {
    if (!wallet.isConnected) return;

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: "reward",
      amount: amount,
      description: reason,
      timestamp: new Date(),
    };

    setWallet((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      transactions: [newTransaction, ...prev.transactions],
    }));
  }, [wallet.isConnected]);

  return {
    wallet,
    connect,
    disconnect,
    purchase,
    addReward,
  };
};
