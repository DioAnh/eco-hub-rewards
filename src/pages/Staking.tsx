import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Vault, TrendingUp, Clock, Coins, Lock, Unlock, Percent } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import {
  MatrixBackground,
  CyberHeader,
  CyberMenu,
  MarqueeTicker,
  CyberButton,
} from "@/components/cyberpunk";
import CyberFooter from "@/components/cyberpunk/CyberFooter";

const stakingPools = [
  { duration: 30, apy: 12, minStake: 100 },
  { duration: 90, apy: 18, minStake: 500 },
  { duration: 180, apy: 25, minStake: 1000 },
  { duration: 365, apy: 35, minStake: 5000 },
];

const Staking = () => {
  const currentAccount = useCurrentAccount();
  const [selectedPool, setSelectedPool] = useState(0);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);

  // Mock data
  const userBalance = 2500;
  const totalStaked = 1500;
  const pendingRewards = 45.5;
  const activeStakes = [
    { id: 1, amount: 1000, duration: 90, startDate: "2024-11-01", apy: 18, earned: 30.5 },
    { id: 2, amount: 500, duration: 30, startDate: "2024-12-15", apy: 12, earned: 15.0 },
  ];

  const handleStake = async () => {
    if (!currentAccount) {
      alert("Please connect your wallet");
      return;
    }
    if (!stakeAmount || Number(stakeAmount) < stakingPools[selectedPool].minStake) {
      alert(`Minimum stake is ${stakingPools[selectedPool].minStake} ECO`);
      return;
    }

    setIsStaking(true);
    setTimeout(() => {
      setIsStaking(false);
      setStakeAmount("");
    }, 2000);
  };

  const calculateReward = (amount: number, days: number, apy: number) => {
    return (amount * apy * days) / (365 * 100);
  };

  return (
    <>
      <Helmet>
        <title>Staking Vault - EcoShop | Earn Passive ECO Rewards</title>
        <meta name="description" content="Stake your ECO tokens and earn passive rewards. Multiple staking pools with APY up to 35% on Sui blockchain." />
      </Helmet>

      <div className="min-h-screen bg-black overflow-x-hidden scanlines">
        <MatrixBackground />
        <MarqueeTicker />
        <CyberHeader />
        <CyberMenu />

        <main className="pt-24 pb-16 min-h-screen">
          <div className="container mx-auto px-4">
            {/* Header */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div 
                className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 font-mono text-xs uppercase"
                style={{
                  background: 'hsl(0 0% 0% / 0.8)',
                  border: '1px solid hsl(180 100% 50% / 0.4)',
                }}
              >
                <Vault className="w-3 h-3 text-secondary" />
                <span className="text-secondary">STAKING_VAULT::ACTIVE</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-mono uppercase tracking-tight mb-3">
                <span className="text-foreground">Staking</span>{" "}
                <span className="text-secondary">Vault</span>
              </h1>
              <p className="text-muted-foreground font-mono text-sm max-w-2xl mx-auto">
                {">> "} Lock your ECO tokens and earn passive rewards. The longer you stake, the higher the APY.
              </p>
            </motion.div>

            {/* Stats overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Your Balance", value: `${userBalance} ECO`, icon: Coins, color: "hsl(120 100% 50%)" },
                { label: "Total Staked", value: `${totalStaked} ECO`, icon: Lock, color: "hsl(180 100% 50%)" },
                { label: "Pending Rewards", value: `${pendingRewards} ECO`, icon: TrendingUp, color: "hsl(45 100% 50%)" },
                { label: "Active Stakes", value: activeStakes.length.toString(), icon: Vault, color: "hsl(280 100% 60%)" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    background: 'linear-gradient(180deg, hsl(180 10% 5%) 0%, hsl(0 0% 0%) 100%)',
                    border: `1px solid ${stat.color}40`,
                  }}
                >
                  <stat.icon className="w-5 h-5 mb-2" style={{ color: stat.color }} />
                  <p className="font-mono text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="font-mono text-lg" style={{ color: stat.color }}>{stat.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Stake form */}
              <motion.div
                className="p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  background: 'linear-gradient(180deg, hsl(180 10% 5%) 0%, hsl(0 0% 0%) 100%)',
                  border: '1px solid hsl(180 100% 50% / 0.3)',
                }}
              >
                <h3 className="font-mono text-lg text-secondary uppercase mb-6">
                  {"<"} Stake ECO Tokens {"/>"}
                </h3>

                {/* Pool selection */}
                <div className="mb-6">
                  <label className="font-mono text-xs text-muted-foreground block mb-2">
                    Select Pool
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {stakingPools.map((pool, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedPool(index)}
                        className={`p-3 text-left transition-all ${selectedPool === index ? 'ring-1' : ''}`}
                        style={{
                          background: selectedPool === index ? 'hsl(180 100% 50% / 0.1)' : 'hsl(0 0% 0% / 0.5)',
                          border: `1px solid ${selectedPool === index ? 'hsl(180 100% 50% / 0.5)' : 'hsl(180 100% 50% / 0.2)'}`,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-3 h-3 text-secondary" />
                          <span className="font-mono text-xs text-secondary">{pool.duration} DAYS</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Percent className="w-3 h-3 text-primary" />
                          <span className="font-mono text-lg text-primary">{pool.apy}% APY</span>
                        </div>
                        <p className="font-mono text-[10px] text-muted-foreground mt-1">
                          Min: {pool.minStake} ECO
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount input */}
                <div className="mb-6">
                  <label className="font-mono text-xs text-muted-foreground block mb-2">
                    Amount to Stake
                  </label>
                  <div 
                    className="flex items-center gap-2 p-3"
                    style={{
                      background: 'hsl(0 0% 0% / 0.5)',
                      border: '1px solid hsl(120 100% 50% / 0.3)',
                    }}
                  >
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="Enter amount..."
                      className="flex-1 bg-transparent font-mono text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                    <button
                      onClick={() => setStakeAmount(userBalance.toString())}
                      className="font-mono text-xs text-primary hover:underline"
                    >
                      MAX
                    </button>
                    <span className="font-mono text-xs text-muted-foreground">ECO</span>
                  </div>
                </div>

                {/* Estimated rewards */}
                {stakeAmount && (
                  <div 
                    className="p-4 mb-6"
                    style={{
                      background: 'hsl(120 100% 50% / 0.05)',
                      border: '1px solid hsl(120 100% 50% / 0.2)',
                    }}
                  >
                    <p className="font-mono text-xs text-muted-foreground mb-2">Estimated Rewards</p>
                    <p className="font-mono text-xl text-primary">
                      +{calculateReward(Number(stakeAmount), stakingPools[selectedPool].duration, stakingPools[selectedPool].apy).toFixed(2)} ECO
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground mt-1">
                      After {stakingPools[selectedPool].duration} days at {stakingPools[selectedPool].apy}% APY
                    </p>
                  </div>
                )}

                <CyberButton
                  onClick={handleStake}
                  disabled={isStaking || !currentAccount || !stakeAmount}
                  className="w-full justify-center"
                  style={{
                    background: 'hsl(180 100% 50% / 0.1)',
                    borderColor: 'hsl(180 100% 50% / 0.5)',
                  }}
                >
                  {isStaking ? (
                    <span className="animate-pulse">STAKING...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      STAKE TOKENS
                    </>
                  )}
                </CyberButton>

                {!currentAccount && (
                  <p className="font-mono text-xs text-red-400 text-center mt-3">
                    {">> "} Connect wallet to stake
                  </p>
                )}
              </motion.div>

              {/* Active stakes */}
              <motion.div
                className="p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  background: 'linear-gradient(180deg, hsl(180 10% 5%) 0%, hsl(0 0% 0%) 100%)',
                  border: '1px solid hsl(120 100% 50% / 0.3)',
                }}
              >
                <h3 className="font-mono text-lg text-primary uppercase mb-6">
                  {"<"} Active Stakes {"/>"}
                </h3>

                {activeStakes.length > 0 ? (
                  <div className="space-y-4">
                    {activeStakes.map((stake) => (
                      <div
                        key={stake.id}
                        className="p-4"
                        style={{
                          background: 'hsl(0 0% 0% / 0.5)',
                          border: '1px solid hsl(120 100% 50% / 0.2)',
                        }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-mono text-lg text-primary">{stake.amount} ECO</p>
                            <p className="font-mono text-xs text-muted-foreground">
                              {stake.duration} days • {stake.apy}% APY
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-sm text-secondary">+{stake.earned} ECO</p>
                            <p className="font-mono text-[10px] text-muted-foreground">earned</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <CyberButton className="flex-1 justify-center text-xs py-1">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            CLAIM
                          </CyberButton>
                          <CyberButton 
                            className="flex-1 justify-center text-xs py-1"
                            style={{
                              background: 'hsl(0 100% 50% / 0.1)',
                              borderColor: 'hsl(0 100% 50% / 0.3)',
                            }}
                          >
                            <Unlock className="w-3 h-3 mr-1" />
                            UNSTAKE
                          </CyberButton>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Vault className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="font-mono text-sm text-muted-foreground">
                      {"// "} No active stakes yet. Start staking to earn rewards!
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </main>

        <CyberFooter />
      </div>
    </>
  );
};

export default Staking;