import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Leaf,
  Clock,
  Zap,
  Gift,
  Lock,
  Unlock,
} from "lucide-react";
import { MatrixBackground, CyberHeader, CyberButton } from "@/components/cyberpunk";
import { useWalletDemo } from "@/hooks/useWalletDemo";
import { toast } from "sonner";

const PortfolioPage = () => {
  const { 
    isConnected, 
    address, 
    investments, 
    totalInvested, 
    totalCO2Offset,
    claimAirdrop,
  } = useWalletDemo();
  
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Demo data for visualization when no real investments
  const demoInvestments = investments.length > 0 ? investments : [
    {
      id: "demo-1",
      projectId: 1,
      projectName: "GreenCafe Vietnam",
      amount: 25,
      investedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      status: "booming" as const,
      estimatedROI: 500,
      lockEndDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
      ecoScore: 95,
      co2Offset: 12.5,
    },
    {
      id: "demo-2",
      projectId: 2,
      projectName: "EcoBamboo Co.",
      amount: 15,
      investedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      status: "operational" as const,
      estimatedROI: 450,
      lockEndDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      ecoScore: 88,
      co2Offset: 7.5,
    },
    {
      id: "demo-3",
      projectId: 3,
      projectName: "SolarTech Startup",
      amount: 10,
      investedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      status: "critical" as const,
      estimatedROI: 300,
      lockEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      ecoScore: 72,
      co2Offset: 5,
    },
  ];

  const displayInvestments = investments.length > 0 ? investments : demoInvestments;

  const filteredInvestments = displayInvestments.filter(inv => {
    if (filter === "active") return ["operational", "booming", "critical"].includes(inv.status);
    if (filter === "completed") return ["success", "failed"].includes(inv.status);
    return true;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "operational":
        return {
          label: "OPERATIONAL",
          color: "text-primary",
          bgColor: "bg-primary/20",
          borderColor: "border-primary/50",
          icon: <Activity className="w-4 h-4" />,
          glow: "shadow-[0_0_20px_hsl(120_100%_50%_/_0.3)]",
        };
      case "booming":
        return {
          label: "BOOMING",
          color: "text-yellow-400",
          bgColor: "bg-yellow-400/20",
          borderColor: "border-yellow-400/50",
          icon: <TrendingUp className="w-4 h-4" />,
          glow: "shadow-[0_0_20px_hsl(45_100%_50%_/_0.3)]",
        };
      case "critical":
        return {
          label: "CRITICAL",
          color: "text-red-400",
          bgColor: "bg-red-400/20",
          borderColor: "border-red-400/50",
          icon: <AlertTriangle className="w-4 h-4" />,
          glow: "shadow-[0_0_20px_hsl(0_100%_50%_/_0.3)]",
        };
      case "success":
        return {
          label: "SUCCESS",
          color: "text-green-400",
          bgColor: "bg-green-400/20",
          borderColor: "border-green-400/50",
          icon: <CheckCircle className="w-4 h-4" />,
          glow: "shadow-[0_0_20px_hsl(120_100%_40%_/_0.3)]",
        };
      case "failed":
        return {
          label: "TERMINATED",
          color: "text-red-600",
          bgColor: "bg-red-600/20",
          borderColor: "border-red-600/50",
          icon: <XCircle className="w-4 h-4" />,
          glow: "",
        };
      default:
        return {
          label: "UNKNOWN",
          color: "text-muted-foreground",
          bgColor: "bg-muted/20",
          borderColor: "border-muted/50",
          icon: <Activity className="w-4 h-4" />,
          glow: "",
        };
    }
  };

  const handleClaimAirdrop = (investmentId: string, projectName: string) => {
    claimAirdrop(investmentId);
    toast.success(`Airdrop claimed from ${projectName}!`);
  };

  const calculateDaysRemaining = (lockEndDate: Date) => {
    const now = new Date();
    const diff = lockEndDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (!isConnected) {
    return (
      <>
        <Helmet>
          <title>Portfolio Monitor - EcoShop</title>
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
                <TrendingUp className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl font-bold font-mono text-primary mb-4">WALLET_NOT_CONNECTED</h2>
                <p className="text-muted-foreground font-mono mb-6">
                  {">> "} Connect your wallet to view your investment portfolio.
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
        <title>Portfolio Monitor - EcoShop</title>
        <meta name="description" content="Monitor your green investments and startup stakes" />
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

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold font-mono uppercase tracking-tight mb-2">
                <span className="text-primary neon-text">PORTFOLIO_MONITOR</span>
              </h1>
              <p className="text-muted-foreground font-mono text-sm">{address}</p>
            </motion.div>

            {/* Stats Overview */}
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
                <Zap className="w-6 h-6 text-primary mb-2" />
                <div className="text-2xl font-bold text-primary font-mono">{totalInvested || 50}</div>
                <div className="text-xs text-muted-foreground font-mono">TOTAL_INVESTED</div>
              </div>

              <div
                className="p-4 bg-black/80 border border-yellow-500/30"
                style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
              >
                <TrendingUp className="w-6 h-6 text-yellow-500 mb-2" />
                <div className="text-2xl font-bold text-yellow-500 font-mono">{displayInvestments.length}</div>
                <div className="text-xs text-muted-foreground font-mono">ACTIVE_STAKES</div>
              </div>

              <div
                className="p-4 bg-black/80 border border-secondary/30"
                style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
              >
                <Leaf className="w-6 h-6 text-secondary mb-2" />
                <div className="text-2xl font-bold text-secondary font-mono">{(totalCO2Offset || 25).toFixed(1)}kg</div>
                <div className="text-xs text-muted-foreground font-mono">CO2_OFFSET</div>
              </div>

              <div
                className="p-4 bg-black/80 border border-accent/30"
                style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
              >
                <Gift className="w-6 h-6 text-accent mb-2" />
                <div className="text-2xl font-bold text-accent font-mono">~{((totalInvested || 50) * 5).toFixed(0)}</div>
                <div className="text-xs text-muted-foreground font-mono">EST_AIRDROP</div>
              </div>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-3 mb-8"
            >
              {[
                { id: "all", label: "ALL_NODES" },
                { id: "active", label: "ACTIVE" },
                { id: "completed", label: "COMPLETED" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as typeof filter)}
                  className={`px-4 py-2 border font-mono text-xs uppercase tracking-wider transition-all ${
                    filter === tab.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-primary/30 text-muted-foreground hover:border-primary/60"
                  }`}
                  style={{
                    clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </motion.div>

            {/* Investment Nodes Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredInvestments.map((investment, index) => {
                const statusConfig = getStatusConfig(investment.status);
                const daysRemaining = calculateDaysRemaining(investment.lockEndDate);
                const isUnlocked = daysRemaining === 0;
                const canClaim = investment.status === "success" && isUnlocked;

                return (
                  <motion.div
                    key={investment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`relative group ${statusConfig.glow}`}
                  >
                    <div
                      className={`p-5 bg-black/80 border ${statusConfig.borderColor} transition-all hover:border-opacity-100`}
                      style={{
                        clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",
                      }}
                    >
                      {/* Status indicator - pulsing dot */}
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${statusConfig.bgColor} animate-pulse`} />
                        <span className={`font-mono text-xs ${statusConfig.color}`}>{statusConfig.label}</span>
                      </div>

                      {/* Project name */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className={`p-2 ${statusConfig.bgColor} border ${statusConfig.borderColor}`}>
                          {statusConfig.icon}
                        </div>
                        <div>
                          <h3 className="font-mono font-bold text-foreground">{investment.projectName}</h3>
                          <span className="text-xs text-muted-foreground font-mono">
                            ID: {investment.projectId}
                          </span>
                        </div>
                      </div>

                      {/* Stats grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-2 border border-primary/20 bg-black/50">
                          <div className="text-xs text-muted-foreground font-mono">STAKED</div>
                          <div className="font-mono font-bold text-primary">{investment.amount} ECO</div>
                        </div>
                        <div className="p-2 border border-yellow-500/20 bg-black/50">
                          <div className="text-xs text-muted-foreground font-mono">EST. ROI</div>
                          <div className="font-mono font-bold text-yellow-500">{investment.estimatedROI}%</div>
                        </div>
                        <div className="p-2 border border-secondary/20 bg-black/50">
                          <div className="text-xs text-muted-foreground font-mono">ECO_SCORE</div>
                          <div className="font-mono font-bold text-secondary">{investment.ecoScore}/100</div>
                        </div>
                        <div className="p-2 border border-accent/20 bg-black/50">
                          <div className="text-xs text-muted-foreground font-mono">CO2_SAVED</div>
                          <div className="font-mono font-bold text-accent">{investment.co2Offset}kg</div>
                        </div>
                      </div>

                      {/* Lock status */}
                      <div className="flex items-center justify-between p-2 border border-primary/20 bg-black/50 mb-4">
                        <div className="flex items-center gap-2">
                          {isUnlocked ? (
                            <Unlock className="w-4 h-4 text-primary" />
                          ) : (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="font-mono text-xs text-muted-foreground">
                            {isUnlocked ? "UNLOCKED" : `${daysRemaining} DAYS LEFT`}
                          </span>
                        </div>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </div>

                      {/* Action button */}
                      {canClaim ? (
                        <CyberButton
                          variant="primary"
                          className="w-full"
                          onClick={() => handleClaimAirdrop(investment.id, investment.projectName)}
                        >
                          <Gift className="w-4 h-4 mr-2" />
                          CLAIM_AIRDROP
                        </CyberButton>
                      ) : investment.status === "failed" ? (
                        <div className="text-center p-2 bg-red-500/10 border border-red-500/30">
                          <span className="font-mono text-xs text-red-400">INVESTMENT_TERMINATED</span>
                        </div>
                      ) : (
                        <div className="text-center p-2 bg-primary/5 border border-primary/20">
                          <span className="font-mono text-xs text-muted-foreground">MONITORING...</span>
                        </div>
                      )}

                      {/* Investment date */}
                      <div className="mt-3 text-center">
                        <span className="font-mono text-xs text-muted-foreground">
                          Invested: {investment.investedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Empty state */}
            {filteredInvestments.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="font-mono text-muted-foreground mb-4">No investments found</p>
                <Link to="/marketplace">
                  <CyberButton variant="secondary">START_INVESTING</CyberButton>
                </Link>
              </motion.div>
            )}

            {/* Risk Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 p-4 border border-yellow-500/30 bg-yellow-500/5"
              style={{
                clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
              }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-mono text-sm text-yellow-500 font-bold mb-1">RISK_DISCLOSURE</h4>
                  <p className="font-mono text-xs text-muted-foreground">
                    Reinvestment stakes are subject to project performance. Failed projects may result in total loss of staked ECO tokens. 
                    Success is determined by verified CO2 reduction reports and sales performance on EcoShop platform.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PortfolioPage;
