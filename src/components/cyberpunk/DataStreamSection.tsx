import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Zap, ShoppingCart } from "lucide-react";
import gsap from "gsap";
import { CyberButton } from "./CyberButton";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const products = [
  { id: 1, name: "Organic Canvas Bag", price: 189000, ecoTokens: 45, co2Saved: 2.3, image: product1 },
  { id: 2, name: "Bamboo Straw Set", price: 89000, ecoTokens: 25, co2Saved: 0.8, image: product2 },
  { id: 3, name: "Steel Water Bottle", price: 299000, ecoTokens: 60, co2Saved: 4.2, image: product3 },
  { id: 4, name: "Wheat Lunch Box", price: 159000, ecoTokens: 35, co2Saved: 1.5, image: product1 },
  { id: 5, name: "Bamboo Toothbrush", price: 45000, ecoTokens: 15, co2Saved: 0.5, image: product2 },
  { id: 6, name: "Organic Cotton Towel", price: 249000, ecoTokens: 50, co2Saved: 3.1, image: product3 },
  { id: 7, name: "Hemp Backpack", price: 459000, ecoTokens: 85, co2Saved: 5.2, image: product1 },
  { id: 8, name: "Cork Wallet", price: 199000, ecoTokens: 40, co2Saved: 1.8, image: product2 },
  { id: 9, name: "Recycled Notebook", price: 79000, ecoTokens: 20, co2Saved: 0.6, image: product3 },
  { id: 10, name: "Solar Power Bank", price: 589000, ecoTokens: 100, co2Saved: 8.5, image: product1 },
  { id: 11, name: "Beeswax Food Wrap", price: 129000, ecoTokens: 30, co2Saved: 1.2, image: product2 },
  { id: 12, name: "Coconut Bowl Set", price: 169000, ecoTokens: 38, co2Saved: 1.4, image: product3 },
  { id: 13, name: "Bamboo Cutlery Kit", price: 99000, ecoTokens: 22, co2Saved: 0.9, image: product1 },
  { id: 14, name: "Reusable Coffee Cup", price: 189000, ecoTokens: 42, co2Saved: 2.1, image: product2 },
  { id: 15, name: "Natural Fiber Mat", price: 349000, ecoTokens: 65, co2Saved: 3.8, image: product3 },
  { id: 16, name: "Organic Soap Bar", price: 59000, ecoTokens: 12, co2Saved: 0.4, image: product1 },
  { id: 17, name: "Recycled Glass Vase", price: 279000, ecoTokens: 55, co2Saved: 2.9, image: product2 },
  { id: 18, name: "Bamboo Phone Case", price: 149000, ecoTokens: 32, co2Saved: 1.1, image: product3 },
  { id: 19, name: "Hemp Rope Basket", price: 219000, ecoTokens: 48, co2Saved: 2.4, image: product1 },
  { id: 20, name: "Sustainable Candle", price: 139000, ecoTokens: 28, co2Saved: 1.0, image: product2 },
  { id: 21, name: "Eco Yoga Block", price: 179000, ecoTokens: 36, co2Saved: 1.6, image: product3 },
  { id: 22, name: "Recycled Tote Bag", price: 119000, ecoTokens: 26, co2Saved: 0.7, image: product1 },
  { id: 23, name: "Organic Tea Set", price: 389000, ecoTokens: 72, co2Saved: 4.5, image: product2 },
  { id: 24, name: "Bamboo Desk Organizer", price: 259000, ecoTokens: 52, co2Saved: 2.7, image: product3 },
];

// Split into rows
const row1 = products.slice(0, 8);
const row2 = products.slice(8, 16);
const row3 = products.slice(16, 24);

interface DataPacketProps {
  product: typeof products[0];
  index: number;
  onBuy: () => void;
  isGlitching: boolean;
  isMaterializing: boolean;
  isDematerializing: boolean;
}

