import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FloatingProductOrb } from "./FloatingProductOrb";
import { useBloomAnimation } from "./BloomAnimation";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const products = [
  {
    id: 1,
    name: "Túi Vải Organic Canvas",
    price: 189000,
    ecoTokens: 45,
    co2Saved: 2.3,
    image: product1,
  },
  {
    id: 2,
    name: "Bộ Ống Hút Tre Tự Nhiên",
    price: 89000,
    ecoTokens: 25,
    co2Saved: 0.8,
    image: product2,
  },
  {
    id: 3,
    name: "Bình Nước Inox 500ml",
    price: 299000,
    ecoTokens: 60,
    co2Saved: 4.2,
    image: product3,
  },
  {
    id: 4,
    name: "Hộp Cơm Lúa Mạch",
    price: 159000,
    ecoTokens: 35,
    co2Saved: 1.5,
    image: product1,
  },
  {
    id: 5,
    name: "Bàn Chải Tre Organic",
    price: 45000,
    ecoTokens: 15,
    co2Saved: 0.5,
    image: product2,
  },
  {
    id: 6,
    name: "Khăn Tắm Cotton Hữu Cơ",
    price: 249000,
    ecoTokens: 50,
    co2Saved: 3.1,
    image: product3,
  },
];

export const FloatingBiomesSection = () => {
  const [orbPositions, setOrbPositions] = useState<{ x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isAnimating, position, triggerBloom, onComplete, BloomComponent } = useBloomAnimation();

  useEffect(() => {
    const calculatePositions = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      
      // Create organic scattered positions
      const positions = products.map((_, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        
        // Base grid position with organic offset
        const baseX = (col + 0.5) * (width / 3);
        const baseY = (row + 0.5) * (height / 2) + 100;
        
        // Add randomness for organic feel
        const offsetX = (Math.random() - 0.5) * 80;
        const offsetY = (Math.random() - 0.5) * 60;
        
        return {
          x: baseX + offsetX,
          y: baseY + offsetY,
        };
      });
      
      setOrbPositions(positions);
    };

    calculatePositions();
    window.addEventListener("resize", calculatePositions);
    return () => window.removeEventListener("resize", calculatePositions);
  }, []);

  const handleBuy = (productId: number, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    triggerBloom(rect.left + rect.width / 2, rect.top + rect.height / 2);
    
    // Here you would trigger the actual Sui transaction
    console.log(`Buying product ${productId}`);
  };

  return (
    <section id="marketplace" className="relative min-h-screen py-20">
      {/* Section header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Floating <span className="text-primary">Biomes</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Khám phá các sản phẩm bền vững trong không gian 3D. Di chuột để tương tác.
        </p>
      </motion.div>

      {/* Floating orbs container */}
      <div
        ref={containerRef}
        className="relative min-h-[800px] max-w-6xl mx-auto px-4"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className="absolute"
            style={{
              left: orbPositions[index]?.x ?? 0,
              top: orbPositions[index]?.y ?? 0,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.15,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
          >
            <FloatingProductOrb
              product={product}
              index={index}
              onBuy={() => handleBuy(product.id, event as unknown as React.MouseEvent)}
            />
          </motion.div>
        ))}
      </div>

      {/* Bloom animation overlay */}
      <BloomComponent />
    </section>
  );
};
