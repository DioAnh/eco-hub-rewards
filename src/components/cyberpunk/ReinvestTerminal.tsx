import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Shield, Zap, AlertTriangle, Wallet, TrendingUp, 
  ArrowRight, Sparkles, Lock, Clock
} from "lucide-react";
import { CyberButton } from "./CyberButton";

interface ReinvestTerminalProps {
  isVisible: boolean;
  rewardAmount: number;
  productName: string;
  merchantName: string;
  estimatedROI: number;
  ecoScore: number;
  onCollect: () => void;
  onReinvest: () => void;
}

const ReinvestTerminal = ({
  isVisible,
  rewardAmount,
  productName,
  merchantName,
  estimatedROI,
  ecoScore,
  onCollect,
  onReinvest,
}: ReinvestTerminalProps) => {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<"safe" | "risk" | null>(null);
  const [riskWarningFlash, setRiskWarningFlash] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setTerminalLines([]);
      setShowOptions(false);

      const lines = [
        "> TRANSACTION_COMPLETE",
        "> SCANNING REWARD_POOL...",
        `> ECO_REWARD_DETECTED: ${rewardAmount}.0 ECO`,
        `> SOURCE: ${merchantName.toUpperCase()}`,
        `> PROJECT_SCORE: ${ecoScore}/100`,
        "> AWAITING USER_INPUT...",
      ];

      lines.forEach((line, index) => {
        setTimeout(() => {
          setTerminalLines((prev) => [...prev, line]);
        }, index * 400);
      });

      setTimeout(() => setShowOptions(true), lines.length * 400 + 500);
    }
  }, [isVisible, rewardAmount, merchantName, ecoScore]);

  useEffect(() => {
    if (hoveredOption === "risk") {
      const interval = setInterval(() => {
        setRiskWarningFlash((prev) => !prev);
      }, 300);
      return () => clearInterval(interval);
    } else {
      setRiskWarningFlash(false);
    }
  }, [hoveredOption]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.95)" }}
        >
          {/* Matrix rain background */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-primary font-mono text-xs"
                style={{ left: `${i * 7}%` }}
                initial={{ y: -100 }}
                animate={{ y: "100vh" }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "linear",
                }}
              >
                {Array.from({ length: 30 }).map((_, j) => (
                  <div key={j} className="mb-1 opacity-50">
                    {Math.random() > 0.5 ? "1" : "0"}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>

          {/* Scan lines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)",
            }}
          />

          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative z-10 w-full max-w-4xl"
          >
            {/* Terminal Window */}
            <div
              className="border border-primary/50 bg-black/95 overflow-hidden mb-8"
              style={{
                clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",
              }}
            >
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-primary/30 bg-primary/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="font-mono text-sm text-primary/80 ml-2">
                  RISK_TERMINAL :: {merchantName.toLowerCase()}@ecoshop
                </span>
              </div>

              {/* Terminal content */}
              <div className="p-6 min-h-[180px]">
                {terminalLines.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`font-mono text-sm mb-1 ${
                      line.includes("ECO_REWARD_DETECTED")
                        ? "text-primary text-lg font-bold"
                        : line.includes("AWAITING")
                        ? "text-secondary animate-pulse"
                        : "text-primary/70"
                    }`}
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Options Cards */}
            <AnimatePresence>
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  {/* SAFE MODE - COLLECT */}
                  <motion.div
                    className="relative cursor-pointer group"
                    onMouseEnter={() => setHoveredOption("safe")}
                    onMouseLeave={() => setHoveredOption(null)}
                    onClick={onCollect}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className="p-6 border-2 transition-all duration-300"
                      style={{
                        borderColor: hoveredOption === "safe" ? "hsl(120 100% 50%)" : "hsl(120 100% 50% / 0.4)",
                        background: hoveredOption === "safe" 
                          ? "linear-gradient(180deg, hsl(120 100% 50% / 0.15) 0%, hsl(120 100% 30% / 0.05) 100%)"
                          : "linear-gradient(180deg, hsl(120 20% 8%) 0%, hsl(0 0% 4%) 100%)",
                        clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",
                        boxShadow: hoveredOption === "safe" ? "0 0 40px hsl(120 100% 50% / 0.3)" : "none",
                      }}
                    >
                      {/* Badge */}
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-6 h-6 text-primary" />
                        <span className="font-mono text-xs text-primary uppercase tracking-wider">
                          SAFE_MODE
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold font-mono text-primary mb-2">COLLECT</h3>
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground font-mono mb-4">
                        Transfer ECO tokens directly to your wallet. Zero risk, instant access.
                      </p>

                      {/* Amount */}
                      <div className="flex items-center justify-between p-3 border border-primary/30 bg-black/50 mb-4">
                        <span className="font-mono text-sm text-muted-foreground">RECEIVE:</span>
                        <span className="font-mono text-xl font-bold text-primary">+{rewardAmount} ECO</span>
                      </div>

                      {/* Action indicator */}
                      <div className="flex items-center gap-2 text-primary font-mono text-sm">
                        <Wallet className="w-4 h-4" />
                        <span>Tokens → Your Wallet</span>
                        <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                      </div>

                      {/* Hover particle effect */}
                      {hoveredOption === "safe" && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-2 h-2 bg-primary rounded-full"
                              initial={{ 
                                x: "50%", 
                                y: "100%", 
                                opacity: 0 
                              }}
                              animate={{ 
                                x: `${20 + Math.random() * 60}%`,
                                y: "-20%",
                                opacity: [0, 1, 0],
                              }}
                              transition={{
                                duration: 1.5,
                                delay: i * 0.15,
                                repeat: Infinity,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* RISK MODE - REINVEST */}
                  <motion.div
                    className="relative cursor-pointer group"
                    onMouseEnter={() => setHoveredOption("risk")}
                    onMouseLeave={() => setHoveredOption(null)}
                    onClick={onReinvest}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className="p-6 border-2 transition-all duration-300 relative overflow-hidden"
                      style={{
                        borderColor: riskWarningFlash ? "hsl(0 100% 50%)" : "hsl(45 100% 50% / 0.6)",
                        background: hoveredOption === "risk" 
                          ? "linear-gradient(180deg, hsl(0 100% 50% / 0.15) 0%, hsl(45 100% 30% / 0.1) 100%)"
                          : "linear-gradient(180deg, hsl(45 30% 8%) 0%, hsl(0 0% 4%) 100%)",
                        clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)",
                        boxShadow: hoveredOption === "risk" ? "0 0 40px hsl(0 100% 50% / 0.3)" : "none",
                      }}
                    >
                      {/* Warning flash overlay */}
                      {hoveredOption === "risk" && riskWarningFlash && (
                        <div className="absolute inset-0 bg-red-500/10 pointer-events-none" />
                      )}

                      {/* Badge */}
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-6 h-6 text-yellow-500" />
                        <span className="font-mono text-xs text-yellow-500 uppercase tracking-wider">
                          RISK_MODE
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold font-mono text-yellow-500 mb-2">REINVEST</h3>
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground font-mono mb-4">
                        Stake ECO in {merchantName} vault for potential high-yield airdrop rewards.
                      </p>

                      {/* Risk Warning */}
                      {hoveredOption === "risk" && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-2 p-2 bg-red-500/20 border border-red-500/50 mb-4"
                        >
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="font-mono text-xs text-red-400 uppercase">
                            !! HIGH RISK / HIGH REWARD !!
                          </span>
                        </motion.div>
                      )}

                      {/* ROI Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-2 border border-yellow-500/30 bg-black/50 text-center">
                          <div className="font-mono text-xs text-muted-foreground mb-1">EST. ROI</div>
                          <div className="font-mono text-lg font-bold text-yellow-500">{estimatedROI}%</div>
                        </div>
                        <div className="p-2 border border-primary/30 bg-black/50 text-center">
                          <div className="font-mono text-xs text-muted-foreground mb-1">LOCK PERIOD</div>
                          <div className="font-mono text-lg font-bold text-primary">6 MO</div>
                        </div>
                      </div>

                      {/* Action indicator */}
                      <div className="flex items-center gap-2 text-yellow-500 font-mono text-sm">
                        <TrendingUp className="w-4 h-4" />
                        <span>Stake in {merchantName}</span>
                        <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                      </div>

                      {/* Lock icon */}
                      <div className="absolute top-4 right-4">
                        <Lock className="w-5 h-5 text-yellow-500/50" />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer info */}
            <AnimatePresence>
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 text-center"
                >
                  <p className="font-mono text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Investment NFT will be minted as proof of stake
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Corner decorations */}
          <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-primary/50" />
          <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-primary/50" />
          <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-primary/50" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-primary/50" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReinvestTerminal;
