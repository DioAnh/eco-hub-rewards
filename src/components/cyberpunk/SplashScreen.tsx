import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

const bootSequence = [
  { text: "> INITIALIZING ECOSHOP_PROTOCOL...", delay: 0 },
  { text: "> LOADING SUSTAINABLE_COMMERCE_ENGINE...", delay: 400 },
  { text: "> CONNECTING TO SUI_BLOCKCHAIN...", delay: 800 },
  { text: "> VERIFYING SMART_CONTRACTS...", delay: 1200 },
  { text: "> ECO_TOKEN MODULE LOADED ✓", delay: 1600 },
  { text: "> MARKETPLACE MODULE LOADED ✓", delay: 1900 },
  { text: "> STAKING_VAULT MODULE LOADED ✓", delay: 2200 },
  { text: "> SYSTEM READY.", delay: 2500 },
];

const TypingLine = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, 25);

    return () => clearInterval(interval);
  }, [text, onComplete]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className="font-mono text-xs md:text-sm">
      {displayText}
      <span className={`${cursorVisible ? "opacity-100" : "opacity-0"} transition-opacity`}>▊</span>
    </span>
  );
};

export const SplashScreen = ({ onComplete, duration = 5000 }: SplashScreenProps) => {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [showMainTitle, setShowMainTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show boot sequence lines
    bootSequence.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, index]);
      }, line.delay);
    });

    // Show main title after boot sequence
    setTimeout(() => setShowMainTitle(true), 2800);
    
    // Show subtitle
    setTimeout(() => setShowSubtitle(true), 3400);

    // Start fade out
    setTimeout(() => setFadeOut(true), duration - 500);

    // Complete
    setTimeout(() => onComplete(), duration);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Matrix rain background */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-primary font-mono text-xs"
                style={{ left: `${i * 5}%` }}
                initial={{ y: -100 }}
                animate={{ y: "100vh" }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear",
                }}
              >
                {Array.from({ length: 20 }).map((_, j) => (
                  <div key={j} className="opacity-50">
                    {String.fromCharCode(0x30A0 + Math.random() * 96)}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>

          {/* Scan lines */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(120 100% 50% / 0.03) 2px, hsl(120 100% 50% / 0.03) 4px)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 w-full max-w-3xl px-8">
            {/* Terminal window */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div
                className="border border-primary/50 bg-black/90 overflow-hidden"
                style={{
                  clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                }}
              >
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-4 py-2 border-b border-primary/30 bg-primary/5">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="font-mono text-xs text-primary/60 ml-2">terminal@ecoshop:~</span>
                </div>

                {/* Terminal content */}
                <div className="p-4 min-h-[200px] space-y-1">
                  {bootSequence.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={visibleLines.includes(index) ? { opacity: 1, x: 0 } : {}}
                      className={`${
                        line.text.includes("✓") 
                          ? "text-primary" 
                          : line.text.includes("READY") 
                            ? "text-secondary" 
                            : "text-primary/70"
                      }`}
                    >
                      {visibleLines.includes(index) && <TypingLine text={line.text} />}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Title */}
            <AnimatePresence>
              {showMainTitle && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  {/* Logo */}
                  <motion.div
                    className="flex items-center justify-center gap-4 mb-4"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                  >
                    <div
                      className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center"
                      style={{
                        background: "hsl(120 100% 50% / 0.1)",
                        border: "2px solid hsl(120 100% 50%)",
                        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                        boxShadow: "0 0 40px hsl(120 100% 50% / 0.4), inset 0 0 20px hsl(120 100% 50% / 0.1)",
                      }}
                    >
                      <Terminal className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                    </div>
                  </motion.div>

                  {/* ECOSHOP title */}
                  <motion.h1
                    className="text-5xl md:text-7xl lg:text-8xl font-bold font-mono uppercase tracking-wider mb-4"
                    style={{
                      color: "hsl(120 100% 50%)",
                      textShadow: "0 0 20px hsl(120 100% 50% / 0.8), 0 0 40px hsl(120 100% 50% / 0.4), 0 0 60px hsl(120 100% 50% / 0.2)",
                    }}
                    initial={{ letterSpacing: "0.5em", opacity: 0 }}
                    animate={{ letterSpacing: "0.1em", opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    ECOSHOP
                  </motion.h1>

                  {/* Subtitle with typing effect */}
                  <AnimatePresence>
                    {showSubtitle && (
                      <motion.div
                        className="h-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <p
                          className="text-lg md:text-xl font-mono uppercase tracking-widest"
                          style={{ color: "hsl(180 100% 50%)" }}
                        >
                          <TypingLine text="THE FUTURE OF GREEN COMMERCE" />
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Decorative line */}
                  <motion.div
                    className="mt-8 mx-auto h-px"
                    style={{
                      background: "linear-gradient(90deg, transparent, hsl(120 100% 50%), transparent)",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  />

                  {/* Loading indicator */}
                  <motion.div
                    className="mt-6 flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-primary rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-xs text-muted-foreground ml-2">
                      ENTERING PROTOCOL...
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-primary/50" />
          <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-primary/50" />
          <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-primary/50" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-primary/50" />

          {/* Version tag */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs text-primary/40">
            v2.0.0 :: SUI_NETWORK
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
