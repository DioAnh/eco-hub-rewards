import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal, Zap, Shield, Star, Users, ShoppingCart, Leaf } from "lucide-react";
import { CyberButton } from "./CyberButton";

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
}

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onBuy: (id: number) => void;
}

export const ProductDetailModal = ({
  product,
  isOpen,
  onClose,
  onBuy,
}: ProductDetailModalProps) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-2xl bg-background border border-primary/40 overflow-hidden"
              style={{
                clipPath:
                  "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
                boxShadow: "0 0 60px hsl(120 70% 50% / 0.2), inset 0 0 30px hsl(120 70% 50% / 0.05)",
              }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-primary/60" />
              <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-primary/60" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-primary/60" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-primary/60" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center border border-primary/50 bg-background/80 text-primary hover:bg-primary/10 hover:border-primary transition-all"
                style={{
                  clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                }}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
                {/* Product image */}
                <div className="flex-shrink-0">
                  <div
                    className="relative w-full md:w-64 h-64 overflow-hidden rounded-lg"
                    style={{
                      boxShadow: "0 8px 32px hsl(0 0% 0% / 0.5), 0 0 20px hsl(120 70% 50% / 0.15)",
                      border: "1px solid hsl(120 50% 40% / 0.4)",
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Verified badge */}
                    {product.verified && (
                      <div
                        className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono uppercase"
                        style={{
                          background: "hsl(280 80% 50% / 0.9)",
                          border: "1px solid hsl(280 80% 70%)",
                          boxShadow: "0 0 10px hsl(280 80% 50% / 0.5)",
                        }}
                      >
                        <Shield className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product info */}
                <div className="flex-1 flex flex-col">
                  <h2
                    className="text-2xl md:text-3xl font-bold mb-2"
                    style={{
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      color: "hsl(0 0% 95%)",
                    }}
                  >
                    {product.name}
                  </h2>

                  {/* Price */}
                  <p
                    className="text-3xl font-bold mb-4"
                    style={{ color: "hsl(120 80% 65%)" }}
                  >
                    ${(product.price / 25000).toFixed(2)}
                  </p>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div
                      className="flex items-center gap-2 px-3 py-2 border border-primary/30 bg-primary/5"
                      style={{
                        clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                      }}
                    >
                      <Terminal className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-xs text-muted-foreground">CO₂ Saved</div>
                        <div className="text-sm font-bold text-primary">{product.co2Saved}kg</div>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-2 px-3 py-2 border border-secondary/30 bg-secondary/5"
                      style={{
                        clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                      }}
                    >
                      <Zap className="w-4 h-4 text-secondary" />
                      <div>
                        <div className="text-xs text-muted-foreground">ECO Tokens</div>
                        <div className="text-sm font-bold text-secondary">+{product.ecoTokens}</div>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-2 px-3 py-2 border border-yellow-500/30 bg-yellow-500/5"
                      style={{
                        clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                      }}
                    >
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                        <div className="text-sm font-bold text-yellow-400">{product.rating}/5</div>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-2 px-3 py-2 border border-sky-500/30 bg-sky-500/5"
                      style={{
                        clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                      }}
                    >
                      <Users className="w-4 h-4 text-sky-400" />
                      <div>
                        <div className="text-xs text-muted-foreground">Buyers</div>
                        <div className="text-sm font-bold text-sky-400">{product.buyers.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-6 flex-1">
                    Certified green product that helps reduce environmental impact. 
                    Purchase this product to earn <span className="text-secondary font-bold">+{product.ecoTokens} ECO Token</span> and 
                    save <span className="text-primary font-bold">{product.co2Saved}kg CO₂</span>.
                  </p>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <CyberButton
                      variant="primary"
                      onClick={() => {
                        onBuy(product.id);
                        onClose();
                      }}
                      className="flex-1"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      BUY NOW
                    </CyberButton>
                    <CyberButton variant="secondary" onClick={onClose}>
                      <Leaf className="w-4 h-4 mr-2" />
                      VIEW MORE
                    </CyberButton>
                  </div>
                </div>
              </div>

              {/* Scan line effect */}
              <motion.div
                className="absolute left-0 right-0 h-px pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent, hsl(120 80% 60%), transparent)",
                  boxShadow: "0 0 10px hsl(120 80% 60%)",
                }}
                initial={{ top: 0 }}
                animate={{ top: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
