import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DataNode } from "./DataNode";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const products = [
  {
    id: 1,
    name: "Organic Canvas Bag",
    price: 189000,
    ecoTokens: 45,
    co2Saved: 2.3,
    image: product1,
  },
  {
    id: 2,
    name: "Bamboo Straw Set",
    price: 89000,
    ecoTokens: 25,
    co2Saved: 0.8,
    image: product2,
  },
  {
    id: 3,
    name: "Steel Water Bottle",
    price: 299000,
    ecoTokens: 60,
    co2Saved: 4.2,
    image: product3,
  },
  {
    id: 4,
    name: "Wheat Lunch Box",
    price: 159000,
    ecoTokens: 35,
    co2Saved: 1.5,
    image: product1,
  },
  {
    id: 5,
    name: "Bamboo Toothbrush",
    price: 45000,
    ecoTokens: 15,
    co2Saved: 0.5,
    image: product2,
  },
  {
    id: 6,
    name: "Organic Cotton Towel",
    price: 249000,
    ecoTokens: 50,
    co2Saved: 3.1,
    image: product3,
  },
];

export const DataNodesSection = () => {
  const [nodePositions, setNodePositions] = useState<{ x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculatePositions = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const width = container.offsetWidth;
      
      // Create grid positions with some randomness
      const positions = products.map((_, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        
        const baseX = (col + 0.5) * (width / 3);
        const baseY = (row + 0.5) * 350 + 150;
        
        // Add some randomness
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 30;
        
        return {
          x: baseX + offsetX,
          y: baseY + offsetY,
        };
      });
      
      setNodePositions(positions);
    };

    calculatePositions();
    window.addEventListener("resize", calculatePositions);
    return () => window.removeEventListener("resize", calculatePositions);
  }, []);

  const handleBuy = (productId: number) => {
    console.log(`Executing purchase for product ${productId}`);
    // Trigger transaction
  };

  return (
    <section id="marketplace" className="relative min-h-screen py-20">
      {/* Section header */}
      <motion.div
        className="text-center mb-16 px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1 border border-primary/30 bg-black/50 mb-4 font-mono text-xs uppercase">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-primary">DATA_NODES::ACTIVE</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold font-mono uppercase tracking-tight mb-4">
          <span className="text-foreground">Product</span>{" "}
          <span className="text-primary neon-text">Nodes</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm">
          {">> "} Hover to scan. Execute to acquire. Earn ECO tokens.
        </p>
      </motion.div>

      {/* Data nodes container */}
      <div
        ref={containerRef}
        className="relative min-h-[800px] max-w-6xl mx-auto px-4"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className="absolute"
            style={{
              left: nodePositions[index]?.x ?? 0,
              top: nodePositions[index]?.y ?? 0,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.1,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
          >
            <DataNode
              product={product}
              index={index}
              onBuy={() => handleBuy(product.id)}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
