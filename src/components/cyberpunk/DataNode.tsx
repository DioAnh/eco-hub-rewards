import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Terminal, Zap, ShoppingCart } from "lucide-react";
import { CyberButton } from "./CyberButton";

interface DataNodeProps {
  product: {
    id: number;
    name: string;
    price: number;
    ecoTokens: number;
    co2Saved: number;
    image: string;
  };
  index: number;
  onBuy: () => void;
}

export const DataNode = ({ product, index, onBuy }: DataNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  
  // Physics-based movement
  const posX = useMotionValue(0);
  const posY = useMotionValue(0);
  const velX = useRef((Math.random() - 0.5) * 2);
  const velY = useRef((Math.random() - 0.5) * 2);
  
  const springX = useSpring(posX, { stiffness: 50, damping: 20 });
  const springY = useSpring(posY, { stiffness: 50, damping: 20 });
  
  // Scale on hover
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: 400, damping: 25 });

  // Physics animation - floating and bouncing
  useEffect(() => {
    let animationId: number;
    let currentX = 0;
    let currentY = 0;
    const bounds = 50;
    
    const animate = () => {
      // Apply velocity
      currentX += velX.current;
      currentY += velY.current;
      
      // Bounce off boundaries
      if (Math.abs(currentX) > bounds) {
        velX.current *= -0.8;
        currentX = Math.sign(currentX) * bounds;
      }
      if (Math.abs(currentY) > bounds) {
        velY.current *= -0.8;
        currentY = Math.sign(currentY) * bounds;
      }
      
      // Add subtle random force
      velX.current += (Math.random() - 0.5) * 0.1;
      velY.current += (Math.random() - 0.5) * 0.1;
      
      // Damping
      velX.current *= 0.99;
      velY.current *= 0.99;
      
      posX.set(currentX);
      posY.set(currentY);
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [posX, posY]);

  useEffect(() => {
    scale.set(isHovered ? 1.15 : 1);
  }, [isHovered, scale]);

  // Scan effect state
  const [scanY, setScanY] = useState(0);
  
  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setScanY((prev) => (prev + 5) % 100);
      }, 50);
      return () => clearInterval(interval);
    }
    setScanY(0);
  }, [isHovered]);

  return (
    <motion.div
      ref={nodeRef}
      className="relative cursor-pointer select-none"
      style={{
        x: springX,
        y: springY,
        scale: springScale,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-sm"
        style={{
          background: isHovered
            ? "radial-gradient(circle, hsl(120 100% 50% / 0.4) 0%, transparent 70%)"
            : "radial-gradient(circle, hsl(120 100% 50% / 0.1) 0%, transparent 70%)",
          filter: "blur(20px)",
          transform: "scale(1.5)",
        }}
      />

      {/* Main node container - Hexagonal/polygonal shape */}
      <div
        className="relative w-56 h-64 overflow-hidden"
        style={{
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          background: "linear-gradient(180deg, hsl(180 15% 8%) 0%, hsl(0 0% 0%) 100%)",
          border: isHovered ? "2px solid hsl(120 100% 50%)" : "1px solid hsl(120 100% 30%)",
          boxShadow: isHovered
            ? "0 0 30px hsl(120 100% 50% / 0.5), inset 0 0 30px hsl(120 100% 50% / 0.1)"
            : "0 0 10px hsl(120 100% 50% / 0.2)",
        }}
      >
        {/* Scan effect line */}
        {isHovered && (
          <motion.div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent pointer-events-none"
            style={{
              top: `${scanY}%`,
              boxShadow: "0 0 20px hsl(120 100% 50%)",
            }}
          />
        )}

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(hsl(120 100% 50% / 0.1) 1px, transparent 1px),
              linear-gradient(90deg, hsl(120 100% 50% / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Product image */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-24 overflow-hidden rounded-sm border border-primary/30">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{
              filter: isHovered ? "none" : "grayscale(30%) brightness(0.8)",
            }}
          />
          {/* Image glitch overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay animate-pulse" />
          )}
        </div>

        {/* Product info */}
        <div className="absolute bottom-8 left-0 right-0 text-center px-4">
          <h3 className="font-mono text-xs text-primary truncate uppercase tracking-wider">
            {product.name}
          </h3>
          <p className="font-mono text-primary text-sm mt-1 neon-text">
            {product.price.toLocaleString()}đ
          </p>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary/50" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary/50" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary/50" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary/50" />
      </div>

      {/* Data indicators (visible on hover) - positioned outside to avoid overlap */}
      {isHovered && (
        <>
          {/* Top indicator */}
          <motion.div
            className="absolute -top-12 left-1/2 -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/90 border border-primary/50 rounded-none font-mono text-xs text-primary whitespace-nowrap neon-border">
              <Terminal className="w-3 h-3" />
              <span>{product.co2Saved}kg CO₂</span>
            </div>
          </motion.div>

          {/* Side indicator */}
          <motion.div
            className="absolute -right-24 top-1/2 -translate-y-1/2 z-20"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/90 border border-secondary/50 rounded-none font-mono text-xs text-secondary whitespace-nowrap">
              <Zap className="w-3 h-3" />
              <span>+{product.ecoTokens} ECO</span>
            </div>
          </motion.div>

          {/* Buy button - at bottom with proper z-index */}
          <motion.div
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-30"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <CyberButton onClick={onBuy}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              EXECUTE
            </CyberButton>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};
