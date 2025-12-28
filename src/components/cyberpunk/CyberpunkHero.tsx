import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Zap, Shield, TrendingUp } from "lucide-react";
import { CyberButton } from "./CyberButton";
import { TypingText, CyclingTypingText } from "./TypingText";

const heroMessages = [
  ">> Initializing sustainable commerce protocol... ECO Token rewards activated.",
  ">> Syncing with Sui blockchain... Smart contracts verified.",
  ">> Scanning eco-products database... 500+ green items indexed.",
  ">> Calculating carbon offset... 2.5M kg CO₂ reduced globally.",
];

export const CyberpunkHero = () => {
  const [glitchTitle, setGlitchTitle] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitchTitle(true);
        setTimeout(() => setGlitchTitle(false), 150);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Status badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 border border-primary/50 bg-black/80 mb-8 font-mono text-xs uppercase tracking-widest"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
          }}
        >
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-primary">SUI_NETWORK::CONNECTED</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className={cn(
            "text-5xl md:text-7xl lg:text-8xl font-bold mb-6 font-mono uppercase tracking-tight",
            glitchTitle && "glitch-text"
          )}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-foreground">The Future of</span>
          <br />
          <span className="text-primary neon-text">
            Green Commerce
          </span>
        </motion.h1>

        {/* Cycling typing subtitle */}
        <motion.div
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-mono h-14 flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <CyclingTypingText
            messages={heroMessages}
            speed={25}
            pauseDuration={15000}
          />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <CyberButton variant="primary">
            <Zap className="w-5 h-5 mr-2" />
            INITIALIZE
          </CyberButton>
          <CyberButton variant="secondary">
            <Terminal className="w-5 h-5 mr-2" />
            READ_DOCS
          </CyberButton>
        </motion.div>

        {/* Stats - HUD panels */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          {[
            { value: "2.5M", label: "CO₂_REDUCED", icon: <Terminal className="w-5 h-5" /> },
            { value: "15K+", label: "ACTIVE_NODES", icon: <Shield className="w-5 h-5" /> },
            { value: "500+", label: "ECO_PRODUCTS", icon: <Zap className="w-5 h-5" /> },
            { value: "98%", label: "UPTIME", icon: <TrendingUp className="w-5 h-5" /> },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative group"
              whileHover={{ scale: 1.02 }}
            >
              <div 
                className="p-6 bg-black/80 border border-primary/30 hover:border-primary/80 transition-colors"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
                }}
              >
                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/50" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/50" />
                
                <div className="flex items-center justify-center mb-2 text-primary">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-primary font-mono neon-text">
                  <TypingText text={stat.value} speed={100} delay={index * 200} />
                </div>
                <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
              
              {/* Hover glow */}
              <div className="absolute inset-0 bg-primary/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border border-primary/30 flex items-start justify-center p-2">
          <motion.div
            className="w-1 h-3 bg-primary"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <span className="text-xs text-primary/50 font-mono mt-2 block">SCROLL</span>
      </motion.div>
    </section>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
