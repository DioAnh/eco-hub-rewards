import { useState, useEffect, useCallback } from "react";

interface TypingTextProps {
  text: string;
  speed?: number;
  delay?: number;
  showCursor?: boolean;
}

interface CyclingTypingTextProps {
  messages: string[];
  speed?: number;
  pauseDuration?: number;
  showCursor?: boolean;
}

export const TypingText = ({
  text,
  speed = 50,
  delay = 0,
  showCursor = true,
}: TypingTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);

    const startTimeout = setTimeout(() => {
      let currentIndex = 0;

      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay]);

  return (
    <span>
      {displayedText}
      {showCursor && (
        <span className={isComplete ? "cursor-blink" : ""}>▊</span>
      )}
    </span>
  );
};

export const CyclingTypingText = ({
  messages,
  speed = 30,
  pauseDuration = 15000,
  showCursor = true,
}: CyclingTypingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  const currentMessage = messages[currentIndex];

  // Typing effect
  useEffect(() => {
    if (!isTyping) return;

    if (charIndex < currentMessage.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentMessage.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      // Finished typing, wait then move to next
      const pauseTimeout = setTimeout(() => {
        setIsTyping(false);
        setCharIndex(0);
        setDisplayedText("");
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        // Small delay before starting next message
        setTimeout(() => setIsTyping(true), 300);
      }, pauseDuration);
      return () => clearTimeout(pauseTimeout);
    }
  }, [charIndex, currentMessage, isTyping, messages.length, pauseDuration, speed]);

  // Reset when messages change
  useEffect(() => {
    setCurrentIndex(0);
    setCharIndex(0);
    setDisplayedText("");
    setIsTyping(true);
  }, [messages]);

  const isComplete = charIndex >= currentMessage.length;

  return (
    <span>
      {displayedText}
      {showCursor && (
        <span className={isComplete ? "cursor-blink" : ""}>▊</span>
      )}
    </span>
  );
};
