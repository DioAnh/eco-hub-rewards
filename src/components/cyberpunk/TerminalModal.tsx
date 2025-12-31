import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal, ShoppingCart, Coins, Leaf, TrendingUp, Shield, Star } from "lucide-react";
import { CyberButton } from "./CyberButton";
import { TypingText } from "./TypingText";

interface Product {
  id: number;
  name: string;
  price: number;
  ecoTokens: number;
  co2Saved: number;
  rating: number;
  buyers: number;
  verified: boolean;
  image: string;
  description?: string;
  materials?: string[];
}

interface TerminalModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onBuyWithVND: (product: Product) => void;
  onBuyWithECO: (product: Product) => void;
}

export const TerminalModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onBuyWithVND, 
  onBuyWithECO 
}: TerminalModalProps) => {
  const [bootSequence, setBootSequence] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && product) {
      setBootSequence(0);
      setShowContent(false);
      
      // Boot sequence animation
      const timers = [
        setTimeout(() => setBootSequence(1), 100),
        setTimeout(() => setBootSequence(2), 300),
        setTimeout(() => setBootSequence(3), 500),
        setTimeout(() => setBootSequence(4), 700),
        setTimeout(() => setShowContent(true), 900),
      ];
      
      return () => timers.forEach(clearTimeout);
    }
  }, [isOpen, product]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!product) return null;

  const bootLines = [
    '> INITIALIZING PRODUCT_SCANNER...',
    '> LOADING ECO_METRICS...',
    '> CONNECTING TO SUI_NETWORK...',
    '> SYSTEM READY.',
  ];

  const materials = product.materials || ['Organic Cotton', 'Recycled Polyester', 'Natural Dyes'];
  const description = product.description || `High-quality eco-friendly product designed to minimize environmental impact. This ${product.name.toLowerCase()} is crafted with sustainable materials and ethical manufacturing practices.`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 10000 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal */}
          <motion.div
            ref={modalRef}
            className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, hsl(180 10% 5%) 0%, hsl(0 0% 0%) 100%)',
              border: '1px solid hsl(120 100% 50% / 0.5)',
              boxShadow: '0 0 50px hsl(120 100% 50% / 0.2), inset 0 0 30px hsl(120 100% 50% / 0.05)',
            }}
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25 }}
          >
            {/* Terminal header */}
            <div 
              className="flex items-center justify-between px-4 py-2 border-b"
              style={{ borderColor: 'hsl(120 100% 50% / 0.3)' }}
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs text-primary">
                  PRODUCT_DIAGNOSTICS.exe
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <button
                  onClick={onClose}
                  className="ml-4 p-1 hover:bg-primary/20 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>
            
            {/* Terminal content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-50px)]">
              {/* Boot sequence */}
              <div className="mb-6 font-mono text-xs space-y-1">
                {bootLines.slice(0, bootSequence).map((line, i) => (
                  <motion.div
                    key={i}
                    className="text-primary/70"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
              
              {/* Main content */}
              <AnimatePresence>
                {showContent && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Left: Product image & basic info */}
                      <div>
                        {/* Product image */}
                        <div 
                          className="relative aspect-square mb-4 overflow-hidden"
                          style={{
                            clipPath: 'polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)',
                            border: '1px solid hsl(120 100% 50% / 0.4)',
                          }}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: 'linear-gradient(180deg, transparent 60%, hsl(0 0% 0% / 0.8) 100%)',
                            }}
                          />
                          
                          {/* Scan effect */}
                          <motion.div
                            className="absolute left-0 right-0 h-1"
                            style={{
                              background: 'linear-gradient(90deg, transparent, hsl(120 100% 50%), transparent)',
                              boxShadow: '0 0 20px hsl(120 100% 50%)',
                            }}
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          />
                          
                          {/* Verified badge */}
                          {product.verified && (
                            <div 
                              className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 font-mono text-[10px]"
                              style={{
                                background: 'hsl(0 0% 0% / 0.9)',
                                border: '1px solid hsl(280 100% 60% / 0.6)',
                              }}
                            >
                              <Shield className="w-3 h-3 text-purple-400" />
                              <span className="text-purple-400">VERIFIED</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Product name */}
                        <h2 className="font-mono text-xl text-primary uppercase tracking-wider mb-2 neon-text">
                          {product.name}
                        </h2>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-mono text-sm text-yellow-400">{product.rating}</span>
                          </div>
                          <span className="text-muted-foreground text-sm font-mono">
                            {product.buyers.toLocaleString()} buyers
                          </span>
                        </div>
                        
                        {/* Description */}
                        <div className="mb-4">
                          <div className="font-mono text-xs text-primary/60 mb-1">{"// DESCRIPTION"}</div>
                          <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                            <TypingText text={description} speed={10} />
                          </p>
                        </div>
                      </div>
                      
                      {/* Right: Technical specs & actions */}
                      <div className="space-y-4">
                        {/* Price section */}
                        <div 
                          className="p-4"
                          style={{
                            background: 'hsl(120 100% 50% / 0.05)',
                            border: '1px solid hsl(120 100% 50% / 0.3)',
                          }}
                        >
                          <div className="font-mono text-xs text-primary/60 mb-2">{"// PRICING_DATA"}</div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="font-mono text-xs text-muted-foreground">USD PRICE</div>
                              <div className="font-mono text-2xl text-primary neon-text">
                                ${(product.price / 25000).toFixed(2)}
                              </div>
                            </div>
                            <div>
                              <div className="font-mono text-xs text-muted-foreground">ECO PRICE</div>
                              <div className="font-mono text-2xl text-secondary">
                                {(product.ecoTokens * 10).toLocaleString()} ECO
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Eco metrics */}
                        <div 
                          className="p-4"
                          style={{
                            background: 'hsl(180 100% 50% / 0.05)',
                            border: '1px solid hsl(180 100% 50% / 0.3)',
                          }}
                        >
                          <div className="font-mono text-xs text-secondary/60 mb-3">{"// ECO_IMPACT_ANALYSIS"}</div>
                          
                          <div className="space-y-3">
                            {/* CO2 Saved */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Leaf className="w-4 h-4 text-primary" />
                                <span className="font-mono text-xs text-muted-foreground">CO₂ REDUCTION</span>
                              </div>
                              <span className="font-mono text-sm text-primary">{product.co2Saved}kg</span>
                            </div>
                            
                            {/* ECO Reward */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Coins className="w-4 h-4 text-secondary" />
                                <span className="font-mono text-xs text-muted-foreground">ECO REWARD</span>
                              </div>
                              <span className="font-mono text-sm text-secondary">+{product.ecoTokens} ECO</span>
                            </div>
                            
                            {/* Eco Score bar */}
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="font-mono text-xs text-muted-foreground">ECO_SCORE</span>
                                <span className="font-mono text-xs text-primary">{Math.min(100, product.ecoTokens + 40)}%</span>
                              </div>
                              <div className="h-2 bg-black/50 rounded overflow-hidden">
                                <motion.div
                                  className="h-full"
                                  style={{ background: 'linear-gradient(90deg, hsl(120 100% 50%), hsl(180 100% 50%))' }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, product.ecoTokens + 40)}%` }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Materials */}
                        <div 
                          className="p-4"
                          style={{
                            background: 'hsl(45 100% 50% / 0.05)',
                            border: '1px solid hsl(45 100% 50% / 0.3)',
                          }}
                        >
                          <div className="font-mono text-xs text-yellow-400/60 mb-2">{"// MATERIALS_COMPOSITION"}</div>
                          <div className="flex flex-wrap gap-2">
                            {materials.map((material, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 font-mono text-[10px] text-yellow-400"
                                style={{
                                  background: 'hsl(45 100% 50% / 0.1)',
                                  border: '1px solid hsl(45 100% 50% / 0.3)',
                                }}
                              >
                                {material}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-4">
                          <CyberButton 
                            onClick={() => onBuyWithVND(product)}
                            className="w-full justify-center"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            BUY WITH USD
                          </CyberButton>
                          
                          <CyberButton 
                            onClick={() => onBuyWithECO(product)}
                            className="w-full justify-center"
                            style={{
                              background: 'hsl(180 100% 50% / 0.1)',
                              borderColor: 'hsl(180 100% 50% / 0.5)',
                            }}
                          >
                            <Coins className="w-4 h-4 mr-2" />
                            BUY WITH ECO
                          </CyberButton>
                        </div>
                        
                        {/* Transaction info */}
                        <div className="font-mono text-[10px] text-muted-foreground text-center">
                          {">> "} Transaction will be signed via Sui Wallet
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary" />
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};