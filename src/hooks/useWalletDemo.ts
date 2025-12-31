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

const INITIAL_BALANCE = 100;

export const useWalletDemo = () => {
  // Use real Sui wallet for connection status
  const { isConnected, shortAddress, walletAddress } = useSuiWallet();
  
  const [walletState, setWalletState] = useState<WalletState>({
    balance: 0,
    transactions: [],
    investments: [],
    pendingReward: null,
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
        investments: [],
        pendingReward: null,
      });
    } else if (!isConnected) {
      // Reset when disconnected
      setWalletState({
        balance: 0,
        transactions: [],
        investments: [],
        pendingReward: null,
      });
    }
  }, [isConnected]);

  const purchase = useCallback((amount: number, itemName: string, merchantId?: number, merchantName?: string, ecoScore?: number): boolean => {
    if (!isConnected) return false;
    if (walletState.balance < amount) return false;

    const rewardAmount = Math.floor(amount * 0.1); // 10% reward

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: "purchase",
      amount: -amount,
      description: `Purchased: ${itemName}`,
      timestamp: new Date(),
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
        ecoScore: ecoScore || 90,
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
