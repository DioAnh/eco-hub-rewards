import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  ShoppingBag,
  X,
  Leaf,
  FileText,
  Coins,
  Book,
  Store,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { icon: <ShoppingBag className="w-5 h-5" />, label: "MARKET", href: "/marketplace" },
  { icon: <Leaf className="w-5 h-5" />, label: "ECO_SCORE", href: "/eco-score" },
  { icon: <Coins className="w-5 h-5" />, label: "STAKING", href: "/staking" },
  { icon: <FileText className="w-5 h-5" />, label: "WHITEPAPER", href: "/whitepaper" },
  { icon: <Book className="w-5 h-5" />, label: "DOCS", href: "/docs" },
  { icon: <Store className="w-5 h-5" />, label: "LISTING", href: "/listing-guide" },
];

export const CyberMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const panelWidthClass = isMobile ? "w-48" : "w-56";

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="menu"
            className="absolute bottom-20 right-0 flex flex-col items-end gap-2 overflow-y-auto"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            style={{ maxHeight: "calc(100vh - 10rem)" }}
          >
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex ${panelWidthClass} items-center gap-2 px-4 py-2 bg-background/90 border border-primary/50 hover:border-primary hover:bg-primary/10 transition-all font-mono text-xs uppercase tracking-wider text-primary whitespace-nowrap`}
                style={{
                  clipPath:
                    "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                }}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        className="relative w-14 h-14 flex items-center justify-center bg-background border-2 border-primary text-primary"
        style={{
          clipPath:
            "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
          boxShadow: isOpen
            ? "0 0 30px hsl(var(--primary) / 0.5)"
            : "0 0 15px hsl(var(--primary) / 0.3)",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="terminal"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
            >
              <Terminal className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="absolute inset-0 border border-primary/40"
          style={{
            clipPath:
              "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </motion.button>
    </div>
  );
};
