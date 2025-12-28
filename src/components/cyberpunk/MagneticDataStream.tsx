import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Zap, ShoppingCart, Shield, Star, Users } from "lucide-react";
import gsap from "gsap";
import { CyberButton } from "./CyberButton";
import { ConductiveGrid } from "./ConductiveGrid";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const products = [
  { id: 1, name: "Organic Canvas Bag", price: 189000, ecoTokens: 45, co2Saved: 2.3, rating: 4.8, buyers: 1247, verified: true, image: product1 },
  { id: 2, name: "Bamboo Straw Set", price: 89000, ecoTokens: 25, co2Saved: 0.8, rating: 4.5, buyers: 892, verified: true, image: product2 },
  { id: 3, name: "Steel Water Bottle", price: 299000, ecoTokens: 60, co2Saved: 4.2, rating: 4.9, buyers: 2103, verified: true, image: product3 },
  { id: 4, name: "Wheat Lunch Box", price: 159000, ecoTokens: 35, co2Saved: 1.5, rating: 4.6, buyers: 567, verified: true, image: product1 },
  { id: 5, name: "Bamboo Toothbrush", price: 45000, ecoTokens: 15, co2Saved: 0.5, rating: 4.4, buyers: 3421, verified: true, image: product2 },
  { id: 6, name: "Organic Cotton Towel", price: 249000, ecoTokens: 50, co2Saved: 3.1, rating: 4.7, buyers: 432, verified: true, image: product3 },
  { id: 7, name: "Hemp Backpack", price: 459000, ecoTokens: 85, co2Saved: 5.2, rating: 4.9, buyers: 789, verified: true, image: product1 },
  { id: 8, name: "Cork Wallet", price: 199000, ecoTokens: 40, co2Saved: 1.8, rating: 4.3, buyers: 654, verified: false, image: product2 },
  { id: 9, name: "Recycled Notebook", price: 79000, ecoTokens: 20, co2Saved: 0.6, rating: 4.2, buyers: 1876, verified: true, image: product3 },
  { id: 10, name: "Solar Power Bank", price: 589000, ecoTokens: 100, co2Saved: 8.5, rating: 4.8, buyers: 1234, verified: true, image: product1 },
  { id: 11, name: "Beeswax Food Wrap", price: 129000, ecoTokens: 30, co2Saved: 1.2, rating: 4.6, buyers: 987, verified: true, image: product2 },
  { id: 12, name: "Coconut Bowl Set", price: 169000, ecoTokens: 38, co2Saved: 1.4, rating: 4.5, buyers: 543, verified: true, image: product3 },
  { id: 13, name: "Bamboo Cutlery Kit", price: 99000, ecoTokens: 22, co2Saved: 0.9, rating: 4.7, buyers: 2345, verified: true, image: product1 },
  { id: 14, name: "Reusable Coffee Cup", price: 189000, ecoTokens: 42, co2Saved: 2.1, rating: 4.4, buyers: 1567, verified: true, image: product2 },
  { id: 15, name: "Natural Fiber Mat", price: 349000, ecoTokens: 65, co2Saved: 3.8, rating: 4.8, buyers: 321, verified: true, image: product3 },
  { id: 16, name: "Organic Soap Bar", price: 59000, ecoTokens: 12, co2Saved: 0.4, rating: 4.1, buyers: 4532, verified: false, image: product1 },
  { id: 17, name: "Recycled Glass Vase", price: 279000, ecoTokens: 55, co2Saved: 2.9, rating: 4.6, buyers: 234, verified: true, image: product2 },
  { id: 18, name: "Bamboo Phone Case", price: 149000, ecoTokens: 32, co2Saved: 1.1, rating: 4.3, buyers: 1876, verified: true, image: product3 },
  { id: 19, name: "Hemp Rope Basket", price: 219000, ecoTokens: 48, co2Saved: 2.4, rating: 4.5, buyers: 456, verified: true, image: product1 },
  { id: 20, name: "Sustainable Candle", price: 139000, ecoTokens: 28, co2Saved: 1.0, rating: 4.7, buyers: 876, verified: true, image: product2 },
  { id: 21, name: "Eco Yoga Block", price: 179000, ecoTokens: 36, co2Saved: 1.6, rating: 4.4, buyers: 654, verified: true, image: product3 },
  { id: 22, name: "Recycled Tote Bag", price: 119000, ecoTokens: 26, co2Saved: 0.7, rating: 4.2, buyers: 2134, verified: false, image: product1 },
  { id: 23, name: "Organic Tea Set", price: 389000, ecoTokens: 72, co2Saved: 4.5, rating: 4.9, buyers: 432, verified: true, image: product2 },
  { id: 24, name: "Bamboo Desk Organizer", price: 259000, ecoTokens: 52, co2Saved: 2.7, rating: 4.6, buyers: 567, verified: true, image: product3 },
];

