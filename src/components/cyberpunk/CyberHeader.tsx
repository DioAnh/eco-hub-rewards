import { motion } from "framer-motion";
import { Terminal, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { WalletConnectButton } from "@/components/WalletConnectButton";
import { useWalletDemo } from "@/hooks/useWalletDemo";

export const CyberHeader = () => {
  const { isConnected, balance } = useWalletDemo();

  return (
    <motion.header
      className="fixed top-8 left-0 right-0 z-40 px-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            className="w-12 h-12 bg-black/80 border border-primary/50 flex items-center justify-center"
            style={{
              clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
            }}
            whileHover={{ 
              borderColor: "hsl(120 100% 50%)",
              boxShadow: "0 0 20px hsl(120 100% 50% / 0.5)",
            }}
          >
            <Terminal className="w-6 h-6 text-primary" />
          </motion.div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold text-primary font-mono uppercase tracking-wider neon-text">
              EcoShop
            </span>
            <div className="text-xs text-muted-foreground font-mono">v2.0.0</div>
          </div>
        </Link>

        {/* Right side - Balance + Wallet */}
        <div className="flex items-center gap-3">
          {/* ECO Balance - Always visible when connected */}
          {isConnected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-black/80 border border-primary/40"
              style={{
                clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
              }}
            >
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-lg font-bold text-primary font-mono neon-text">{balance}</span>
              <span className="text-xs text-secondary font-mono">ECO</span>
            </motion.div>
          )}
          
          <WalletConnectButton />
        </div>
      </div>
    </motion.header>
  );
};
