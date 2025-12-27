import { useCallback, useEffect, useState } from "react";
import { useSuiClient, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { toast } from "sonner";

// Contract addresses - Update these after deploying to testnet
export const CONTRACT_CONFIG = {
  // Package ID after deployment
  PACKAGE_ID: "0x0", // TODO: Update after deployment
  
  // Object IDs after deployment
  TREASURY_CAP_ID: "0x0", // TODO: Update after deployment
  MINTER_CAP_ID: "0x0", // TODO: Update after deployment
  TOKEN_INFO_ID: "0x0", // TODO: Update after deployment
  MARKETPLACE_CONFIG_ID: "0x0", // TODO: Update after deployment
  STAKING_POOL_ID: "0x0", // TODO: Update after deployment
  
  // Clock object (standard)
  CLOCK_ID: "0x6",
};

export interface Product {
  id: string;
  name: string;
  price: bigint;
  ecoScore: number;
  co2ReductionValue: bigint;
  imageUrl: string;
  merchant: string;
  quantity: number;
  isActive: boolean;
}

export interface RewardDistributedEvent {
  buyer: string;
  productId: string;
  productName: string;
  purchaseAmount: bigint;
  ecoReward: bigint;
  co2Offset: bigint;
  ecoScore: number;
  timestamp: bigint;
}

export interface StakePosition {
  id: string;
  stakedAmount: bigint;
  startTime: bigint;
  lockDuration: bigint;
  apyRate: number;
  rewardsClaimed: bigint;
}

export const useEcoContract = () => {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute, isPending } = useSignAndExecuteTransaction();
  
  const [balance, setBalance] = useState<bigint>(0n);
  const [products, setProducts] = useState<Product[]>([]);
  const [stakes, setStakes] = useState<StakePosition[]>([]);
  
  const address = currentAccount?.address;

  // Fetch ECO token balance
  const fetchBalance = useCallback(async () => {
    if (!address || CONTRACT_CONFIG.PACKAGE_ID === "0x0") return;
    
    try {
      const coins = await suiClient.getCoins({
        owner: address,
        coinType: `${CONTRACT_CONFIG.PACKAGE_ID}::eco_token::ECO_TOKEN`,
      });
      
      const total = coins.data.reduce(
        (sum, coin) => sum + BigInt(coin.balance),
        0n
      );
      
      setBalance(total);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }, [address, suiClient]);

  // Subscribe to RewardDistributed events for bloom animation
  const subscribeToRewards = useCallback(
    (onReward: (event: RewardDistributedEvent) => void) => {
      if (CONTRACT_CONFIG.PACKAGE_ID === "0x0") return () => {};
      
      const unsubscribe = suiClient.subscribeEvent({
        filter: {
          MoveEventType: `${CONTRACT_CONFIG.PACKAGE_ID}::marketplace::RewardDistributed`,
        },
        onMessage: (event) => {
          const data = event.parsedJson as any;
          onReward({
            buyer: data.buyer,
            productId: data.product_id,
            productName: new TextDecoder().decode(new Uint8Array(data.product_name)),
            purchaseAmount: BigInt(data.purchase_amount),
            ecoReward: BigInt(data.eco_reward),
            co2Offset: BigInt(data.co2_offset),
            ecoScore: data.eco_score,
            timestamp: BigInt(data.timestamp),
          });
        },
      });
      
      return () => unsubscribe;
    },
    [suiClient]
  );

  // Purchase product and receive ECO rewards
  const purchaseProduct = useCallback(
    async (productId: string, priceInMist: bigint) => {
      if (!address) {
        toast.error("Please connect your wallet");
        return null;
      }

      try {
        const tx = new Transaction();
        
        // Split SUI for payment
        const [paymentCoin] = tx.splitCoins(tx.gas, [priceInMist]);
        
        tx.moveCall({
          target: `${CONTRACT_CONFIG.PACKAGE_ID}::marketplace::purchase_and_reward`,
          arguments: [
            tx.object(CONTRACT_CONFIG.TREASURY_CAP_ID),
            tx.object(CONTRACT_CONFIG.MINTER_CAP_ID),
            tx.object(CONTRACT_CONFIG.TOKEN_INFO_ID),
            tx.object(CONTRACT_CONFIG.MARKETPLACE_CONFIG_ID),
            tx.object(productId),
            paymentCoin,
            tx.object(CONTRACT_CONFIG.CLOCK_ID),
          ],
        });

        const result = await signAndExecute({ transaction: tx });
        toast.success("Purchase successful! ECO tokens rewarded 🌱");
        
        // Refresh balance
        await fetchBalance();
        
        return result;
      } catch (error: any) {
        toast.error(`Purchase failed: ${error.message}`);
        return null;
      }
    },
    [address, signAndExecute, fetchBalance]
  );

  // Stake ECO tokens
  const stakeTokens = useCallback(
    async (ecoCoinId: string, amount: bigint, durationDays: number) => {
      if (!address) {
        toast.error("Please connect your wallet");
        return null;
      }

      try {
        const tx = new Transaction();
        
        // Duration in milliseconds
        const duration = BigInt(durationDays * 24 * 60 * 60 * 1000);
        
        // Split ECO coins for staking
        const [stakeCoin] = tx.splitCoins(tx.object(ecoCoinId), [amount]);
        
        tx.moveCall({
          target: `${CONTRACT_CONFIG.PACKAGE_ID}::staking::stake`,
          arguments: [
            tx.object(CONTRACT_CONFIG.STAKING_POOL_ID),
            stakeCoin,
            tx.pure.u64(duration),
            tx.object(CONTRACT_CONFIG.CLOCK_ID),
          ],
        });

        const result = await signAndExecute({ transaction: tx });
        toast.success(`Staked ${Number(amount) / 1e9} ECO for ${durationDays} days!`);
        
        return result;
      } catch (error: any) {
        toast.error(`Staking failed: ${error.message}`);
        return null;
      }
    },
    [address, signAndExecute]
  );

  // Unstake tokens
  const unstakeTokens = useCallback(
    async (stakePositionId: string) => {
      if (!address) {
        toast.error("Please connect your wallet");
        return null;
      }

      try {
        const tx = new Transaction();
        
        tx.moveCall({
          target: `${CONTRACT_CONFIG.PACKAGE_ID}::staking::unstake`,
          arguments: [
            tx.object(CONTRACT_CONFIG.TREASURY_CAP_ID),
            tx.object(CONTRACT_CONFIG.MINTER_CAP_ID),
            tx.object(CONTRACT_CONFIG.TOKEN_INFO_ID),
            tx.object(CONTRACT_CONFIG.STAKING_POOL_ID),
            tx.object(stakePositionId),
            tx.object(CONTRACT_CONFIG.CLOCK_ID),
          ],
        });

        const result = await signAndExecute({ transaction: tx });
        toast.success("Unstaked successfully with rewards! 🌿");
        
        await fetchBalance();
        return result;
      } catch (error: any) {
        toast.error(`Unstaking failed: ${error.message}`);
        return null;
      }
    },
    [address, signAndExecute, fetchBalance]
  );

  // Claim staking rewards
  const claimRewards = useCallback(
    async (stakePositionId: string) => {
      if (!address) {
        toast.error("Please connect your wallet");
        return null;
      }

      try {
        const tx = new Transaction();
        
        tx.moveCall({
          target: `${CONTRACT_CONFIG.PACKAGE_ID}::staking::claim_rewards`,
          arguments: [
            tx.object(CONTRACT_CONFIG.TREASURY_CAP_ID),
            tx.object(CONTRACT_CONFIG.MINTER_CAP_ID),
            tx.object(CONTRACT_CONFIG.TOKEN_INFO_ID),
            tx.object(CONTRACT_CONFIG.STAKING_POOL_ID),
            tx.object(stakePositionId),
            tx.object(CONTRACT_CONFIG.CLOCK_ID),
          ],
        });

        const result = await signAndExecute({ transaction: tx });
        toast.success("Rewards claimed! 🌱");
        
        await fetchBalance();
        return result;
      } catch (error: any) {
        toast.error(`Claim failed: ${error.message}`);
        return null;
      }
    },
    [address, signAndExecute, fetchBalance]
  );

  // Calculate expected ECO reward for a product
  const calculateReward = (priceInMist: bigint, ecoScore: number, co2Value: bigint): bigint => {
    if (ecoScore < 10) return 0n;
    
    const baseReward = (co2Value * BigInt(ecoScore)) / 100n;
    
    let multiplier = 100n;
    if (priceInMist > 1_000_000_000_000n) {
      multiplier = 150n;
    } else if (priceInMist > 100_000_000_000n) {
      multiplier = 125n;
    }
    
    return (baseReward * 1_000_000n * multiplier) / 100n;
  };

  // Format ECO amount for display
  const formatEco = (amount: bigint): string => {
    return (Number(amount) / 1e9).toFixed(2);
  };

  // Auto-refresh balance
  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [fetchBalance]);

  return {
    // State
    balance,
    products,
    stakes,
    isLoading: isPending,
    
    // Actions
    purchaseProduct,
    stakeTokens,
    unstakeTokens,
    claimRewards,
    fetchBalance,
    
    // Events
    subscribeToRewards,
    
    // Utilities
    calculateReward,
    formatEco,
    
    // Config
    config: CONTRACT_CONFIG,
  };
};