// Split into rows
const row1 = products.slice(0, 8);
const row2 = products.slice(8, 16);
const row3 = products.slice(16, 24);

// Layout constants (must match rendered card width + flex gap to avoid drift/overlap)
const DATA_PACKET_WIDTH_PX = 176; // tailwind w-44
const DATA_PACKET_GAP_PX = 40;

// Simplex noise function for organic movement
const simplex2D = (x: number, y: number): number => {
  // Simplified noise approximation using sine waves
  const n1 = Math.sin(x * 1.27 + y * 0.63) * 0.5;
  const n2 = Math.sin(x * 0.89 - y * 1.43) * 0.3;
  const n3 = Math.sin(x * 2.13 + y * 0.97) * 0.2;
  return n1 + n2 + n3;
};

// Generate unique kinetic properties for each product
interface KineticProperties {
  frequency: number;
  amplitude: number;
  phaseOffset: number;
  rotationSpeed: number;
  velocityMultiplier: number;
  noiseOffset: { x: number; y: number };
}

const generateKineticProps = (index: number): KineticProperties => ({
  frequency: 0.6 + Math.random() * 0.4, // 0.6 - 1.0
  amplitude: 8 + Math.random() * 6, // 8 - 14 pixels
  phaseOffset: index * 0.7 + Math.random() * Math.PI,
  rotationSpeed: 0.2 + Math.random() * 0.3,
  velocityMultiplier: 0.95 + Math.random() * 0.1, // 0.95 - 1.05 (5-10% variation)
  noiseOffset: { x: Math.random() * 1000, y: Math.random() * 1000 },
});

interface DataPacketProps {
  product: typeof products[0];
  index: number;
  onBuy: () => void;
  onHover: (hovered: boolean) => void;
  onPositionUpdate: (index: number, x: number, y: number) => void;
  isGlitching: boolean;
  velocity: number;
  kineticProps: KineticProperties;
  globalTime: number;
}

