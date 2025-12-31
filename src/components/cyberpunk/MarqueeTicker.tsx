import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MarqueeTickerProps {
  messages?: string[];
  speed?: number;
}

const defaultMessages = [
  "USER_X9Y just reduced 2kg CO₂ on SUI chain",
  "SYSTEM RECORDING TRANSACTION #0x3f8a...",
  "ECO_TOKEN MINTED: +45 ECO → 0x7b2c...",
  "PROOF_OF_GREEN VERIFIED ✓",
  "NEW_MERCHANT REGISTERED: GreenLife Store",
  "STAKING_VAULT: 500,000 ECO LOCKED",
  "NETWORK_STATUS: OPERATIONAL",
  "BLOCK_HEIGHT: 1,234,567",
];

export const MarqueeTicker = ({ 
  messages = defaultMessages,
  speed = 30 
}: MarqueeTickerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [messages.length]);

  const displayText = messages.join(" ◆ ");

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 border-b border-primary/30 overflow-hidden">
      <div className="relative h-8 flex items-center">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
        
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
        
        {/* Scrolling text */}
        <motion.div
          className="flex whitespace-nowrap font-mono text-xs text-primary/80 uppercase tracking-wider"
          animate={{
            x: [0, -2000],
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <span className="px-4">{displayText}</span>
          <span className="px-4">{displayText}</span>
          <span className="px-4">{displayText}</span>
        </motion.div>
        
        {/* Status indicators */}
        <div className="absolute right-4 flex items-center gap-2 z-20">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-xs font-mono text-primary/60">LIVE</span>
        </div>
      </div>
    </div>
  );
};