const DataPacket = ({ 
  product, 
  index, 
  onBuy, 
  isGlitching, 
  isMaterializing, 
  isDematerializing 
}: DataPacketProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={nodeRef}
      className={`relative flex-shrink-0 cursor-pointer select-none ${isGlitching ? 'glitch-active' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
        zIndex: isHovered ? 100 : 1,
        transition: 'transform 0.2s ease-out',
      }}
    >
      {/* Materialize effect - scan line */}
      {isMaterializing && (
        <div 
          className="absolute inset-0 pointer-events-none z-50"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, hsl(120 100% 50%) 50%, transparent 100%)',
            height: '4px',
            animation: 'materialize-scan 0.4s ease-out forwards',
          }}
        />
      )}

      {/* Dematerialize effect - particle dissolution */}
      {isDematerializing && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `dissolve-particle 0.5s ease-out ${i * 0.02}s forwards`,
              }}
            />
          ))}
        </div>
      )}

      {/* Glitch chromatic aberration layers */}
      {isGlitching && (
        <>
          <div 
            className="absolute inset-0 pointer-events-none z-40"
            style={{
              background: 'hsl(0 100% 50% / 0.3)',
              transform: 'translateX(-2px)',
              mixBlendMode: 'multiply',
              clipPath: 'polygon(0 30%, 100% 30%, 100% 35%, 0 35%)',
            }}
          />
          <div 
            className="absolute inset-0 pointer-events-none z-40"
            style={{
              background: 'hsl(180 100% 50% / 0.3)',
              transform: 'translateX(2px)',
              mixBlendMode: 'multiply',
              clipPath: 'polygon(0 60%, 100% 60%, 100% 65%, 0 65%)',
            }}
          />
        </>
      )}

      {/* Digital trail */}
      <div 
        className="absolute -right-12 top-1/2 -translate-y-1/2 h-0.5 pointer-events-none"
        style={{
          width: '48px',
          background: 'linear-gradient(90deg, hsl(120 100% 50% / 0.8), hsl(120 100% 50% / 0.2), transparent)',
          boxShadow: '0 0 8px hsl(120 100% 50% / 0.6)',
          opacity: isHovered ? 0 : 0.7,
        }}
      />
      
      {/* Outer glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isHovered
            ? 'radial-gradient(circle, hsl(120 100% 50% / 0.5) 0%, transparent 70%)'
            : 'radial-gradient(circle, hsl(120 100% 50% / 0.15) 0%, transparent 70%)',
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
            : '0 0 15px hsl(120 100% 50% / 0.25)',
        }}
      >
        {/* Neon border */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            border: isHovered ? '2px solid hsl(120 100% 50%)' : '1px solid hsl(120 100% 35%)',
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
            {/* CO2 indicator - top */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
              style={{ top: '-45px', zIndex: 200 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
            >
              <div 
                className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs whitespace-nowrap"
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
                className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs whitespace-nowrap"
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

            {/* Execute button - bottom */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2"
              style={{ bottom: '-50px', zIndex: 200 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15, delay: 0.1 }}
            >
              <CyberButton onClick={onBuy}>
                <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
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
  baseSpeed: number;
  onBuy: (id: number) => void;
}

const DataStreamRow = ({ products, direction, baseSpeed, onBuy }: DataStreamRowProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [glitchingIndex, setGlitchingIndex] = useState<number | null>(null);
  const [materializingIndices, setMaterializingIndices] = useState<Set<number>>(new Set());
  const [dematerializingIndices, setDematerializingIndices] = useState<Set<number>>(new Set());
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const offsetRef = useRef(0);

  // Duplicate products for seamless loop
  const allProducts = [...products, ...products, ...products];

  // GSAP burst movement animation
  useEffect(() => {
    if (!rowRef.current) return;

    const itemWidth = 200; // approx width + gap
    const totalWidth = products.length * itemWidth;
    const burstDistance = itemWidth; // Move one item at a time
    
    // Initial position
    if (direction === 'left') {
      gsap.set(rowRef.current, { x: 0 });
    } else {
      gsap.set(rowRef.current, { x: -totalWidth });
    }

    const animate = () => {
      if (!rowRef.current) return;

      const tl = gsap.timeline({
        onComplete: () => {
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

      // Burst movement
      tl.to(rowRef.current, {
        x: direction === 'left' 
          ? offsetRef.current - burstDistance 
          : offsetRef.current + burstDistance,
        duration: 0.25 + Math.random() * 0.15,
        ease: "power2.inOut",
      });

      // Pause
      tl.to({}, {
        duration: 0.4 + Math.random() * 0.3,
      });

      animationRef.current = tl;
    };

    // Start animation with initial delay based on row
    const startDelay = Math.random() * 0.5;
    gsap.delayedCall(startDelay, animate);

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      gsap.killTweensOf(rowRef.current);
    };
  }, [direction, products.length]);

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
      if (Math.random() > 0.7) {
        triggerGlitch();
      }
    }, 2000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [allProducts.length]);

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ padding: '60px 0' }} // Extra padding for hover elements
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

      {/* Data stream indicator lines */}
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
          gap: '32px',
          width: 'fit-content',
          paddingLeft: '40px',
          paddingRight: '40px',
        }}
      >
        {allProducts.map((product, index) => (
          <DataPacket
            key={`${product.id}-${index}`}
            product={product}
            index={index}
            onBuy={() => onBuy(product.id)}
            isGlitching={glitchingIndex === index}
            isMaterializing={materializingIndices.has(index)}
            isDematerializing={dematerializingIndices.has(index)}
          />
        ))}
      </div>
    </div>
  );
};

export const DataStreamSection = () => {
  const handleBuy = (productId: number) => {
    console.log(`Executing purchase for product ${productId}`);
  };

  return (
    <section id="marketplace" className="relative py-16 overflow-hidden bg-black">
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
          <span className="text-primary">DATA_STREAM::ACTIVE</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold font-mono uppercase tracking-tight mb-3">
          <span className="text-foreground">Product</span>{" "}
          <span className="text-primary neon-text">Data Stream</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm">
          {">> "} 24 eco-products transmitting through the void. Hover to intercept data packet.
        </p>
      </motion.div>

      {/* Background effects */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, hsl(120 100% 50% / 0.2) 0%, transparent 50%),
            linear-gradient(hsl(120 100% 50% / 0.1) 1px, transparent 1px),
            linear-gradient(90deg, hsl(120 100% 50% / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 50px 50px, 50px 50px',
        }}
      />

      {/* Data stream rows */}
      <div className="relative z-10">
        <DataStreamRow 
          products={row1} 
          direction="left" 
          baseSpeed={1.5}
          onBuy={handleBuy} 
        />
        <DataStreamRow 
          products={row2} 
          direction="right" 
          baseSpeed={1.2}
          onBuy={handleBuy} 
        />
        <DataStreamRow 
          products={row3} 
          direction="left" 
          baseSpeed={1.8}
          onBuy={handleBuy} 
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
        @keyframes materialize-scan {
          0% { top: 0%; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        
        @keyframes dissolve-particle {
          0% { 
            opacity: 1; 
            transform: translate(0, 0) scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(0); 
          }
        }
        
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