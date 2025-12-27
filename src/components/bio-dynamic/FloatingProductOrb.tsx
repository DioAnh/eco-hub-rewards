import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Leaf, ShoppingCart } from "lucide-react";
import { MagneticButton } from "./MagneticButton";

interface FloatingProductOrbProps {
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

export const FloatingProductOrb = ({ product, index, onBuy }: FloatingProductOrbProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Physics-based floating
  const floatY = useMotionValue(0);
  const floatX = useMotionValue(0);
  const springY = useSpring(floatY, { stiffness: 50, damping: 10 });
  const springX = useSpring(floatX, { stiffness: 50, damping: 10 });
  
  // Scale animation
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: 300, damping: 20 });
  
  // Glow intensity
  const glowIntensity = useTransform(springScale, [1, 1.15], [0, 1]);

  useEffect(() => {
    // Gentle floating animation
    const interval = setInterval(() => {
      const time = Date.now() / 1000;
      const offsetY = Math.sin(time + index * 0.5) * 15;
      const offsetX = Math.cos(time * 0.7 + index * 0.3) * 8;
      floatY.set(offsetY);
      floatX.set(offsetX);
    }, 16);

    return () => clearInterval(interval);
  }, [index, floatY, floatX]);

  useEffect(() => {
    if (isHovered) {
      scale.set(1.15);
      // 360 rotation on hover
      const interval = setInterval(() => {
        setRotation((prev) => prev + 2);
      }, 16);
      return () => clearInterval(interval);
    } else {
      scale.set(1);
      setRotation(0);
    }
  }, [isHovered, scale]);

  // Satellite CO2 indicators
  const satellites = [
    { angle: 0, label: `${product.co2Saved}kg CO₂` },
    { angle: 120, label: `+${product.ecoTokens} ECO` },
    { angle: 240, label: "Verified" },
  ];

  return (
    <motion.div
      ref={containerRef}
      className="relative cursor-pointer"
      style={{
        y: springY,
        x: springX,
        scale: springScale,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)",
          opacity: glowIntensity,
          scale: 1.5,
        }}
      />

      {/* Main orb container */}
      <div
        className="relative w-64 h-64 rounded-full overflow-hidden"
        style={{
          background: "radial-gradient(circle at 30% 30%, hsl(var(--card)) 0%, hsl(var(--card) / 0.8) 100%)",
          boxShadow: isHovered
            ? "0 0 60px hsl(var(--primary) / 0.5), inset 0 0 60px hsl(var(--primary) / 0.1)"
            : "0 20px 60px hsl(var(--background) / 0.5), inset 0 0 30px hsl(var(--primary) / 0.05)",
          border: "2px solid hsl(var(--primary) / 0.2)",
        }}
      >
        {/* Inner glass effect */}
        <div className="absolute inset-2 rounded-full overflow-hidden backdrop-blur-sm">
          {/* Product image with rotation */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              rotateY: rotation,
              transformStyle: "preserve-3d",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-36 h-36 object-cover rounded-2xl shadow-lg"
              style={{
                transform: `rotateY(${rotation}deg)`,
              }}
            />
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

          {/* Product info */}
          <div className="absolute bottom-4 left-0 right-0 text-center px-4">
            <h3 className="font-bold text-foreground text-sm truncate">{product.name}</h3>
            <p className="text-primary font-bold mt-1">
              {product.price.toLocaleString()}đ
            </p>
          </div>
        </div>
      </div>

      {/* Satellite indicators (visible on hover) */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {satellites.map((sat, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              style={{
                left: "50%",
                top: "50%",
                transform: `rotate(${sat.angle + rotation * 0.5}deg) translateX(150px) rotate(-${sat.angle + rotation * 0.5}deg) translate(-50%, -50%)`,
              }}
            >
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30">
                <Leaf className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium text-primary whitespace-nowrap">
                  {sat.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Buy button (appears on hover) */}
      {isHovered && (
        <motion.div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MagneticButton onClick={onBuy}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Mua ngay
          </MagneticButton>
        </motion.div>
      )}
    </motion.div>
  );
};
