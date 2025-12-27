import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BloomAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
  position?: { x: number; y: number };
}

interface Petal {
  id: number;
  angle: number;
  delay: number;
  scale: number;
  color: string;
}

interface Token {
  id: number;
  angle: number;
  delay: number;
}

export const BloomAnimation = ({ isActive, onComplete, position }: BloomAnimationProps) => {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    if (isActive) {
      // Generate petals
      const newPetals: Petal[] = [];
      for (let i = 0; i < 8; i++) {
        newPetals.push({
          id: i,
          angle: i * 45,
          delay: i * 0.05,
          scale: 0.8 + Math.random() * 0.4,
          color: `hsl(${120 + Math.random() * 40}, 70%, ${50 + Math.random() * 20}%)`,
        });
      }
      setPetals(newPetals);

      // Generate flying tokens
      const newTokens: Token[] = [];
      for (let i = 0; i < 6; i++) {
        newTokens.push({
          id: i,
          angle: -60 + Math.random() * 120,
          delay: 0.3 + i * 0.1,
        });
      }
      setTokens(newTokens);

      // Cleanup
      const timer = setTimeout(() => {
        setPetals([]);
        setTokens([]);
        onComplete?.();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive && petals.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        left: position?.x ?? "50%",
        top: position?.y ?? "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <AnimatePresence>
        {/* Center glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 3, 4], opacity: [0, 1, 0] }}
          transition={{ duration: 1 }}
        />

        {/* Petals blooming */}
        {petals.map((petal) => (
          <motion.div
            key={`petal-${petal.id}`}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              transformOrigin: "center center",
            }}
            initial={{ rotate: petal.angle, scale: 0 }}
            animate={{
              rotate: petal.angle,
              scale: [0, petal.scale, petal.scale * 1.2, 0],
            }}
            transition={{
              duration: 1.5,
              delay: petal.delay,
              ease: "easeOut",
            }}
          >
            {/* Petal shape */}
            <motion.div
              className="w-8 h-16 rounded-full"
              style={{
                background: `linear-gradient(to top, ${petal.color}, transparent)`,
                transformOrigin: "center bottom",
                transform: "translateY(-100%)",
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: [0, 1, 1.2, 0] }}
              transition={{
                duration: 1.5,
                delay: petal.delay,
                ease: "easeOut",
              }}
            />
          </motion.div>
        ))}

        {/* Center flower */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(48 96% 53%) 0%, hsl(38 92% 50%) 100%)",
            boxShadow: "0 0 20px hsl(48 96% 53% / 0.5)",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1, 0] }}
          transition={{ duration: 1.5, delay: 0.2 }}
        />

        {/* Flying ECO tokens */}
        {tokens.map((token) => (
          <motion.div
            key={`token-${token.id}`}
            className="absolute left-1/2 top-1/2 flex items-center justify-center"
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: [0, Math.cos((token.angle * Math.PI) / 180) * 150, Math.cos((token.angle * Math.PI) / 180) * 300],
              y: [0, Math.sin((token.angle * Math.PI) / 180) * 50 - 100, -200],
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 0.8, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 1.5,
              delay: token.delay,
              ease: "easeOut",
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)), hsl(142 76% 46%))",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 15px hsl(var(--primary) / 0.6)",
              }}
            >
              ECO
            </div>
          </motion.div>
        ))}

        {/* Sparkle particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-primary"
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: (Math.random() - 0.5) * 200,
              y: (Math.random() - 0.5) * 200 - 50,
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 1,
              delay: 0.5 + i * 0.05,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Hook to trigger bloom animation
export const useBloomAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | undefined>();

  const triggerBloom = (x?: number, y?: number) => {
    if (x !== undefined && y !== undefined) {
      setPosition({ x, y });
    }
    setIsAnimating(true);
  };

  const onComplete = () => {
    setIsAnimating(false);
    setPosition(undefined);
  };

  return {
    isAnimating,
    position,
    triggerBloom,
    onComplete,
    BloomComponent: () => (
      <BloomAnimation isActive={isAnimating} onComplete={onComplete} position={position} />
    ),
  };
};
