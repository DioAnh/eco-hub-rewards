import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  ShoppingBag, 
  Wallet, 
  Gamepad2, 
  Code, 
  X 
} from "lucide-react";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { icon: <ShoppingBag className="w-5 h-5" />, label: "MARKET", href: "#marketplace" },
  { icon: <Wallet className="w-5 h-5" />, label: "WALLET", href: "#wallet" },
  { icon: <Gamepad2 className="w-5 h-5" />, label: "GAME", href: "#avatar" },
  { icon: <Code className="w-5 h-5" />, label: "PROTOCOL", href: "#protocol" },
];

export const CyberMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

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
                const angle = -30 - index * 25;
                const radian = (angle * Math.PI) / 180;
                const length = 90;
                const endX = 128 + Math.cos(radian) * length;
                const endY = 128 + Math.sin(radian) * length;
                
                return (
                  <motion.line
                    key={index}
                    x1="128"
                    y1="128"
                    x2={endX}
                    y2={endY}
                    stroke="hsl(120 100% 50%)"
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
              const angle = -30 - index * 25;
              const radian = (angle * Math.PI) / 180;
              const radius = 90;
              const x = Math.cos(radian) * radius;
              const y = Math.sin(radian) * radius;

              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="absolute flex items-center gap-2 px-4 py-2 bg-black/90 border border-primary/50 hover:border-primary hover:bg-primary/10 transition-all font-mono text-xs uppercase tracking-wider text-primary"
                  style={{
                    bottom: 28,
                    right: 28,
                    clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
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
                  whileHover={{ scale: 1.05 }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </motion.a>
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Main trigger button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 flex items-center justify-center bg-black border-2 border-primary text-primary"
        style={{
          clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
          boxShadow: isOpen ? "0 0 30px hsl(120 100% 50% / 0.5)" : "0 0 15px hsl(120 100% 50% / 0.3)",
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
