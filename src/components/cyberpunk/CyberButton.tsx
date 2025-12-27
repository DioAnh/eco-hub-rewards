import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface CyberButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "danger";
}

export const CyberButton = ({
  children,
  onClick,
  className,
  variant = "primary",
}: CyberButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 25 });
  const springY = useSpring(y, { stiffness: 400, damping: 25 });

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
      
      const magnetRadius = 80;
      
      if (distance < magnetRadius) {
        const strength = (magnetRadius - distance) / magnetRadius;
        x.set(distX * strength * 0.3);
        y.set(distY * strength * 0.3);
        setIsHovered(true);
      } else {
        x.set(0);
        y.set(0);
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  // Random glitch effect
  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          setGlitchActive(true);
          setTimeout(() => setGlitchActive(false), 100);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const variantStyles = {
    primary: {
      border: "hsl(120 100% 50%)",
      bg: "hsl(120 100% 50% / 0.1)",
      text: "hsl(120 100% 50%)",
      shadow: "0 0 20px hsl(120 100% 50% / 0.5)",
    },
    secondary: {
      border: "hsl(180 100% 50%)",
      bg: "hsl(180 100% 50% / 0.1)",
      text: "hsl(180 100% 50%)",
      shadow: "0 0 20px hsl(180 100% 50% / 0.5)",
    },
    danger: {
      border: "hsl(0 100% 50%)",
      bg: "hsl(0 100% 50% / 0.1)",
      text: "hsl(0 100% 50%)",
      shadow: "0 0 20px hsl(0 100% 50% / 0.5)",
    },
  };

  const style = variantStyles[variant];

  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      className={cn(
        "relative px-6 py-3 font-mono text-sm uppercase tracking-wider",
        "flex items-center justify-center",
        "transition-all duration-200",
        glitchActive && "glitch-text",
        className
      )}
      style={{
        x: springX,
        y: springY,
        color: style.text,
        background: isHovered ? style.bg : "transparent",
        border: `1px solid ${style.border}`,
        boxShadow: isHovered ? style.shadow : "none",
        clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
      }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Corner cuts */}
      <div 
        className="absolute top-0 left-0 w-3 h-3"
        style={{
          borderLeft: `1px solid ${style.border}`,
          borderTop: `1px solid ${style.border}`,
        }}
      />
      <div 
        className="absolute bottom-0 right-0 w-3 h-3"
        style={{
          borderRight: `1px solid ${style.border}`,
          borderBottom: `1px solid ${style.border}`,
        }}
      />
      
      {/* Glitch duplicates */}
      {glitchActive && (
        <>
          <span 
            className="absolute inset-0 flex items-center justify-center"
            style={{ 
              color: "hsl(180 100% 50%)", 
              transform: "translate(-2px, -1px)",
              clipPath: "inset(30% 0 40% 0)",
            }}
          >
            {children}
          </span>
          <span 
            className="absolute inset-0 flex items-center justify-center"
            style={{ 
              color: "hsl(280 100% 60%)", 
              transform: "translate(2px, 1px)",
              clipPath: "inset(60% 0 10% 0)",
            }}
          >
            {children}
          </span>
        </>
      )}
      
      <span className="relative z-10 flex items-center">{children}</span>
    </motion.button>
  );
};