const DataPacket = ({ 
  product, 
  index, 
  onBuy, 
  onHover,
  onPositionUpdate,
  isGlitching, 
  velocity,
  kineticProps,
  globalTime,
}: DataPacketProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [pulseActive, setPulseActive] = useState(false);
  
  // Calculate individual kinetic motion
  const { frequency, amplitude, phaseOffset, rotationSpeed, noiseOffset } = kineticProps;
  
  // Individual sine wave for Y-axis bobbing
  const sineY = Math.sin(globalTime * frequency + phaseOffset) * amplitude;
  
  // Noise-based micro-fluctuations (magnetic turbulence)
  const noiseX = simplex2D(globalTime * 0.3 + noiseOffset.x, noiseOffset.y) * 4;
  const noiseY = simplex2D(noiseOffset.x, globalTime * 0.25 + noiseOffset.y) * 3;
  
  // Rotational drift (-2 to +2 degrees)
  const rotationZ = Math.sin(globalTime * rotationSpeed + phaseOffset) * 2;

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover(false);
  };

  // Update position for grid interaction (lightweight: on mount + resize only)
  useEffect(() => {
    const updatePosition = () => {
      if (!nodeRef.current) return;
      const rect = nodeRef.current.getBoundingClientRect();
      onPositionUpdate(index, rect.left + rect.width / 2, rect.top + rect.height / 2);
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [index, onPositionUpdate]);

  // Scan effect on hover
  useEffect(() => {
    if (isHovered && scanLineRef.current) {
      gsap.fromTo(scanLineRef.current,
        { top: "0%" },
        { top: "100%", duration: 0.8, repeat: -1, ease: "none" }
      );
    }
    return () => {
      if (scanLineRef.current) {
        gsap.killTweensOf(scanLineRef.current);
      }
    };
  }, [isHovered]);

  // Periodic shockwave pulse (only when hovered to avoid heavy background timers)
  useEffect(() => {
    if (!isHovered) return;

    const interval = window.setInterval(() => {
      setPulseActive(true);
      window.setTimeout(() => setPulseActive(false), 1000);
    }, 2200 + Math.random() * 1200);

    return () => window.clearInterval(interval);
  }, [isHovered]);

  // Random glitch effect
  useEffect(() => {
    if (isGlitching && nodeRef.current) {
      const tl = gsap.timeline();
      tl.to(nodeRef.current, {
        x: () => gsap.utils.random(-5, 5),
        y: () => gsap.utils.random(-3, 3),
        duration: 0.05,
        repeat: 4,
        yoyo: true,
      })
      .to(nodeRef.current, {
        x: 0,
        y: 0,
        duration: 0.1,
      });
    }
  }, [isGlitching]);

  // Kinetic aura intensity based on velocity
  const auraIntensity = Math.min(velocity * 0.5, 1);

  // Combine all transforms
  const kineticTransform = isHovered 
    ? 'scale(1.25) translateY(0) translateX(0) rotate(0deg)'
    : `scale(1) translateY(${sineY + noiseY}px) translateX(${noiseX}px) rotate(${rotationZ}deg)`;

  return (
    <div
      ref={nodeRef}
      role="button"
      tabIndex={0}
      aria-label={`Open product: ${product.name}`}
      className={`relative flex-shrink-0 cursor-pointer select-none ${isGlitching ? 'glitch-active' : ''}`}
      onClick={onBuy}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onBuy();
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: kineticTransform,
        zIndex: isHovered ? 100 : 1,
        transition: isHovered 
          ? 'transform 0.3s ease-out, z-index 0s' 
          : 'transform 0.15s ease-out, z-index 0s 0.3s',
        willChange: 'transform',
      }}
    >
      {/* Shockwave pulse */}
      <AnimatePresence>
        {pulseActive && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: -1 }}
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                border: '2px solid hsl(120 100% 50% / 0.6)',
                boxShadow: '0 0 20px hsl(120 100% 50% / 0.4)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Electric trail effect */}
      <div 
        ref={trailRef}
        className="absolute pointer-events-none"
        style={{
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: `${60 + velocity * 40}px`,
          height: '3px',
          background: `linear-gradient(90deg, transparent, hsl(120 100% 50% / ${0.3 + auraIntensity * 0.5}), hsl(120 100% 70% / ${0.6 + auraIntensity * 0.4}))`,
          boxShadow: `0 0 ${10 + velocity * 15}px hsl(120 100% 50% / ${0.4 + auraIntensity * 0.4})`,
          filter: 'blur(1px)',
          opacity: isHovered ? 0 : 1,
          transition: 'opacity 0.3s',
        }}
      />
      
      {/* Secondary electric arcs */}
      {velocity > 0.3 && (
        <>
          <div 
            className="absolute pointer-events-none"
            style={{
              right: '100%',
              top: '40%',
              width: `${30 + velocity * 20}px`,
              height: '1px',
              background: `linear-gradient(90deg, transparent, hsl(180 100% 50% / 0.5))`,
              transform: 'rotate(-15deg)',
              opacity: auraIntensity * 0.7,
            }}
          />
          <div 
            className="absolute pointer-events-none"
            style={{
              right: '100%',
              top: '60%',
              width: `${25 + velocity * 15}px`,
              height: '1px',
              background: `linear-gradient(90deg, transparent, hsl(180 100% 50% / 0.4))`,
              transform: 'rotate(20deg)',
              opacity: auraIntensity * 0.6,
            }}
          />
        </>
      )}

      {/* Kinetic Aura - outer energy shell */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle, hsl(120 100% 50% / ${0.1 + auraIntensity * 0.3}) 0%, transparent 70%)`,
          filter: `blur(${15 + auraIntensity * 10}px)`,
          transform: 'scale(1.8)',
          opacity: isHovered ? 1.5 : 1,
          transition: 'opacity 0.3s',
        }}
      />
      
      {/* Outer glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isHovered
            ? 'radial-gradient(circle, hsl(120 100% 50% / 0.5) 0%, transparent 70%)'
            : `radial-gradient(circle, hsl(120 100% 50% / ${0.15 + auraIntensity * 0.2}) 0%, transparent 70%)`,
          filter: 'blur(25px)',
          transform: 'scale(1.6)',
        }}
      />

      {/* Main hexagon container */}
      <div
        className="relative w-44 h-52 overflow-visible"
        style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          background: isGlitching 
            ? 'linear-gradient(180deg, hsl(120 100% 20% / 0.5) 0%, hsl(0 0% 0%) 100%)'
            : 'linear-gradient(180deg, hsl(180 15% 8%) 0%, hsl(0 0% 0%) 100%)',
          boxShadow: isHovered
            ? '0 0 40px hsl(120 100% 50% / 0.6), inset 0 0 30px hsl(120 100% 50% / 0.15)'
            : `0 0 ${15 + auraIntensity * 20}px hsl(120 100% 50% / ${0.25 + auraIntensity * 0.2})`,
        }}
      >
        {/* Neon border */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            border: isHovered ? '2px solid hsl(120 100% 50%)' : `1px solid hsl(120 100% ${35 + auraIntensity * 20}%)`,
            boxShadow: isHovered ? 'inset 0 0 20px hsl(120 100% 50% / 0.3)' : 'none',
          }}
        />

        {/* Scan effect line */}
        {isHovered && (
          <div
            ref={scanLineRef}
            className="absolute left-0 right-0 h-1 pointer-events-none z-20"
            style={{
              background: 'linear-gradient(90deg, transparent, hsl(120 100% 50%), transparent)',
              boxShadow: '0 0 20px hsl(120 100% 50%)',
            }}
          />
        )}

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: `
              linear-gradient(hsl(120 100% 50% / 0.2) 1px, transparent 1px),
              linear-gradient(90deg, hsl(120 100% 50% / 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '10px 10px',
          }}
        />

        {/* Product image */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-20 overflow-hidden border border-primary/40 rounded">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{
              filter: isHovered 
                ? 'none' 
                : isGlitching 
                  ? 'hue-rotate(90deg) saturate(2)' 
                  : 'grayscale(40%) brightness(0.75)',
              transition: 'filter 0.2s',
            }}
          />
          {isHovered && (
            <div className="absolute inset-0 bg-primary/15 mix-blend-overlay animate-pulse" />
          )}
        </div>

        {/* Product info */}
        <div className="absolute bottom-6 left-0 right-0 text-center px-3">
          <h3 className="font-mono text-[10px] text-primary truncate uppercase tracking-wider">
            {product.name}
          </h3>
          <p className="font-mono text-primary text-xs mt-1 neon-text font-bold">
            {product.price.toLocaleString()}đ
          </p>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-primary/60" />
        <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-primary/60" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-primary/60" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-primary/60" />
      </div>

      {/* Hover info - positioned OUTSIDE the clipped container */}
      <AnimatePresence>
        {isHovered && (
          <>
            {/* CO2 indicator - top left */}
            <motion.div
              className="absolute pointer-events-none"
              style={{ top: '-40px', left: '-20px', zIndex: 200 }}
              initial={{ opacity: 0, y: 10, x: -10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 10, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              <div 
                className="flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] whitespace-nowrap"
                style={{
                  background: 'hsl(0 0% 0% / 0.95)',
                  border: '1px solid hsl(120 100% 50% / 0.6)',
                  boxShadow: '0 0 15px hsl(120 100% 50% / 0.3)',
                }}
              >
                <Terminal className="w-3 h-3 text-primary" />
                <span className="text-primary">{product.co2Saved}kg CO₂</span>
              </div>
            </motion.div>

            {/* Rating indicator - top right */}
            <motion.div
              className="absolute pointer-events-none"
              style={{ top: '-40px', right: '-20px', zIndex: 200 }}
              initial={{ opacity: 0, y: 10, x: 10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 10, x: 10 }}
              transition={{ duration: 0.15, delay: 0.03 }}
            >
              <div 
                className="flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] whitespace-nowrap"
                style={{
                  background: 'hsl(0 0% 0% / 0.95)',
                  border: '1px solid hsl(45 100% 50% / 0.6)',
                  boxShadow: '0 0 15px hsl(45 100% 50% / 0.3)',
                }}
              >
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400">{product.rating}</span>
              </div>
            </motion.div>

            {/* ECO tokens indicator - right */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ right: '-85px', zIndex: 200 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15, delay: 0.05 }}
            >
              <div 
                className="flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] whitespace-nowrap"
                style={{
                  background: 'hsl(0 0% 0% / 0.95)',
                  border: '1px solid hsl(180 100% 50% / 0.6)',
                  boxShadow: '0 0 15px hsl(180 100% 50% / 0.3)',
                }}
              >
                <Zap className="w-3 h-3 text-secondary" />
                <span className="text-secondary">+{product.ecoTokens} ECO</span>
              </div>
            </motion.div>

            {/* Verified / Buyers indicator - left */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: '-85px', zIndex: 200 }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15, delay: 0.07 }}
            >
              <div 
                className="flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] whitespace-nowrap"
                style={{
                  background: 'hsl(0 0% 0% / 0.95)',
                  border: `1px solid ${product.verified ? 'hsl(280 100% 60% / 0.6)' : 'hsl(0 0% 50% / 0.4)'}`,
                  boxShadow: product.verified ? '0 0 15px hsl(280 100% 60% / 0.3)' : 'none',
                }}
              >
                <Shield className={`w-3 h-3 ${product.verified ? 'text-purple-400' : 'text-gray-500'}`} />
                <span className={product.verified ? 'text-purple-400' : 'text-gray-500'}>
                  {product.verified ? 'VERIFIED' : 'PENDING'}
                </span>
              </div>
            </motion.div>

            {/* Buyers count - bottom left */}
            <motion.div
              className="absolute pointer-events-none"
              style={{ bottom: '-40px', left: '-15px', zIndex: 200 }}
              initial={{ opacity: 0, y: -10, x: -10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -10, x: -10 }}
              transition={{ duration: 0.15, delay: 0.08 }}
            >
              <div 
                className="flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] whitespace-nowrap"
                style={{
                  background: 'hsl(0 0% 0% / 0.95)',
                  border: '1px solid hsl(200 100% 50% / 0.6)',
                  boxShadow: '0 0 15px hsl(200 100% 50% / 0.3)',
                }}
              >
                <Users className="w-3 h-3 text-sky-400" />
                <span className="text-sky-400">{product.buyers.toLocaleString()} bought</span>
              </div>
            </motion.div>

            {/* Execute button - bottom right */}
            <motion.div
              className="absolute"
              style={{ bottom: '-45px', right: '-15px', zIndex: 200 }}
              initial={{ opacity: 0, y: -10, x: 10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -10, x: 10 }}
              transition={{ duration: 0.15, delay: 0.1 }}
            >
              <CyberButton onClick={onBuy}>
                <ShoppingCart className="w-3 h-3 mr-1" />
                EXECUTE
              </CyberButton>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

interface DataStreamRowProps {
  products: typeof row1;
  direction: 'left' | 'right';
  rowIndex: number;
  onBuy: (id: number) => void;
  onProductPositionsUpdate: (positions: { x: number; y: number }[]) => void;
}

const DataStreamRow = ({ products, direction, rowIndex, onBuy, onProductPositionsUpdate }: DataStreamRowProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [glitchingIndex, setGlitchingIndex] = useState<number | null>(null);
  const [isRowPaused, setIsRowPaused] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const velocityRef = useRef(0);
  const lastVelocityUpdateRef = useRef(0);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const offsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const productPositionsRef = useRef<{ x: number; y: number }[]>([]);
  const [globalTime, setGlobalTime] = useState(0);

  // Duplicate products for seamless loop
  const allProducts = [...products, ...products, ...products];
  
  // Generate stable kinetic properties for each product (memoized)
  const kineticPropsRef = useRef<KineticProperties[]>([]);
  if (kineticPropsRef.current.length !== allProducts.length) {
    kineticPropsRef.current = allProducts.map((_, idx) => generateKineticProps(idx + rowIndex * 100));
  }
  
  // Global time animation loop for individual node physics
  useEffect(() => {
    let animationId: number;
    let startTime = performance.now();
    
    const updateTime = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      setGlobalTime(elapsed);
      animationId = requestAnimationFrame(updateTime);
    };
    
    animationId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Sync ref with state
  useEffect(() => {
    isPausedRef.current = isRowPaused;
  }, [isRowPaused]);

  // GSAP horizontal movement only - individual nodes handle their own Y/rotation
  useEffect(() => {
    if (!rowRef.current) return;

    const itemStep = DATA_PACKET_WIDTH_PX + DATA_PACKET_GAP_PX;
    const totalWidth = products.length * itemStep;
    const burstDistance = itemStep;
    
    // Initial position
    if (direction === 'left') {
      gsap.set(rowRef.current, { x: 0 });
    } else {
      gsap.set(rowRef.current, { x: -totalWidth });
    }

    const animate = () => {
      if (!rowRef.current) return;

      // Check if paused
      if (isPausedRef.current) {
        gsap.delayedCall(0.1, animate);
        return;
      }

      const tl = gsap.timeline({
        onStart: () => {
          velocityRef.current = 1;
          setVelocity(1);
        },
        onUpdate: () => {
          // Throttle React state updates to keep UI responsive
          const progress = tl.progress();
          const nextVelocity =
            progress < 0.3
              ? progress / 0.3
              : progress < 0.5
                ? 1 - (progress - 0.3) / 0.2
                : 0;

          const now = performance.now();
          const shouldUpdate =
            now - lastVelocityUpdateRef.current > 120 ||
            Math.abs(nextVelocity - velocityRef.current) > 0.2;

          if (shouldUpdate) {
            lastVelocityUpdateRef.current = now;
            velocityRef.current = nextVelocity;
            setVelocity(nextVelocity);
          }
        },
        onComplete: () => {
          velocityRef.current = 0;
          setVelocity(0);

          // Reset position for seamless loop
          if (direction === 'left') {
            offsetRef.current -= burstDistance;
            if (Math.abs(offsetRef.current) >= totalWidth) {
              offsetRef.current = 0;
              gsap.set(rowRef.current, { x: 0 });
            }
          } else {
            offsetRef.current += burstDistance;
            if (offsetRef.current >= 0) {
              offsetRef.current = -totalWidth;
              gsap.set(rowRef.current, { x: -totalWidth });
            }
          }
          animate();
        }
      });

      // Magnetic burst movement with elastic bounce
      tl.to(rowRef.current, {
        x: direction === 'left' 
          ? offsetRef.current - burstDistance 
          : offsetRef.current + burstDistance,
        duration: 0.8 + Math.random() * 0.3, // Slower movement
        ease: "elastic.out(1, 0.5)", // Elastic bounce at end
      });

      // Longer pause for users to see products
      tl.to({}, {
        duration: 2.5 + Math.random() * 1.5,
      });

      animationRef.current = tl;
    };

    // Start animation with staggered delay
    const startDelay = rowIndex * 0.8 + Math.random() * 0.5;
    gsap.delayedCall(startDelay, animate);

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      gsap.killTweensOf(rowRef.current);
    };
  }, [direction, products.length, rowIndex]);

  // Pause/resume animation when hovering
  const handleProductHover = useCallback((hovered: boolean) => {
    setIsRowPaused(hovered);
    if (animationRef.current) {
      if (hovered) {
        animationRef.current.pause();
        velocityRef.current = 0;
        setVelocity(0);
      } else {
        animationRef.current.resume();
      }
    }
  }, []);

  // Track product positions for grid interaction
  const handlePositionUpdate = useCallback((index: number, x: number, y: number) => {
    productPositionsRef.current[index] = { x, y };
    // Throttle updates
    if (index === 0) {
      onProductPositionsUpdate(productPositionsRef.current.filter(Boolean));
    }
  }, [onProductPositionsUpdate]);

  // Random glitch trigger
  useEffect(() => {
    const triggerGlitch = () => {
      const randomIndex = Math.floor(Math.random() * allProducts.length);
      setGlitchingIndex(randomIndex);
      
      setTimeout(() => {
        setGlitchingIndex(null);
      }, 150);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7 && !isPausedRef.current) {
        triggerGlitch();
      }
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [allProducts.length]);

  return (
    <div 
      ref={containerRef}
      className="relative overflow-visible"
      style={{ padding: '60px 0' }}
    >
      {/* Edge fade effects */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-40 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, hsl(0 0% 0%) 0%, transparent 100%)',
          zIndex: 50,
        }}
      />
      <div 
        className="absolute right-0 top-0 bottom-0 w-40 pointer-events-none"
        style={{
          background: 'linear-gradient(270deg, hsl(0 0% 0%) 0%, transparent 100%)',
          zIndex: 50,
        }}
      />

      {/* Data stream indicator line */}
      <div 
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{
          top: '50%',
          background: 'linear-gradient(90deg, transparent, hsl(120 100% 50% / 0.3), transparent)',
        }}
      />

      {/* Products row */}
      <div
        ref={rowRef}
        className="flex items-center"
        style={{ 
          gap: `${DATA_PACKET_GAP_PX}px`,
          width: 'fit-content',
          paddingLeft: `${DATA_PACKET_GAP_PX}px`,
          paddingRight: `${DATA_PACKET_GAP_PX}px`,
          transformOrigin: 'center center',
        }}
      >
        {allProducts.map((product, index) => (
          <DataPacket
            key={`${product.id}-${index}`}
            product={product}
            index={index}
            onBuy={() => onBuy(product.id)}
            onHover={handleProductHover}
            onPositionUpdate={handlePositionUpdate}
            isGlitching={glitchingIndex === index}
            velocity={velocity}
            kineticProps={kineticPropsRef.current[index]}
            globalTime={globalTime}
          />
        ))}
      </div>
    </div>
  );
};

