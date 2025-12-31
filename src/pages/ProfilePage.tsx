import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Leaf,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Trophy,
  Wallet,
  TreeDeciduous,
  Recycle,
  Zap,
  ChevronRight,
  Clock,
} from "lucide-react";
import { MatrixBackground, CyberHeader, CyberButton } from "@/components/cyberpunk";
import { useWalletDemo } from "@/hooks/useWalletDemo";

// Import product images for purchased items
import bambooBottle from "@/assets/products/bamboo-water-bottle.jpg";
import recycledBackpack from "@/assets/products/recycled-backpack.jpg";
import organicTee from "@/assets/products/organic-cotton-tee.jpg";

const ProfilePage = () => {
  const { isConnected, address, balance, transactions } = useWalletDemo();
  const [activeTab, setActiveTab] = useState<"overview" | "purchases" | "staking" | "events">("overview");

  // Calculate stats from transactions
  const purchaseTransactions = transactions.filter((t) => t.type === "purchase");
  const totalSpent = purchaseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalCO2Saved = purchaseTransactions.length * 2.5; // Simulated: 2.5kg CO2 per purchase

  // Demo upcoming events
  const upcomingEvents = [
    {
      id: 1,
      name: "EcoSummit 2025",
      date: "Jan 15, 2025",
      location: "Virtual",
      status: "registered",
    },
    {
      id: 2,
      name: "Zero Waste Workshop",
      date: "Jan 22, 2025",
      location: "Ho Chi Minh City",
      status: "upcoming",
    },
    {
      id: 3,
      name: "Sustainable Fashion Show",
      date: "Feb 5, 2025",
      location: "Hanoi",
      status: "upcoming",
    },
  ];

  // Demo staking portfolio
  const stakingData = {
    stakedAmount: 250,
    rewards: 12.5,
    apy: 15,
    lockPeriod: "30 days",
    unlockDate: "Jan 30, 2025",
  };

  // Demo achievements
  const achievements = [
    { id: 1, name: "First Purchase", icon: <ShoppingBag className="w-5 h-5" />, unlocked: purchaseTransactions.length > 0 },
    { id: 2, name: "Eco Warrior", icon: <Leaf className="w-5 h-5" />, unlocked: totalCO2Saved >= 5 },
    { id: 3, name: "Staking Pro", icon: <TrendingUp className="w-5 h-5" />, unlocked: false },
    { id: 4, name: "Event Enthusiast", icon: <Calendar className="w-5 h-5" />, unlocked: false },
  ];

  const tabs = [
    { id: "overview", label: "OVERVIEW", icon: <Wallet className="w-4 h-4" /> },
    { id: "purchases", label: "PURCHASES", icon: <ShoppingBag className="w-4 h-4" /> },
    { id: "staking", label: "STAKING", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "events", label: "EVENTS", icon: <Calendar className="w-4 h-4" /> },
  ];

  if (!isConnected) {
    return (
      <>
        <Helmet>
          <title>Profile - EcoShop</title>
        </Helmet>
        <div className="min-h-screen bg-black scanlines">
          <MatrixBackground />
          <CyberHeader />
          <main className="relative z-10 pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-12 border border-primary/30 bg-black/80"
                style={{
                  clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
                }}
              >
                <Wallet className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl font-bold font-mono text-primary mb-4">WALLET_NOT_CONNECTED</h2>
                <p className="text-muted-foreground font-mono mb-6">
                  {">> "} Connect your wallet to view your profile and transaction history.
                </p>
                <Link to="/">
                  <CyberButton variant="primary">CONNECT_WALLET</CyberButton>
                </Link>
              </motion.div>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile - EcoShop</title>
        <meta name="description" content="View your EcoShop profile, purchases, and eco-impact" />
      </Helmet>

      <div className="min-h-screen bg-black overflow-x-hidden scanlines">
        <MatrixBackground />
        <CyberHeader />

        <main className="relative z-10 pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Back button */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-mono text-sm mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                BACK_TO_MARKETPLACE
              </Link>
            </motion.div>

            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold font-mono uppercase tracking-tight mb-2">
                    <span className="text-primary neon-text">MY_PROFILE</span>
                  </h1>
                  <p className="text-muted-foreground font-mono text-sm">{address}</p>
                </div>

                {/* Balance Card */}
                <div
                  className="p-4 min-w-[200px]"
                  style={{
                    background: "linear-gradient(180deg, hsl(120 20% 8%) 0%, hsl(0 0% 4%) 100%)",
                    border: "1px solid hsl(120 100% 50% / 0.4)",
                    clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                  }}
                >
                  <div className="text-xs font-mono text-primary mb-1">ECO_BALANCE</div>
                  <div className="text-3xl font-bold text-primary font-mono neon-text">{balance} ECO</div>
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <div
                className="p-4 bg-black/80 border border-primary/30"
                style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
              >
                <TreeDeciduous className="w-6 h-6 text-primary mb-2" />
                <div className="text-2xl font-bold text-primary font-mono">{totalCO2Saved.toFixed(1)}kg</div>
                <div className="text-xs text-muted-foreground font-mono">CO2_SAVED</div>
              </div>

              <div
                className="p-4 bg-black/80 border border-primary/30"
                style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
              >
                <ShoppingBag className="w-6 h-6 text-secondary mb-2" />
                <div className="text-2xl font-bold text-secondary font-mono">{purchaseTransactions.length}</div>
                <div className="text-xs text-muted-foreground font-mono">ITEMS_BOUGHT</div>
              </div>

              <div
                className="p-4 bg-black/80 border border-primary/30"
                style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
              >
                <Zap className="w-6 h-6 text-accent mb-2" />
                <div className="text-2xl font-bold text-accent font-mono">{totalSpent}</div>
                <div className="text-xs text-muted-foreground font-mono">ECO_SPENT</div>
              </div>

              <div
                className="p-4 bg-black/80 border border-primary/30"
                style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
              >
                <Trophy className="w-6 h-6 text-yellow-400 mb-2" />
                <div className="text-2xl font-bold text-yellow-400 font-mono">
                  {achievements.filter((a) => a.unlocked).length}/{achievements.length}
                </div>
                <div className="text-xs text-muted-foreground font-mono">ACHIEVEMENTS</div>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-2 border font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-primary/30 text-muted-foreground hover:border-primary/60"
                  }`}
                  style={{
                    clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recent Transactions */}
                  <div
                    className="p-6 bg-black/80 border border-primary/30"
                    style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}
                  >
                    <h3 className="text-lg font-bold font-mono text-primary mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      RECENT_TRANSACTIONS
                    </h3>
                    <div className="space-y-3">
                      {transactions.slice(0, 5).map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between py-2 border-b border-primary/10">
                          <div>
                            <div className="text-sm font-mono text-foreground">{tx.description}</div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {tx.timestamp.toLocaleString()}
                            </div>
                          </div>
                          <div
                            className={`font-mono font-bold ${tx.amount > 0 ? "text-primary" : "text-red-400"}`}
                          >
                            {tx.amount > 0 ? "+" : ""}
                            {tx.amount} ECO
                          </div>
                        </div>
                      ))}
                      {transactions.length === 0 && (
                        <div className="text-muted-foreground font-mono text-sm text-center py-4">
                          No transactions yet
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div
                    className="p-6 bg-black/80 border border-primary/30"
                    style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}
                  >
                    <h3 className="text-lg font-bold font-mono text-primary mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      ACHIEVEMENTS
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`p-3 border ${
                            achievement.unlocked ? "border-primary bg-primary/10" : "border-primary/20 opacity-50"
                          } text-center`}
                        >
                          <div
                            className={`mx-auto mb-2 ${achievement.unlocked ? "text-primary" : "text-muted-foreground"}`}
                          >
                            {achievement.icon}
                          </div>
                          <div className="text-xs font-mono text-foreground">{achievement.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Purchases Tab */}
              {activeTab === "purchases" && (
                <div
                  className="p-6 bg-black/80 border border-primary/30"
                  style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}
                >
                  <h3 className="text-lg font-bold font-mono text-primary mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    PURCHASE_HISTORY
                  </h3>
                  {purchaseTransactions.length > 0 ? (
                    <div className="space-y-4">
                      {purchaseTransactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center gap-4 p-4 border border-primary/20 hover:border-primary/40 transition-colors"
                        >
                          <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center">
                            <Recycle className="w-8 h-8 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-mono text-foreground">{tx.description}</div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {tx.timestamp.toLocaleString()}
                            </div>
                          </div>
                          <div className="font-mono font-bold text-red-400">{tx.amount} ECO</div>
                          <div className="text-xs text-primary font-mono">+2.5kg CO2</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground font-mono">No purchases yet</p>
                      <Link to="/marketplace">
                        <CyberButton variant="primary" className="mt-4">
                          BROWSE_MARKETPLACE
                        </CyberButton>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Staking Tab */}
              {activeTab === "staking" && (
                <div
                  className="p-6 bg-black/80 border border-primary/30"
                  style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}
                >
                  <h3 className="text-lg font-bold font-mono text-primary mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    STAKING_PORTFOLIO
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 border border-primary/20">
                      <div className="text-xs text-muted-foreground font-mono mb-1">STAKED_AMOUNT</div>
                      <div className="text-3xl font-bold text-primary font-mono">{stakingData.stakedAmount} ECO</div>
                    </div>
                    <div className="p-4 border border-secondary/20">
                      <div className="text-xs text-muted-foreground font-mono mb-1">REWARDS_EARNED</div>
                      <div className="text-3xl font-bold text-secondary font-mono">+{stakingData.rewards} ECO</div>
                    </div>
                    <div className="p-4 border border-accent/20">
                      <div className="text-xs text-muted-foreground font-mono mb-1">APY</div>
                      <div className="text-3xl font-bold text-accent font-mono">{stakingData.apy}%</div>
                    </div>
                    <div className="p-4 border border-primary/20">
                      <div className="text-xs text-muted-foreground font-mono mb-1">UNLOCK_DATE</div>
                      <div className="text-lg font-bold text-foreground font-mono">{stakingData.unlockDate}</div>
                    </div>
                  </div>
                  <Link to="/staking" className="block mt-6">
                    <CyberButton variant="secondary" className="w-full">
                      MANAGE_STAKING
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </CyberButton>
                  </Link>
                </div>
              )}

              {/* Events Tab */}
              {activeTab === "events" && (
                <div
                  className="p-6 bg-black/80 border border-primary/30"
                  style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}
                >
                  <h3 className="text-lg font-bold font-mono text-primary mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    UPCOMING_EVENTS
                  </h3>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-4 p-4 border border-primary/20 hover:border-primary/40 transition-colors"
                      >
                        <div className="w-14 h-14 bg-primary/10 border border-primary/30 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-mono text-foreground font-bold">{event.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {event.date} • {event.location}
                          </div>
                        </div>
                        <div
                          className={`px-2 py-1 text-xs font-mono ${
                            event.status === "registered"
                              ? "bg-primary/20 text-primary border border-primary/40"
                              : "bg-secondary/20 text-secondary border border-secondary/40"
                          }`}
                        >
                          {event.status.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link to="/marketplace?filter=event" className="block mt-6">
                    <CyberButton variant="secondary" className="w-full">
                      BROWSE_MORE_EVENTS
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </CyberButton>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProfilePage;
