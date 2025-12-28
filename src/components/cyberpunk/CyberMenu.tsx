import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Terminal, 
  ShoppingBag, 
  X,
  Leaf,
  FileText,
  Coins,
  Book,
  Store
} from "lucide-react";

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

  const startAngle = -20;
  const endAngle = -160;
  const angleStep = menuItems.length > 1 ? (endAngle - startAngle) / (menuItems.length - 1) : 0;
  const menuRadius = isMobile ? 104 : 120;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Connection lines */}
            <svg
              className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none"
              style={{ transform: "translate(30%, 30%)" }}
            >
              {menuItems.map((_, index) => {
                const angle = startAngle + index * angleStep;
                const radian = (angle * Math.PI) / 180;
                const length = menuRadius;
                const endX = 128 + Math.cos(radian) * length;
                const endY = 128 + Math.sin(radian) * length;
                
                return (
                  <motion.line
                    key={index}
                    x1="128"
                    y1="128"
                    x2={endX}
                    y2={endY}
                    stroke="hsl(var(--primary))"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.5 }}
                    exit={{ pathLength: 0, opacity: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  />
                );
              })}
            </svg>

            {/* Menu items */}
            {menuItems.map((item, index) => {
              const angle = startAngle + index * angleStep;
              const radian = (angle * Math.PI) / 180;
              const x = Math.cos(radian) * menuRadius;
              const y = Math.sin(radian) * menuRadius;

              return (
                <motion.div
                  key={item.label}
                  className="absolute"
                  style={{
                    bottom: 28,
                    right: 28,
                  }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                  animate={{ x, y, opacity: 1, scale: 1 }}
                  exit={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                  transition={{ 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-background/90 border border-primary/50 hover:border-primary hover:bg-primary/10 transition-all font-mono text-xs uppercase tracking-wider text-primary whitespace-nowrap"
                    style={{
                      clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Main trigger button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 flex items-center justify-center bg-background border-2 border-primary text-primary"
        style={{
          clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
          boxShadow: isOpen ? "0 0 30px hsl(var(--primary) / 0.5)" : "0 0 15px hsl(var(--primary) / 0.3)",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
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

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 border border-primary/40"
          style={{
            clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
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