export const MagneticDataStream = () => {
  const productPositionsRef = useRef<{ x: number; y: number }[]>([]);
  const [, forceUpdate] = useState(0);

  const handleBuy = useCallback((productId: number) => {
    console.log(`Executing purchase for product ${productId}`);
  }, []);

  // Use ref instead of state to prevent infinite re-renders
  const handlePositionsUpdate = useCallback((positions: { x: number; y: number }[]) => {
    productPositionsRef.current = positions;
  }, []);

  // Update grid positions periodically without causing infinite loop
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate(n => n + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="marketplace" className="relative py-16 overflow-hidden bg-black">
      {/* Conductive Grid Background */}
      <ConductiveGrid productPositions={productPositionsRef.current} />

      {/* Section header */}
      <motion.div
        className="text-center mb-6 px-4 relative z-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div 
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 font-mono text-xs uppercase"
          style={{
            background: 'hsl(0 0% 0% / 0.8)',
            border: '1px solid hsl(120 100% 50% / 0.4)',
          }}
        >
          <span 
            className="w-2 h-2 rounded-full"
            style={{
              background: 'hsl(120 100% 50%)',
              boxShadow: '0 0 10px hsl(120 100% 50%)',
              animation: 'pulse 1s ease-in-out infinite',
            }}
          />
          <span className="text-primary">MAGNETIC_FIELD::ACTIVE</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold font-mono uppercase tracking-tight mb-3">
          <span className="text-foreground">Kinetic</span>{" "}
          <span className="text-primary neon-text">Data Stream</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm">
          {">> "} 24 eco-products flowing through magnetic fields. Hover to intercept.
        </p>
      </motion.div>

      {/* Data stream rows */}
      <div className="relative z-10">
        <DataStreamRow 
          products={row1} 
          direction="left" 
          rowIndex={0}
          onBuy={handleBuy}
          onProductPositionsUpdate={handlePositionsUpdate}
        />
        <DataStreamRow 
          products={row2} 
          direction="right" 
          rowIndex={1}
          onBuy={handleBuy}
          onProductPositionsUpdate={handlePositionsUpdate}
        />
        <DataStreamRow 
          products={row3} 
          direction="left" 
          rowIndex={2}
          onBuy={handleBuy}
          onProductPositionsUpdate={handlePositionsUpdate}
        />
      </div>

      {/* Ambient glow */}
      <div 
        className="absolute top-1/3 left-0 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: 'hsl(120 100% 50% / 0.05)',
          filter: 'blur(100px)',
        }}
      />
      <div 
        className="absolute bottom-1/3 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'hsl(180 100% 50% / 0.05)',
          filter: 'blur(120px)',
        }}
      />

      {/* Custom keyframes */}
      <style>{`
        .glitch-active {
          animation: glitch-shake 0.15s ease-in-out;
        }
        
        @keyframes glitch-shake {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-3px, 2px); }
          40% { transform: translate(3px, -2px); }
          60% { transform: translate(-2px, 3px); }
          80% { transform: translate(2px, -3px); }
        }
      `}</style>
    </section>
  );
};