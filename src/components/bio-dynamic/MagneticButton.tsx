import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "eco";
}

export const MagneticButton = ({
  children,
  onClick,
  className,
  variant = "primary",
}: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });
  
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: 400, damping: 15 });

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);
      
      const magnetRadius = 100;
      
      if (distance < magnetRadius) {
        const strength = (magnetRadius - distance) / magnetRadius;
        x.set(distX * strength * 0.4);
        y.set(distY * strength * 0.4);
        scale.set(1 + strength * 0.1);
        setIsHovered(true);
      } else {
        x.set(0);
        y.set(0);
        scale.set(1);
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
      scale.set(1);
      setIsHovered(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [x, y, scale]);

  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    eco: "bg-gradient-to-r from-primary to-emerald-400 text-primary-foreground",
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      className={cn(
        "relative px-6 py-3 rounded-full font-medium flex items-center justify-center",
        "transition-shadow duration-300",
        variantStyles[variant],
        isHovered && "shadow-[0_0_30px_hsl(var(--primary)/0.5)]",
        className
      )}
      style={{
        x: springX,
        y: springY,
        scale: springScale,
      }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Morphing border effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: isHovered
            ? "linear-gradient(45deg, hsl(var(--primary)), hsl(142 76% 36%), hsl(var(--primary)))"
            : "transparent",
          backgroundSize: "200% 200%",
          padding: "2px",
          borderRadius: "9999px",
          opacity: isHovered ? 1 : 0,
        }}
        animate={
          isHovered
            ? {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Button content */}
      <span className="relative z-10 flex items-center">{children}</span>
      
      {/* Ripple effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-full bg-white/20"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};
