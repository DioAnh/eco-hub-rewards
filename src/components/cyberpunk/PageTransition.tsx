import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ReactNode, useState, useEffect } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {/* Glitch overlay during transition */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Scan lines */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(120 100% 50% / 0.03) 2px, hsl(120 100% 50% / 0.03) 4px)',
                animation: 'scanlines 0.1s linear infinite',
              }}
            />
            
            {/* Glitch blocks */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-primary/20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 30 + 10}%`,
                  height: `${Math.random() * 5 + 2}px`,
                }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scaleX: [0, 1, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                }}
                transition={{ 
                  duration: 0.3,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
              />
            ))}
            
            {/* Loading text */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-primary text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.4 }}
            >
              <span className="animate-pulse">LOADING DATA...</span>
            </motion.div>
            
            {/* Horizontal glitch line */}
            <motion.div
              className="absolute left-0 right-0 h-1 bg-primary"
              style={{ boxShadow: '0 0 20px hsl(120 100% 50%)' }}
              initial={{ top: '0%', opacity: 0 }}
              animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.4, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
};