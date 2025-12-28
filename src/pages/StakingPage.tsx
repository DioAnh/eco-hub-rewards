import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock, Unlock, TrendingUp, Clock, Zap, Shield, Coins } from "lucide-react";
import { MatrixBackground, CyberHeader, CyberButton } from "@/components/cyberpunk";

const StakingPage = () => {
  const [selectedPool, setSelectedPool] = useState<number | null>(null);

  const stakingPools = [
    { 
      name: "FLEX_POOL", 
      apy: "8%", 
      lockPeriod: "No lock", 
      minStake: "100 ECO",
      totalStaked: "2.5M ECO",
      icon: <Unlock className="w-6 h-6" />
    },
    { 
      name: "STANDARD_VAULT", 
      apy: "15%", 
      lockPeriod: "30 days", 
      minStake: "500 ECO",
      totalStaked: "8.2M ECO",
      icon: <Lock className="w-6 h-6" />
    },
    { 
      name: "PREMIUM_VAULT", 
      apy: "25%", 
      lockPeriod: "90 days", 
      minStake: "1000 ECO",
      totalStaked: "15.8M ECO",
      icon: <Shield className="w-6 h-6" />
    },
    { 
      name: "DIAMOND_VAULT", 
      apy: "40%", 
      lockPeriod: "365 days", 
      minStake: "5000 ECO",
      totalStaked: "42.1M ECO",
      icon: <Zap className="w-6 h-6" />
    },
  ];

  const stats = [
    { label: "TOTAL_VALUE_LOCKED", value: "$68.6M" },
    { label: "AVG_APY", value: "22%" },
    { label: "ACTIVE_STAKERS", value: "12,847" },
    { label: "REWARDS_DISTRIBUTED", value: "4.2M ECO" },
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
                {">> "}Lock your ECO tokens to earn passive rewards. Higher lock periods yield higher APY.
              </p>
            </motion.div>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            >
              {stats.map((stat, index) => (
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
                {stakingPools.map((pool, index) => (
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

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-primary">{pool.icon}</div>
                        <div>
                          <div className="text-lg font-bold text-foreground font-mono">{pool.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">Min: {pool.minStake}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary font-mono neon-text">{pool.apy}</div>
                        <div className="text-xs text-muted-foreground font-mono">APY</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          LOCK_PERIOD
                        </div>
                        <div className="text-foreground font-mono">{pool.lockPeriod}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground font-mono flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          TOTAL_STAKED
                        </div>
                        <div className="text-foreground font-mono">{pool.totalStaked}</div>
                      </div>
                    </div>

                    {selectedPool === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-6 pt-6 border-t border-primary/30"
                      >
                        <div className="flex gap-4">
                          <CyberButton variant="primary" className="flex-1">
                            STAKE_NOW
                          </CyberButton>
                          <CyberButton variant="secondary" className="flex-1">
                            LEARN_MORE
                          </CyberButton>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default StakingPage;
