import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock, Unlock, TrendingUp, Clock, Zap, Shield, Coins, Activity, AlertTriangle, CheckCircle, X, Plus, Minus } from "lucide-react";
import { MatrixBackground, CyberHeader, CyberButton } from "@/components/cyberpunk";
import { useWalletDemo } from "@/hooks/useWalletDemo";
import { toast } from "sonner";

interface UserStake {
  poolIndex: number;
  amount: number;
  stakedAt: Date;
  earnedRewards: number;
}

const StakingPage = () => {
  const [selectedPool, setSelectedPool] = useState<number | null>(null);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [userStakes, setUserStakes] = useState<UserStake[]>([
    { poolIndex: 0, amount: 500, stakedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), earnedRewards: 0.77 },
    { poolIndex: 2, amount: 2500, stakedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), earnedRewards: 51.37 },
  ]);
  const [realTimeAPR, setRealTimeAPR] = useState<number[]>([8, 15, 25, 40]);
  
  const { balance, isConnected } = useWalletDemo();

  // Simulate real-time APR fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeAPR(prev => prev.map((apr, i) => {
        const fluctuation = (Math.random() - 0.5) * 0.5;
        const baseAPR = [8, 15, 25, 40][i];
        return Math.max(baseAPR * 0.9, Math.min(baseAPR * 1.1, apr + fluctuation));
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulate reward accrual
  useEffect(() => {
    const interval = setInterval(() => {
      setUserStakes(prev => prev.map(stake => {
        const apr = realTimeAPR[stake.poolIndex];
        const dailyRate = apr / 365 / 100;
        const increment = stake.amount * dailyRate / 8640; // Per 10 seconds
        return { ...stake, earnedRewards: stake.earnedRewards + increment };
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, [realTimeAPR]);

  const stakingPools = [
    { 
      name: "FLEX_POOL", 
      baseAPY: 8,
      lockPeriod: "No lock", 
      minStake: 100,
      totalStaked: 2500000,
      health: "excellent" as const,
      utilization: 65,
      icon: <Unlock className="w-6 h-6" />
    },
    { 
      name: "STANDARD_VAULT", 
      baseAPY: 15,
      lockPeriod: "30 days", 
      minStake: 500,
      totalStaked: 8200000,
      health: "good" as const,
      utilization: 78,
      icon: <Lock className="w-6 h-6" />
    },
    { 
      name: "PREMIUM_VAULT", 
      baseAPY: 25,
      lockPeriod: "90 days", 
      minStake: 1000,
      totalStaked: 15800000,
      health: "moderate" as const,
      utilization: 85,
      icon: <Shield className="w-6 h-6" />
    },
    { 
      name: "DIAMOND_VAULT", 
      baseAPY: 40,
      lockPeriod: "365 days", 
      minStake: 5000,
      totalStaked: 42100000,
      health: "excellent" as const,
      utilization: 92,
      icon: <Zap className="w-6 h-6" />
    },
  ];

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent": return "text-green-400";
      case "good": return "text-primary";
      case "moderate": return "text-yellow-400";
      case "critical": return "text-red-400";
      default: return "text-primary";
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case "excellent": return <CheckCircle className="w-4 h-4" />;
      case "good": return <Activity className="w-4 h-4" />;
      case "moderate": return <AlertTriangle className="w-4 h-4" />;
      case "critical": return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toFixed(2);
  };

  const getUserStakeForPool = (poolIndex: number) => {
    return userStakes.find(s => s.poolIndex === poolIndex);
  };

  const getTotalUserStaked = () => {
    return userStakes.reduce((sum, s) => sum + s.amount, 0);
  };

  const getTotalRewards = () => {
    return userStakes.reduce((sum, s) => sum + s.earnedRewards, 0);
  };

  const handleStake = () => {
    if (!isConnected) {
      toast.error("Please connect wallet first");
      return;
    }
    
    const amount = parseFloat(stakeAmount);
    if (selectedPool === null || isNaN(amount) || amount <= 0) {
      toast.error("Invalid stake amount");
      return;
    }

    const pool = stakingPools[selectedPool];
    if (amount < pool.minStake) {
      toast.error(`Minimum stake is ${pool.minStake} ECO`);
      return;
    }

    if (amount > balance) {
      toast.error("Insufficient ECO balance");
      return;
    }

    const existingStake = getUserStakeForPool(selectedPool);
    if (existingStake) {
      setUserStakes(prev => prev.map(s => 
        s.poolIndex === selectedPool 
          ? { ...s, amount: s.amount + amount }
          : s
      ));
    } else {
      setUserStakes(prev => [...prev, {
        poolIndex: selectedPool,
        amount,
        stakedAt: new Date(),
        earnedRewards: 0
      }]);
    }

    toast.success(`Successfully staked ${amount} ECO in ${pool.name}`);
    setShowStakeModal(false);
    setStakeAmount("");
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (selectedPool === null || isNaN(amount) || amount <= 0) {
      toast.error("Invalid withdraw amount");
      return;
    }

    const existingStake = getUserStakeForPool(selectedPool);
    if (!existingStake || amount > existingStake.amount) {
      toast.error("Insufficient staked amount");
      return;
    }

    const pool = stakingPools[selectedPool];
    
    // Check lock period (demo: FLEX_POOL has no lock)
    if (pool.lockPeriod !== "No lock") {
      const lockDays = parseInt(pool.lockPeriod);
      const daysSinceStake = (Date.now() - existingStake.stakedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceStake < lockDays) {
        toast.error(`Tokens locked for ${Math.ceil(lockDays - daysSinceStake)} more days`);
        return;
      }
    }

    if (amount === existingStake.amount) {
      setUserStakes(prev => prev.filter(s => s.poolIndex !== selectedPool));
    } else {
      setUserStakes(prev => prev.map(s => 
        s.poolIndex === selectedPool 
          ? { ...s, amount: s.amount - amount }
          : s
      ));
    }

    toast.success(`Withdrew ${amount} ECO + ${existingStake.earnedRewards.toFixed(2)} ECO rewards`);
    setShowWithdrawModal(false);
    setWithdrawAmount("");
  };

  const stats = [
    { label: "YOUR_STAKED", value: `${formatNumber(getTotalUserStaked())} ECO` },
    { label: "PENDING_REWARDS", value: `${getTotalRewards().toFixed(4)} ECO` },
    { label: "ACTIVE_POSITIONS", value: userStakes.length.toString() },
    { label: "AVG_APY", value: `${(realTimeAPR.reduce((a, b) => a + b, 0) / 4).toFixed(1)}%` },
  ];

  return (
    <>
      <Helmet>
        <title>Staking Vault - EcoShop</title>
        <meta name="description" content="Stake your ECO tokens and earn rewards on EcoShop" />
      </Helmet>

      <div className="min-h-screen bg-black overflow-x-hidden scanlines">
        <MatrixBackground />
        <CyberHeader />

        <main className="relative z-10 pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-mono text-sm mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                BACK_TO_MAIN
              </Link>
            </motion.div>

            {/* Page title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold font-mono uppercase tracking-tight mb-4">
                <span className="text-primary neon-text">STAKING_VAULT</span>
              </h1>
              <p className="text-muted-foreground font-mono max-w-2xl">
                {">> "}Lock your ECO tokens to earn passive rewards. Real-time APR • Vault Health Monitoring • Flexible Withdrawals
              </p>
            </motion.div>

            {/* User Stats grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 bg-black/80 border border-primary/30"
                  style={{
                    clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                  }}
                >
                  <div className="text-2xl font-bold text-primary font-mono neon-text">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-mono">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Staking pools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-primary font-mono mb-6 flex items-center gap-2">
                <Coins className="w-5 h-5" />
                SELECT_VAULT
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {stakingPools.map((pool, index) => {
                  const userStake = getUserStakeForPool(index);
                  return (
                    <motion.div
                      key={pool.name}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      onClick={() => setSelectedPool(index)}
                      className={`relative p-6 bg-black/80 border cursor-pointer transition-all ${
                        selectedPool === index 
                          ? "border-primary shadow-[0_0_30px_hsl(var(--primary)/0.3)]" 
                          : "border-primary/30 hover:border-primary/60"
                      }`}
                      style={{
                        clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",
                      }}
                    >
                      {/* Corner decorations */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/50" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/50" />

                      {/* User stake indicator */}
                      {userStake && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-primary/20 border border-primary/40 rounded text-xs font-mono text-primary">
                          STAKED: {formatNumber(userStake.amount)}
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-primary">{pool.icon}</div>
                          <div>
                            <div className="text-lg font-bold text-foreground font-mono">{pool.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">Min: {pool.minStake} ECO</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <motion.div 
                            key={realTimeAPR[index]}
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            className="text-3xl font-bold text-primary font-mono neon-text"
                          >
                            {realTimeAPR[index].toFixed(1)}%
                          </motion.div>
                          <div className="text-xs text-muted-foreground font-mono flex items-center gap-1 justify-end">
                            <Activity className="w-3 h-3 animate-pulse" />
                            LIVE APR
                          </div>
                        </div>
                      </div>

                      {/* Health & Utilization */}
                      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <div className="text-muted-foreground font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            LOCK
                          </div>
                          <div className="text-foreground font-mono">{pool.lockPeriod}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground font-mono flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            TVL
                          </div>
                          <div className="text-foreground font-mono">{formatNumber(pool.totalStaked)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground font-mono flex items-center gap-1">
                            {getHealthIcon(pool.health)}
                            HEALTH
                          </div>
                          <div className={`font-mono uppercase ${getHealthColor(pool.health)}`}>
                            {pool.health}
                          </div>
                        </div>
                      </div>

                      {/* Utilization bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span className="text-muted-foreground">UTILIZATION</span>
                          <span className="text-primary">{pool.utilization}%</span>
                        </div>
                        <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${pool.utilization}%` }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                          />
                        </div>
                      </div>

                      {/* User rewards if staked */}
                      {userStake && (
                        <div className="p-3 bg-primary/10 border border-primary/30 rounded mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-mono text-muted-foreground">EARNED_REWARDS</span>
                            <motion.span 
                              key={userStake.earnedRewards.toFixed(4)}
                              initial={{ color: "hsl(var(--primary))" }}
                              animate={{ color: "hsl(var(--foreground))" }}
                              className="font-mono font-bold text-primary"
                            >
                              +{userStake.earnedRewards.toFixed(4)} ECO
                            </motion.span>
                          </div>
                        </div>
                      )}

                      {selectedPool === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 pt-4 border-t border-primary/30"
                        >
                          <div className="flex gap-4">
                            <CyberButton 
                              variant="primary" 
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowStakeModal(true);
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              STAKE
                            </CyberButton>
                            {userStake && (
                              <CyberButton 
                                variant="secondary" 
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowWithdrawModal(true);
                                }}
                              >
                                <Minus className="w-4 h-4 mr-2" />
                                WITHDRAW
                              </CyberButton>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </main>

        {/* Stake Modal */}
        <AnimatePresence>
          {showStakeModal && selectedPool !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowStakeModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md p-6 bg-black border border-primary"
                style={{
                  clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
                }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-primary font-mono">STAKE_ECO</h3>
                  <button onClick={() => setShowStakeModal(false)} className="text-muted-foreground hover:text-primary">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-primary/10 border border-primary/30">
                    <div className="text-xs text-muted-foreground font-mono mb-1">SELECTED_VAULT</div>
                    <div className="text-lg font-bold text-primary font-mono">{stakingPools[selectedPool].name}</div>
                    <div className="text-sm text-muted-foreground font-mono">
                      APR: {realTimeAPR[selectedPool].toFixed(1)}% • Lock: {stakingPools[selectedPool].lockPeriod}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground font-mono mb-2 block">AMOUNT (ECO)</label>
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder={`Min: ${stakingPools[selectedPool].minStake}`}
                      className="w-full p-3 bg-black border border-primary/50 text-foreground font-mono focus:border-primary focus:outline-none"
                    />
                    <div className="text-xs text-muted-foreground font-mono mt-1">
                      Balance: {balance.toFixed(2)} ECO
                    </div>
                  </div>

                  {stakeAmount && parseFloat(stakeAmount) > 0 && (
                    <div className="p-3 bg-primary/5 border border-primary/20">
                      <div className="text-xs text-muted-foreground font-mono mb-1">ESTIMATED_YEARLY_REWARD</div>
                      <div className="text-lg font-bold text-primary font-mono">
                        +{(parseFloat(stakeAmount) * realTimeAPR[selectedPool] / 100).toFixed(2)} ECO
                      </div>
                    </div>
                  )}

                  <CyberButton variant="primary" className="w-full" onClick={handleStake}>
                    CONFIRM_STAKE
                  </CyberButton>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Withdraw Modal */}
        <AnimatePresence>
          {showWithdrawModal && selectedPool !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowWithdrawModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md p-6 bg-black border border-primary"
                style={{
                  clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
                }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-primary font-mono">WITHDRAW_ECO</h3>
                  <button onClick={() => setShowWithdrawModal(false)} className="text-muted-foreground hover:text-primary">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {(() => {
                    const userStake = getUserStakeForPool(selectedPool);
                    return (
                      <>
                        <div className="p-3 bg-primary/10 border border-primary/30">
                          <div className="text-xs text-muted-foreground font-mono mb-1">YOUR_POSITION</div>
                          <div className="text-lg font-bold text-foreground font-mono">{userStake?.amount.toFixed(2)} ECO</div>
                          <div className="text-sm text-primary font-mono">
                            +{userStake?.earnedRewards.toFixed(4)} ECO rewards
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-muted-foreground font-mono mb-2 block">WITHDRAW_AMOUNT</label>
                          <input
                            type="number"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder={`Max: ${userStake?.amount.toFixed(2)}`}
                            className="w-full p-3 bg-black border border-primary/50 text-foreground font-mono focus:border-primary focus:outline-none"
                          />
                          <button
                            onClick={() => setWithdrawAmount(userStake?.amount.toString() || "")}
                            className="text-xs text-primary font-mono mt-1 hover:underline"
                          >
                            MAX
                          </button>
                        </div>

                        {stakingPools[selectedPool].lockPeriod !== "No lock" && (
                          <div className="p-3 bg-yellow-400/10 border border-yellow-400/30">
                            <div className="flex items-center gap-2 text-yellow-400 text-sm font-mono">
                              <AlertTriangle className="w-4 h-4" />
                              LOCK_PERIOD: {stakingPools[selectedPool].lockPeriod}
                            </div>
                          </div>
                        )}

                        <CyberButton variant="secondary" className="w-full" onClick={handleWithdraw}>
                          CONFIRM_WITHDRAW
                        </CyberButton>
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default StakingPage;
