import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { FlowingDataNode } from "./FlowingDataNode";
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

interface NodeState {
  id: number;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  trail: { x: number; y: number }[];
}

export const FlowingProductsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<NodeState[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number>();
  const isPausedRef = useRef(false);

  // Initialize nodes with random positions and velocities
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
      
      // Initialize nodes
      const initialNodes: NodeState[] = products.map((product, index) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.5; // Different velocities
        return {
          id: product.id,
          position: {
            x: Math.random() * rect.width,
            y: Math.random() * rect.height,
          },
          velocity: {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed,
          },
          trail: [],
        };
      });
      setNodes(initialNodes);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Physics animation loop
  useEffect(() => {
    if (nodes.length === 0 || containerSize.width === 0) return;

    const nodeWidth = 176; // w-44
    const nodeHeight = 208; // h-52
    const padding = 50;
    const maxTrailLength = 20;

    const animate = () => {
      if (isPausedRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      setNodes(prevNodes => {
        return prevNodes.map(node => {
          let newX = node.position.x + node.velocity.x;
          let newY = node.position.y + node.velocity.y;
          let newVelX = node.velocity.x;
          let newVelY = node.velocity.y;

          // Wrap around screen edges for continuous flow
          if (newX < -nodeWidth / 2) {
            newX = containerSize.width + nodeWidth / 2;
            // Reset trail when wrapping
            return {
              ...node,
              position: { x: newX, y: newY },
              velocity: { x: newVelX, y: newVelY },
              trail: [],
            };
          }
          if (newX > containerSize.width + nodeWidth / 2) {
            newX = -nodeWidth / 2;
            return {
              ...node,
              position: { x: newX, y: newY },
              velocity: { x: newVelX, y: newVelY },
              trail: [],
            };
          }
          if (newY < -nodeHeight / 2) {
            newY = containerSize.height + nodeHeight / 2;
            return {
              ...node,
              position: { x: newX, y: newY },
              velocity: { x: newVelX, y: newVelY },
              trail: [],
            };
          }
          if (newY > containerSize.height + nodeHeight / 2) {
            newY = -nodeHeight / 2;
            return {
              ...node,
              position: { x: newX, y: newY },
              velocity: { x: newVelX, y: newVelY },
              trail: [],
            };
          }

          // Add slight random variation to velocity for organic movement
          newVelX += (Math.random() - 0.5) * 0.02;
          newVelY += (Math.random() - 0.5) * 0.02;

          // Clamp velocity
          const speed = Math.sqrt(newVelX * newVelX + newVelY * newVelY);
          const maxSpeed = 2;
          const minSpeed = 0.3;
          if (speed > maxSpeed) {
            newVelX = (newVelX / speed) * maxSpeed;
            newVelY = (newVelY / speed) * maxSpeed;
          } else if (speed < minSpeed) {
            newVelX = (newVelX / speed) * minSpeed;
            newVelY = (newVelY / speed) * minSpeed;
          }

          // Update trail
          const newTrail = [
            { x: node.position.x, y: node.position.y },
            ...node.trail.slice(0, maxTrailLength - 1),
          ];

          return {
            ...node,
            position: { x: newX, y: newY },
            velocity: { x: newVelX, y: newVelY },
            trail: newTrail,
          };
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes.length, containerSize]);

  const handlePositionUpdate = useCallback((id: number, pos: { x: number; y: number }, vel: { x: number; y: number }) => {
    // Position updates are handled in the animation loop
  }, []);

  const handleBuy = (productId: number) => {
    console.log(`Executing purchase for product ${productId}`);
  };

  return (
    <section id="marketplace" className="relative min-h-screen py-20 overflow-hidden">
      {/* Section header */}
      <motion.div
        className="text-center mb-12 px-4 relative z-20"
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
          {">> "} Nodes flowing through the digital void. Hover to intercept. Execute to acquire.
        </p>
      </motion.div>

      {/* Flowing nodes container */}
      <div
        ref={containerRef}
        className="relative h-[900px] max-w-full mx-auto"
        onMouseEnter={() => { isPausedRef.current = false; }}
      >
        {/* Background grid effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, hsl(120 100% 50% / 0.1) 0%, transparent 50%),
              linear-gradient(hsl(120 100% 50% / 0.05) 1px, transparent 1px),
              linear-gradient(90deg, hsl(120 100% 50% / 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 50px 50px, 50px 50px',
          }}
        />

        {nodes.map((node, index) => {
          const product = products.find(p => p.id === node.id);
          if (!product) return null;
          
          return (
            <FlowingDataNode
              key={node.id}
              product={product}
              position={node.position}
              velocity={node.velocity}
              trailPositions={node.trail}
              onPositionUpdate={handlePositionUpdate}
              onBuy={() => handleBuy(product.id)}
            />
          );
        })}

        {/* Ambient glow effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full filter blur-[120px] pointer-events-none" />
      </div>
    </section>
  );
};
