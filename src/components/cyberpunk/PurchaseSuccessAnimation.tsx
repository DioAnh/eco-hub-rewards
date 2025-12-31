import { motion, AnimatePresence } from "framer-motion";
import { Check, Leaf, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface PurchaseSuccessAnimationProps {
  isVisible: boolean;
  productName: string;
  ecoTokens: number;
  onComplete: () => void;
}

const PurchaseSuccessAnimation = ({
  isVisible,
  productName,
  ecoTokens,
  onComplete,
}: PurchaseSuccessAnimationProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [showBloom, setShowBloom] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Generate particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);
      setShowBloom(true);

      // Auto close after animation
      const timer = setTimeout(() => {
        onComplete();
        setShowBloom(false);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
        >
          {/* Matrix-style falling characters in background */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
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

          {/* Central bloom animation */}
          <div className="relative">
            {/* Outer glow rings */}
            {showBloom && (
              <>
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    width: 200,
                    height: 200,
                    left: -100,
                    top: -100,
                    border: "2px solid hsl(var(--primary))",
                    boxShadow: "0 0 40px hsl(var(--primary) / 0.5)",
                  }}
                />
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    width: 200,
                    height: 200,
                    left: -100,
                    top: -100,
                    border: "2px solid hsl(var(--secondary))",
                  }}
                />
              </>
            )}

            {/* ECO Token particles flying outward */}
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{
                  x: particle.x * 2,
                  y: particle.y * 2,
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: particle.delay + 0.5,
                  ease: "easeOut",
                }}
                className="absolute"
                style={{ left: 0, top: 0 }}
              >
                <div className="w-3 h-3 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-[6px] font-bold text-black">E</span>
                </div>
              </motion.div>
            ))}

            {/* Blooming flower/leaf animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="relative z-10"
            >
              {/* Leaf petals */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <motion.div
                  key={angle}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="absolute"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-40px)`,
                    transformOrigin: "center center",
                    left: "50%",
                    top: "50%",
                  }}
                >
                  <Leaf
                    className="w-6 h-6 text-primary"
                    style={{
                      filter: "drop-shadow(0 0 10px hsl(var(--primary)))",
                    }}
                  />
                </motion.div>
              ))}

              {/* Center circle with check */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="w-24 h-24 rounded-full flex items-center justify-center relative"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)), hsl(120 100% 30%))",
                  boxShadow: "0 0 60px hsl(var(--primary) / 0.8), inset 0 0 30px rgba(0,0,0,0.3)",
                }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8, type: "spring" }}
                >
                  <Check className="w-12 h-12 text-black" strokeWidth={3} />
                </motion.div>

                {/* Sparkles around */}
                {[0, 120, 240].map((angle, i) => (
                  <motion.div
                    key={angle}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
                    transition={{ delay: 1 + i * 0.2, duration: 0.5 }}
                    className="absolute"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-60px)`,
                    }}
                  >
                    <Sparkles className="w-5 h-5 text-secondary" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Success text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="text-center mt-12"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="font-mono text-xs text-primary mb-2 tracking-widest"
              >
                {">> TRANSACTION_CONFIRMED"}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, type: "spring" }}
                className="text-3xl font-bold font-mono text-primary mb-3"
                style={{
                  textShadow: "0 0 30px hsl(var(--primary)), 0 0 60px hsl(var(--primary) / 0.5)",
                }}
              >
                PURCHASE_SUCCESS!
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="font-mono text-muted-foreground text-sm mb-4"
              >
                {productName}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30"
              >
                <span className="font-mono text-primary text-lg">-{ecoTokens} ECO</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
                className="mt-6 font-mono text-xs text-muted-foreground"
              >
                {">> "} Redirecting to profile...
              </motion.div>
            </motion.div>
          </div>

          {/* Scan lines effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PurchaseSuccessAnimation;
