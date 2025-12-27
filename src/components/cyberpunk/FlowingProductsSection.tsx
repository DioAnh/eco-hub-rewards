import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, Zap, ShoppingCart } from "lucide-react";
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

// Split products into rows for multi-lane flow
const row1 = products.slice(0, 8);
const row2 = products.slice(8, 16);
const row3 = products.slice(16, 24);

interface ProductNodeProps {
  product: typeof products[0];
  onBuy: () => void;
}

const ProductNode = ({ product, onBuy }: ProductNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);
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
      className="relative flex-shrink-0 cursor-pointer select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.1, zIndex: 50 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Digital trail glow */}
      <div 
        className="absolute -right-8 top-1/2 -translate-y-1/2 w-16 h-1 pointer-events-none opacity-60"
        style={{
          background: "linear-gradient(90deg, hsl(120 100% 50% / 0.8), hsl(120 100% 50% / 0.3), transparent)",
          boxShadow: "0 0 10px hsl(120 100% 50% / 0.5)",
          filter: "blur(2px)",
        }}
      />
      
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: isHovered
            ? "radial-gradient(circle, hsl(120 100% 50% / 0.4) 0%, transparent 70%)"
            : "radial-gradient(circle, hsl(120 100% 50% / 0.1) 0%, transparent 70%)",
          filter: "blur(20px)",
          transform: "scale(1.5)",
        }}
      />

      {/* Main node container */}
      <div
        className="relative w-40 h-48 overflow-hidden transition-all duration-300"
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
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent pointer-events-none"
            style={{
              top: `${scanY}%`,
              boxShadow: "0 0 15px hsl(120 100% 50%)",
            }}
          />
        )}

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(hsl(120 100% 50% / 0.15) 1px, transparent 1px),
              linear-gradient(90deg, hsl(120 100% 50% / 0.15) 1px, transparent 1px)
            `,
            backgroundSize: "12px 12px",
          }}
        />

        {/* Product image */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-16 h-16 overflow-hidden rounded-sm border border-primary/30">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-300"
            style={{
              filter: isHovered ? "none" : "grayscale(30%) brightness(0.8)",
            }}
          />
          {isHovered && (
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay animate-pulse" />
          )}
        </div>

        {/* Product info */}
        <div className="absolute bottom-5 left-0 right-0 text-center px-2">
          <h3 className="font-mono text-[9px] text-primary truncate uppercase tracking-wider">
            {product.name}
          </h3>
          <p className="font-mono text-primary text-[11px] mt-0.5 neon-text">
            {product.price.toLocaleString()}đ
          </p>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-1.5 left-1.5 w-2 h-2 border-l border-t border-primary/50" />
        <div className="absolute top-1.5 right-1.5 w-2 h-2 border-r border-t border-primary/50" />
        <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-l border-b border-primary/50" />
        <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-r border-b border-primary/50" />
      </div>

      {/* Hover indicators */}
      {isHovered && (
        <>
          <motion.div
            className="absolute -top-8 left-1/2 -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-1 px-2 py-1 bg-black/95 border border-primary/50 font-mono text-[9px] text-primary whitespace-nowrap">
              <Terminal className="w-2.5 h-2.5" />
              <span>{product.co2Saved}kg CO₂</span>
            </div>
          </motion.div>

          <motion.div
            className="absolute -right-16 top-1/2 -translate-y-1/2 z-20"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="flex items-center gap-1 px-2 py-1 bg-black/95 border border-secondary/50 font-mono text-[9px] text-secondary whitespace-nowrap">
              <Zap className="w-2.5 h-2.5" />
              <span>+{product.ecoTokens} ECO</span>
            </div>
          </motion.div>

          <motion.div
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-30"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CyberButton onClick={onBuy}>
              <ShoppingCart className="w-3 h-3 mr-1" />
              EXECUTE
            </CyberButton>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

interface FlowingRowProps {
  products: typeof row1;
  speed: number;
  direction: 'left' | 'right';
  onBuy: (id: number) => void;
}

const FlowingRow = ({ products, speed, direction, onBuy }: FlowingRowProps) => {
  const duplicatedProducts = [...products, ...products, ...products];
  
  return (
    <div className="relative overflow-hidden py-8">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex gap-8 items-center"
        animate={{
          x: direction === 'left' ? [0, -100 * products.length * 2] : [-100 * products.length * 2, 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
        style={{ width: 'fit-content' }}
      >
        {duplicatedProducts.map((product, index) => (
          <ProductNode
            key={`${product.id}-${index}`}
            product={product}
            onBuy={() => onBuy(product.id)}
          />
        ))}
      </motion.div>
    </div>
  );
};

export const FlowingProductsSection = () => {
  const handleBuy = (productId: number) => {
    console.log(`Executing purchase for product ${productId}`);
  };

  return (
    <section id="marketplace" className="relative py-20 overflow-hidden bg-black">
      {/* Section header */}
      <motion.div
        className="text-center mb-8 px-4 relative z-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1 border border-primary/30 bg-black/80 mb-4 font-mono text-xs uppercase">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-primary">DATA_STREAM::ACTIVE</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold font-mono uppercase tracking-tight mb-4">
          <span className="text-foreground">Product</span>{" "}
          <span className="text-primary neon-text">Data Flow</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm">
          {">> "} 24 eco-products streaming through the void. Hover to intercept.
        </p>
      </motion.div>

      {/* Background grid effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, hsl(120 100% 50% / 0.15) 0%, transparent 60%),
            linear-gradient(hsl(120 100% 50% / 0.08) 1px, transparent 1px),
            linear-gradient(90deg, hsl(120 100% 50% / 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        }}
      />

      {/* Flowing product rows - 3 lanes with different speeds and directions */}
      <div className="relative z-10 space-y-4">
        <FlowingRow products={row1} speed={60} direction="left" onBuy={handleBuy} />
        <FlowingRow products={row2} speed={45} direction="right" onBuy={handleBuy} />
        <FlowingRow products={row3} speed={55} direction="left" onBuy={handleBuy} />
      </div>

      {/* Ambient glow effects */}
      <div className="absolute top-1/3 left-0 w-64 h-64 bg-primary/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-secondary/5 rounded-full filter blur-[120px] pointer-events-none" />
    </section>
  );
};
