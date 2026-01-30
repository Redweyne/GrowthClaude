'use client';

// ==============================================================================
// WISDOM TEXT - Clean, Reliable Text Display for Lessons
// ==============================================================================
//
// This component displays text in a clean, readable way with optional animation.
// Inspired by the onboarding's phase-based approach which is smooth and reliable.
//
// Key principles:
// - Simple sentence-by-sentence reveal (not word-by-word which is buggy)
// - Clear callback when text is complete (for button timing)
// - Proper cleanup to prevent memory leaks or weird behavior
// - Clean typography optimized for mobile
// - STABLE: Does not re-animate on parent re-renders
//
// ==============================================================================

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WisdomTextProps {
  children: string;
  className?: string;
  variant?: 'narrative' | 'insight' | 'question' | 'instruction';
  animate?: boolean;
  speed?: 'slow' | 'normal' | 'fast'; // Control overall reveal speed
  onComplete?: () => void;
}

// Split text into natural sentences
function splitIntoSentences(text: string): string[] {
  // Split on sentence boundaries but keep the punctuation
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
  
  // If no sentence boundaries found, split by clauses or return as-is
  if (sentences.length === 1 && sentences[0].length > 100) {
    // Try splitting by semicolons, colons, or long dashes
    const clauses = text
      .split(/(?<=[;:—–])\s+/)
      .map(s => s.trim())
      .filter(Boolean);
    
    if (clauses.length > 1) {
      return clauses;
    }
  }
  
  return sentences.length > 0 ? sentences : [text];
}

// Variant styles - clean, readable typography
const variantStyles = {
  narrative: {
    base: 'text-stone-200',
    leading: 'leading-[1.8] sm:leading-relaxed',
    size: 'text-lg sm:text-xl',
    spacing: 'space-y-4 sm:space-y-3',
  },
  insight: {
    base: 'text-stone-100',
    leading: 'leading-[1.9] sm:leading-relaxed',
    size: 'text-xl sm:text-2xl',
    spacing: 'space-y-5 sm:space-y-4',
  },
  question: {
    base: 'text-amber-100',
    leading: 'leading-[1.8] sm:leading-relaxed',
    size: 'text-lg sm:text-xl',
    spacing: 'space-y-4 sm:space-y-3',
  },
  instruction: {
    base: 'text-stone-300',
    leading: 'leading-[1.7] sm:leading-normal',
    size: 'text-base sm:text-lg',
    spacing: 'space-y-3 sm:space-y-2',
  },
};

// Timing configurations based on speed
const speedConfigs = {
  slow: { initialDelay: 600, sentenceDelay: 1200 },
  normal: { initialDelay: 400, sentenceDelay: 800 },
  fast: { initialDelay: 200, sentenceDelay: 500 },
};

export function WisdomText({
  children,
  className = '',
  variant = 'narrative',
  animate = true,
  speed = 'normal',
  onComplete,
}: WisdomTextProps) {
  // Split text into sentences once - memoized on text content
  const sentences = useMemo(() => splitIntoSentences(children), [children]);
  
  // Track which sentences are visible (by count, not by index array)
  const [visibleCount, setVisibleCount] = useState(animate ? 0 : sentences.length);
  
  // Track if animation has completed - prevents re-triggering
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Use refs for stable values that don't trigger re-renders
  const mountedRef = useRef(true);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const onCompleteRef = useRef(onComplete);
  const textRef = useRef(children);
  
  // Keep onComplete ref updated without causing effect re-runs
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  
  const styles = variantStyles[variant];
  const timing = speedConfigs[speed];
  
  // Progressive reveal effect - ONLY runs when text content changes
  useEffect(() => {
    // If text hasn't changed and we've already animated, don't re-run
    if (textRef.current === children && hasAnimated) {
      return;
    }
    
    // Text changed - reset and re-animate
    textRef.current = children;
    mountedRef.current = true;
    
    // Clear any existing timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    
    // If not animating, show all immediately
    if (!animate) {
      setVisibleCount(sentences.length);
      setHasAnimated(true);
      // Call onComplete after a brief delay
      const completeTimer = setTimeout(() => {
        if (mountedRef.current && onCompleteRef.current) {
          onCompleteRef.current();
        }
      }, 100);
      timersRef.current.push(completeTimer);
      return;
    }
    
    // Start fresh
    setVisibleCount(0);
    setHasAnimated(false);
    
    // Schedule each sentence to appear
    sentences.forEach((_, index) => {
      const delay = timing.initialDelay + (index * timing.sentenceDelay);
      
      const timer = setTimeout(() => {
        if (!mountedRef.current) return;
        
        setVisibleCount(index + 1);
        
        // If this is the last sentence, call onComplete after animation settles
        if (index === sentences.length - 1) {
          setHasAnimated(true);
          const completeTimer = setTimeout(() => {
            if (mountedRef.current && onCompleteRef.current) {
              onCompleteRef.current();
            }
          }, 400); // Wait for animation to complete
          timersRef.current.push(completeTimer);
        }
      }, delay);
      
      timersRef.current.push(timer);
    });
    
    // Cleanup function
    return () => {
      mountedRef.current = false;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  // IMPORTANT: Only depend on children and animate to prevent re-runs on parent re-renders
  // Using sentences.length instead of sentences array to avoid reference issues
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, animate]);
  
  // For very short text (one short sentence), render simply
  if (sentences.length === 1 && sentences[0].length < 60) {
    return (
      <motion.p
        initial={animate && !hasAnimated ? { opacity: 0, y: 12 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: animate && !hasAnimated ? timing.initialDelay / 1000 : 0 }}
        className={`${styles.base} ${styles.size} ${styles.leading} ${className}`}
        onAnimationComplete={() => {
          if (!hasAnimated && onCompleteRef.current) {
            setHasAnimated(true);
            onCompleteRef.current();
          }
        }}
      >
        {sentences[0]}
      </motion.p>
    );
  }
  
  // Multiple sentences - reveal one at a time
  return (
    <div className={`${styles.spacing} ${className}`}>
      <AnimatePresence mode="sync">
        {sentences.slice(0, visibleCount).map((sentence, index) => (
          <motion.p
            key={`${textRef.current.slice(0, 20)}-sentence-${index}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={`${styles.base} ${styles.size} ${styles.leading}`}
          >
            {sentence}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Simple non-animated version for static display
export function WisdomTextStatic({
  children,
  className = '',
  variant = 'narrative',
}: Omit<WisdomTextProps, 'animate' | 'speed' | 'onComplete'>) {
  const sentences = useMemo(() => splitIntoSentences(children), [children]);
  const styles = variantStyles[variant];
  
  return (
    <div className={`${styles.spacing} ${className}`}>
      {sentences.map((sentence, index) => (
        <p
          key={index}
          className={`${styles.base} ${styles.size} ${styles.leading}`}
        >
          {sentence}
        </p>
      ))}
    </div>
  );
}

export default WisdomText;
