import { useState, useCallback, useEffect } from "react";
import { useSuiWallet } from "./useSuiWallet";

export interface WalletState {
  balance: number;
  transactions: Transaction[];
  investments: Investment[];
  pendingReward: PendingReward | null;
}

export interface Transaction {
  id: string;
  type: "purchase" | "reward" | "stake" | "reinvest" | "airdrop";
  amount: number;
  description: string;
  timestamp: Date;
  productName?: string;
  co2Saved?: number;
  ecoScore?: number;
}

export interface Investment {
  id: string;
  projectId: number;
  projectName: string;
  amount: number;
  investedAt: Date;
  status: "operational" | "booming" | "critical" | "success" | "failed";
  estimatedROI: number;
  lockEndDate: Date;
  ecoScore: number;
  co2Offset: number;
}

export interface PendingReward {
  amount: number;
  productName: string;
  productId: number;
  merchantName: string;
  merchantId: number;
  ecoScore: number;
}

const INITIAL_BALANCE = 1000;
const STORAGE_KEY = "ecoshop_wallet_state";

// Helper to serialize/deserialize dates
const serializeState = (state: WalletState): string => {
  return JSON.stringify(state, (key, value) => {
    if (value instanceof Date) {
      return { __isDate: true, value: value.toISOString() };
    }
    return value;
  });
};

const deserializeState = (json: string): WalletState => {
  return JSON.parse(json, (key, value) => {
    if (value && typeof value === 'object' && value.__isDate) {
      return new Date(value.value);
    }
    return value;
  });
};

const getInitialState = (): WalletState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return deserializeState(saved);
    }
  } catch (e) {
    console.error("Failed to load wallet state:", e);
  }
  return {
    balance: 0,
    transactions: [],
    investments: [],
    pendingReward: null,
  };
};

export const useWalletDemo = () => {
  // Use real Sui wallet for connection status
  const { isConnected, shortAddress, walletAddress } = useSuiWallet();
  
  const [walletState, setWalletState] = useState<WalletState>(getInitialState);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (walletState.balance > 0 || walletState.transactions.length > 0) {
      localStorage.setItem(STORAGE_KEY, serializeState(walletState));
    }
  }, [walletState]);

  // When wallet connects, initialize with demo balance if empty
  useEffect(() => {
    if (isConnected && walletState.balance === 0 && walletState.transactions.length === 0) {
      const initialState: WalletState = {
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
        investments: [],
        pendingReward: null,
      };
      setWalletState(initialState);
      localStorage.setItem(STORAGE_KEY, serializeState(initialState));
    } else if (!isConnected) {
      // Clear state when disconnected
      const emptyState: WalletState = {
        balance: 0,
        transactions: [],
        investments: [],
        pendingReward: null,
      };
      setWalletState(emptyState);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [isConnected]);

  const purchase = useCallback((amount: number, itemName: string, merchantId?: number, merchantName?: string, ecoScore?: number): boolean => {
    if (!isConnected) return false;
    if (walletState.balance < amount) return false;

    const productEcoScore = ecoScore || 90;
    const co2Saved = (productEcoScore / 100) * (amount / 10); // CO2 based on eco score and price
    const rewardAmount = Math.floor(amount * 0.1); // 10% reward

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: "purchase",
      amount: -amount,
      description: `Purchased: ${itemName}`,
      timestamp: new Date(),
      productName: itemName,
      co2Saved: parseFloat(co2Saved.toFixed(2)),
      ecoScore: productEcoScore,
    };

    // Set pending reward for reinvest decision
    setWalletState((prev) => ({
      ...prev,
      balance: prev.balance - amount,
      transactions: [newTransaction, ...prev.transactions],
      pendingReward: {
        amount: rewardAmount,
        productName: itemName,
        productId: Date.now(),
        merchantName: merchantName || "EcoShop Partner",
        merchantId: merchantId || 1,
        ecoScore: productEcoScore,
      },
    }));

    return true;
  }, [isConnected, walletState.balance]);

  const collectReward = useCallback(() => {
    if (!isConnected || !walletState.pendingReward) return;

    const reward = walletState.pendingReward;
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: "reward",
      amount: reward.amount,
      description: `ECO Reward from ${reward.productName}`,
      timestamp: new Date(),
    };

    setWalletState((prev) => ({
      ...prev,
      balance: prev.balance + reward.amount,
      transactions: [newTransaction, ...prev.transactions],
      pendingReward: null,
    }));
  }, [isConnected, walletState.pendingReward]);

  const reinvestReward = useCallback((projectName: string, projectId: number) => {
    if (!isConnected || !walletState.pendingReward) return;

    const reward = walletState.pendingReward;
    const lockEndDate = new Date();
    lockEndDate.setMonth(lockEndDate.getMonth() + 6); // 6 months lock

    const newInvestment: Investment = {
      id: `inv-${Date.now()}`,
      projectId,
      projectName,
      amount: reward.amount,
      investedAt: new Date(),
      status: "operational",
      estimatedROI: 500, // 500%
      lockEndDate,
      ecoScore: reward.ecoScore,
      co2Offset: Math.floor(reward.amount * 0.5),
    };

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: "reinvest",
      amount: -reward.amount,
      description: `Reinvested in ${projectName}`,
      timestamp: new Date(),
    };

    setWalletState((prev) => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions],
      investments: [newInvestment, ...prev.investments],
      pendingReward: null,
    }));
  }, [isConnected, walletState.pendingReward]);

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

  const claimAirdrop = useCallback((investmentId: string) => {
    if (!isConnected) return;

    const investment = walletState.investments.find(inv => inv.id === investmentId);
    if (!investment || investment.status !== "success") return;

    const bonus = Math.floor(investment.amount * (investment.estimatedROI / 100));
    const totalPayout = investment.amount + bonus;

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: "airdrop",
      amount: totalPayout,
      description: `Airdrop from ${investment.projectName} (+${bonus} bonus)`,
      timestamp: new Date(),
    };

    setWalletState((prev) => ({
      ...prev,
      balance: prev.balance + totalPayout,
      transactions: [newTransaction, ...prev.transactions],
      investments: prev.investments.map(inv => 
        inv.id === investmentId ? { ...inv, status: "success" as const } : inv
      ),
    }));
  }, [isConnected, walletState.investments]);

  // Calculate totals
  const totalInvested = walletState.investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCO2Offset = walletState.investments.reduce((sum, inv) => sum + inv.co2Offset, 0);
  const activeInvestments = walletState.investments.filter(inv => 
    inv.status === "operational" || inv.status === "booming" || inv.status === "critical"
  );

  return {
    // Real wallet connection status
    isConnected,
    address: shortAddress,
    fullAddress: walletAddress,
    
    // Demo ECO balance
    balance: walletState.balance,
    transactions: walletState.transactions,
    
    // Investment data
    investments: walletState.investments,
    activeInvestments,
    totalInvested,
    totalCO2Offset,
    pendingReward: walletState.pendingReward,
    
    // Actions
    purchase,
    addReward,
    collectReward,
    reinvestReward,
    claimAirdrop,
  };
};
