import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { WalletConnectButton } from "@/components/WalletConnectButton";

export const MinimalHeader = () => {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 px-6 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <motion.div
            className="w-12 h-12 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Leaf className="w-6 h-6 text-primary" />
          </motion.div>
          <span className="text-xl font-bold text-foreground hidden sm:block">
            EcoShop
          </span>
        </a>

        {/* Right side - Wallet */}
        <div className="flex items-center gap-4">
          <WalletConnectButton />
        </div>
      </div>
    </motion.header>
  );
};
