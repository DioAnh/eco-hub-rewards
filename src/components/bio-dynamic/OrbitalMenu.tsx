import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Leaf, 
  ShoppingBag, 
  Wallet, 
  Gamepad2, 
  Users, 
  X,
  Sparkles
} from "lucide-react";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  color: string;
}

const menuItems: MenuItem[] = [
  { 
    icon: <ShoppingBag className="w-5 h-5" />, 
    label: "Market", 
    href: "#marketplace",
    color: "hsl(142 76% 36%)"
  },
  { 
    icon: <Wallet className="w-5 h-5" />, 
    label: "Wallet", 
    href: "#wallet",
    color: "hsl(142 76% 46%)"
  },
  { 
    icon: <Gamepad2 className="w-5 h-5" />, 
    label: "Game", 
    href: "#avatar",
    color: "hsl(142 76% 56%)"
  },
  { 
    icon: <Users className="w-5 h-5" />, 
    label: "Social", 
    href: "#social",
    color: "hsl(142 76% 66%)"
  },
];

export const OrbitalMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Menu items - Branch pattern */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Connecting lines (branches) */}
            <svg
              className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none"
              style={{ transform: "translate(30%, 30%)" }}
            >
              {menuItems.map((_, index) => {
                const angle = -45 - index * 30;
                const radian = (angle * Math.PI) / 180;
                const length = 100;
                const endX = 128 + Math.cos(radian) * length;
                const endY = 128 + Math.sin(radian) * length;
                
                return (
                  <motion.line
                    key={index}
                    x1="128"
                    y1="128"
                    x2={endX}
                    y2={endY}
                    stroke="hsl(var(--primary) / 0.3)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ pathLength: 0, opacity: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  />
                );
              })}
            </svg>

            {/* Menu items */}
            {menuItems.map((item, index) => {
              const angle = -45 - index * 30;
              const radian = (angle * Math.PI) / 180;
              const radius = 100;
              const x = Math.cos(radian) * radius;
              const y = Math.sin(radian) * radius;

              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="absolute flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border border-primary/30 hover:border-primary/60 transition-colors group"
                  style={{
                    background: "hsl(var(--card) / 0.9)",
                    bottom: 28,
                    right: 28,
                  }}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 0, 
                    scale: 0 
                  }}
                  animate={{ 
                    x: x, 
                    y: y, 
                    opacity: 1, 
                    scale: 1 
                  }}
                  exit={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 0, 
                    scale: 0 
                  }}
                  transition={{ 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-primary group-hover:text-primary-foreground transition-colors">
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {item.label}
                  </span>
                  
                  {/* Leaf decoration */}
                  <motion.div
                    className="absolute -top-1 -right-1"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-3 h-3 text-primary/60" />
                  </motion.div>
                </motion.a>
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Main trigger button */}
      <motion.button
        onClick={toggleMenu}
        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)), hsl(142 76% 26%))",
          boxShadow: "0 0 30px hsl(var(--primary) / 0.4)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 180 }}
            >
              <X className="w-6 h-6 text-primary-foreground" />
            </motion.div>
          ) : (
            <motion.div
              key="leaf"
              initial={{ opacity: 0, rotate: 180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -180 }}
            >
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/40"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 0, 0.6],
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
