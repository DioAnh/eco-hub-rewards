import { useEffect, useCallback } from "react";
import { useEcoContract, RewardDistributedEvent } from "@/hooks/useEcoContract";
import { useBloomAnimation } from "@/components/bio-dynamic/BloomAnimation";
import { toast } from "sonner";

interface UseRewardListenerProps {
  onReward?: (event: RewardDistributedEvent) => void;
}

/**
 * Hook to listen for RewardDistributed events and trigger bloom animation
 */
export const useRewardListener = ({ onReward }: UseRewardListenerProps = {}) => {
  const { subscribeToRewards, formatEco } = useEcoContract();
  const { triggerBloom, isAnimating, BloomComponent } = useBloomAnimation();

  const handleReward = useCallback(
    (event: RewardDistributedEvent) => {
      // Trigger bloom animation at center of screen
      triggerBloom(window.innerWidth / 2, window.innerHeight / 2);
      
      // Show toast with reward info
      toast.success(
        `🌱 Earned ${formatEco(event.ecoReward)} ECO tokens! CO₂ offset: ${Number(event.co2Offset)}g`,
        {
          duration: 5000,
          description: event.productName,
        }
      );
      
      // Call custom callback if provided
      onReward?.(event);
    },
    [triggerBloom, formatEco, onReward]
  );

  useEffect(() => {
    const unsubscribe = subscribeToRewards(handleReward);
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [subscribeToRewards, handleReward]);

  return {
    isAnimating,
    BloomComponent,
  };
};
