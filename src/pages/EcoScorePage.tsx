import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Leaf, TrendingUp, Award, Target, Zap, Shield } from "lucide-react";
import { MatrixBackground, CyberHeader } from "@/components/cyberpunk";

const EcoScorePage = () => {
  const scoreFactors = [
    { name: "Carbon Footprint", value: 85, icon: <Leaf className="w-5 h-5" /> },
    { name: "Sustainable Purchases", value: 92, icon: <TrendingUp className="w-5 h-5" /> },
    { name: "Recycling Rate", value: 78, icon: <Award className="w-5 h-5" /> },
    { name: "Green Energy Usage", value: 95, icon: <Zap className="w-5 h-5" /> },
  ];

  const rewards = [
    { tier: "BRONZE", min: 0, max: 299, bonus: "5%" },
    { tier: "SILVER", min: 300, max: 599, bonus: "10%" },
    { tier: "GOLD", min: 600, max: 899, bonus: "15%" },
    { tier: "PLATINUM", min: 900, max: 1000, bonus: "25%" },
  ];

  return (
    <>
      <Helmet>
        <title>Eco Score - EcoShop</title>
        <meta name="description" content="Track your environmental impact with Eco Score on EcoShop" />
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
                <span className="text-primary neon-text">ECO_SCORE</span>
              </h1>
              <p className="text-muted-foreground font-mono max-w-2xl">
                {">> "}Your environmental impact rating. Higher scores unlock better rewards and exclusive eco-benefits.
              </p>
            </motion.div>

            {/* Main score display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 gap-8 mb-12"
            >
              {/* Score circle */}
              <div
                className="relative p-8 bg-black/80 border border-primary/30"
                style={{
                  clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-48 mb-6">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        stroke="hsl(var(--primary) / 0.2)"
                        strokeWidth="8"
                      />
                      <motion.circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={553}
                        initial={{ strokeDashoffset: 553 }}
                        animate={{ strokeDashoffset: 553 * (1 - 0.87) }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold text-primary font-mono neon-text">870</span>
                      <span className="text-xs text-muted-foreground font-mono">/ 1000</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary font-mono mb-2">GOLD TIER</div>
                    <div className="text-sm text-muted-foreground font-mono">+15% ECO Token Bonus</div>
                  </div>
                </div>
              </div>

              {/* Score factors */}
              <div
                className="p-8 bg-black/80 border border-primary/30"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                }}
              >
                <h3 className="text-lg font-bold text-primary font-mono mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  SCORE_FACTORS
                </h3>
                <div className="space-y-4">
                  {scoreFactors.map((factor, index) => (
                    <motion.div
                      key={factor.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-mono text-foreground flex items-center gap-2">
                          {factor.icon}
                          {factor.name}
                        </span>
                        <span className="text-sm font-mono text-primary">{factor.value}%</span>
                      </div>
                      <div className="h-2 bg-primary/20 overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${factor.value}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Reward tiers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-lg font-bold text-primary font-mono mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                REWARD_TIERS
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {rewards.map((reward, index) => (
                  <motion.div
                    key={reward.tier}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className={`p-6 bg-black/80 border ${
                      reward.tier === "GOLD" ? "border-primary" : "border-primary/30"
                    }`}
                    style={{
                      clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                    }}
                  >
                    <div className="text-lg font-bold text-primary font-mono mb-2">{reward.tier}</div>
                    <div className="text-xs text-muted-foreground font-mono mb-3">
                      {reward.min} - {reward.max} pts
                    </div>
                    <div className="text-2xl font-bold text-foreground font-mono">{reward.bonus}</div>
                    <div className="text-xs text-muted-foreground font-mono">bonus</div>
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

export default EcoScorePage;
