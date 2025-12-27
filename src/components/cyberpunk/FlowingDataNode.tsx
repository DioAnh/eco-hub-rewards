import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Terminal, Zap, ShoppingCart } from "lucide-react";
import { CyberButton } from "./CyberButton";

interface FlowingDataNodeProps {
  product: {
    id: number;
    name: string;
    price: number;
    ecoTokens: number;
    co2Saved: number;
    image: string;
  };
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  onPositionUpdate: (id: number, pos: { x: number; y: number }, vel: { x: number; y: number }) => void;
  trailPositions: { x: number; y: number }[];
  onBuy: () => void;
}

export const FlowingDataNode = ({ 
  product, 
  position, 
  velocity, 
  onPositionUpdate, 
  trailPositions,
  onBuy 
}: FlowingDataNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: 400, damping: 25 });

  useEffect(() => {
    scale.set(isHovered ? 1.2 : 1);
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
    <>
      {/* Digital light trail */}
      <svg 
        className="absolute inset-0 pointer-events-none overflow-visible"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <linearGradient id={`trail-gradient-${product.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(120 100% 50%)" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(120 100% 50%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(180 100% 50%)" stopOpacity="0.8" />
          </linearGradient>
          <filter id={`glow-${product.id}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {trailPositions.length > 1 && (
          <path
            d={`M ${trailPositions.map(p => `${p.x},${p.y}`).join(' L ')}`}
            fill="none"
            stroke={`url(#trail-gradient-${product.id})`}
            strokeWidth="3"
            strokeLinecap="round"
            filter={`url(#glow-${product.id})`}
            opacity={0.7}
          />
        )}
        {/* Trail particles */}
        {trailPositions.filter((_, i) => i % 3 === 0).map((pos, i) => (
          <circle
            key={i}
            cx={pos.x}
            cy={pos.y}
            r={Math.max(1, 3 - i * 0.2)}
            fill="hsl(120 100% 50%)"
            opacity={Math.max(0.1, 0.6 - i * 0.04)}
          />
        ))}
      </svg>

      {/* Main node */}
      <motion.div
        ref={nodeRef}
        className="absolute cursor-pointer select-none"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          scale: springScale,
          zIndex: isHovered ? 50 : 10,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Outer glow */}
        <motion.div
          className="absolute inset-0 rounded-sm"
          style={{
            background: isHovered
              ? "radial-gradient(circle, hsl(120 100% 50% / 0.5) 0%, transparent 70%)"
              : "radial-gradient(circle, hsl(120 100% 50% / 0.15) 0%, transparent 70%)",
            filter: "blur(25px)",
            transform: "scale(2)",
          }}
        />

        {/* Main node container - Hexagonal shape */}
        <div
          className="relative w-44 h-52 overflow-hidden transition-all duration-300"
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            background: "linear-gradient(180deg, hsl(180 15% 8%) 0%, hsl(0 0% 0%) 100%)",
            border: isHovered ? "2px solid hsl(120 100% 50%)" : "1px solid hsl(120 100% 30%)",
            boxShadow: isHovered
              ? "0 0 40px hsl(120 100% 50% / 0.6), inset 0 0 30px hsl(120 100% 50% / 0.15)"
              : "0 0 15px hsl(120 100% 50% / 0.25)",
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
              backgroundSize: "15px 15px",
            }}
          />

          {/* Product image */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-20 overflow-hidden rounded-sm border border-primary/30">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              style={{
                filter: isHovered ? "none" : "grayscale(30%) brightness(0.8)",
              }}
            />
            {isHovered && (
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay animate-pulse" />
            )}
          </div>

          {/* Product info */}
          <div className="absolute bottom-6 left-0 right-0 text-center px-3">
            <h3 className="font-mono text-[10px] text-primary truncate uppercase tracking-wider">
              {product.name}
            </h3>
            <p className="font-mono text-primary text-xs mt-1 neon-text">
              {product.price.toLocaleString()}đ
            </p>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-primary/50" />
          <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-primary/50" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-primary/50" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-primary/50" />
        </div>

        {/* Hover indicators */}
        {isHovered && (
          <>
            <motion.div
              className="absolute -top-10 left-1/2 -translate-x-1/2 z-20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 px-2 py-1 bg-black/90 border border-primary/50 font-mono text-[10px] text-primary whitespace-nowrap neon-border">
                <Terminal className="w-3 h-3" />
                <span>{product.co2Saved}kg CO₂</span>
              </div>
            </motion.div>

            <motion.div
              className="absolute -right-20 top-1/2 -translate-y-1/2 z-20"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-1 px-2 py-1 bg-black/90 border border-secondary/50 font-mono text-[10px] text-secondary whitespace-nowrap">
                <Zap className="w-3 h-3" />
                <span>+{product.ecoTokens} ECO</span>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-14 left-1/2 -translate-x-1/2 z-30"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <CyberButton onClick={onBuy}>
                <ShoppingCart className="w-3 h-3 mr-1" />
                EXECUTE
              </CyberButton>
            </motion.div>
          </>
        )}
      </motion.div>
    </>
  );
};
