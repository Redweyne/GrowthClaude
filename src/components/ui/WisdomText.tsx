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
  variant?: 'narrative' | 'insight' | 'question' | 'instruction' | 'dramatic';
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
    base: 'text-stone-200 light:text-stone-800',
    leading: 'leading-[1.8] sm:leading-relaxed',
    size: 'text-lg sm:text-xl',
    spacing: 'space-y-4 sm:space-y-3',
  },
  insight: {
    base: 'text-stone-100 light:text-stone-900',
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
    base: 'text-stone-300 light:text-stone-700',
    leading: 'leading-[1.7] sm:leading-normal',
    size: 'text-base sm:text-lg',
    spacing: 'space-y-3 sm:space-y-2',
  },
  dramatic: {
    base: 'text-stone-100 light:text-stone-900 font-serif',
    leading: 'leading-[1.5]',
    size: 'text-2xl sm:text-3xl',
    spacing: 'space-y-5',
  },
};

// Timing configurations based on speed
const speedConfigs = {
  slow: {
    initialDelay: 900,
    sentenceGap: 200,
    baseReadTime: 320,
    charTime: 18,
    wordTime: 55,
    punctuationPause: 160,
    minSentenceTime: 800,
    maxSentenceTime: 3000,
    finalPause: 500,
  },
  normal: {
    initialDelay: 400,
    sentenceGap: 150,
    baseReadTime: 250,
    charTime: 15,
    wordTime: 45,
    punctuationPause: 120,
    minSentenceTime: 600,
    maxSentenceTime: 2400,
    finalPause: 400,
  },
  fast: {
    initialDelay: 300,
    sentenceGap: 100,
    baseReadTime: 200,
    charTime: 12,
    wordTime: 35,
    punctuationPause: 100,
    minSentenceTime: 500,
    maxSentenceTime: 2000,
    finalPause: 300,
  },
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getSentenceReadTime(sentence: string, timing: typeof speedConfigs.slow): number {
  const wordCount = sentence.trim().split(/\s+/).filter(Boolean).length;
  const charCount = sentence.length;
  const punctuationCount = (sentence.match(/[.!?]/g) || []).length + (sentence.match(/[,;:—–]/g) || []).length;

  const rawTime =
    timing.baseReadTime +
    (charCount * timing.charTime) +
    (wordCount * timing.wordTime) +
    (punctuationCount * timing.punctuationPause);

  return clamp(rawTime, timing.minSentenceTime, timing.maxSentenceTime);
}

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
  const signatureRef = useRef(`${children}::${speed}::${animate}`);
  
  // Keep onComplete ref updated without causing effect re-runs
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  
  const styles = variantStyles[variant];
  const timing = speedConfigs[speed];
  
  // Progressive reveal effect - ONLY runs when text content changes
  useEffect(() => {
    const signature = `${children}::${speed}::${animate}`;
    if (signatureRef.current === signature && hasAnimated) {
      return;
    }

    signatureRef.current = signature;
    textRef.current = children;
    mountedRef.current = true;

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (!animate) {
      setVisibleCount(sentences.length);
      setHasAnimated(true);
      const completeTimer = setTimeout(() => {
        if (mountedRef.current && onCompleteRef.current) {
          onCompleteRef.current();
        }
      }, 100);
      timersRef.current.push(completeTimer);
      return () => {
        mountedRef.current = false;
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
      };
    }

    setVisibleCount(0);
    setHasAnimated(false);

    let accumulatedDelay = timing.initialDelay;

    sentences.forEach((sentence, index) => {
      const revealAt = accumulatedDelay;
      const readTime = getSentenceReadTime(sentence, timing);

      const timer = setTimeout(() => {
        if (!mountedRef.current) return;
        setVisibleCount(index + 1);
      }, revealAt);

      timersRef.current.push(timer);
      accumulatedDelay += readTime + timing.sentenceGap;
    });

    const completeTimer = setTimeout(() => {
      if (!mountedRef.current) return;
      setHasAnimated(true);
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, accumulatedDelay + timing.finalPause);

    timersRef.current.push(completeTimer);

    return () => {
      mountedRef.current = false;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [children, animate, speed, sentences, timing, hasAnimated]);
  
  // For very short text (one short sentence), render simply
  // Reveal sentences with consistent timing
  return (
    <div className={`${styles.spacing} ${className}`}>
      <AnimatePresence mode="sync">
        {sentences.slice(0, visibleCount).map((sentence, index) => (
          <motion.p
            key={`${textRef.current.slice(0, 20)}-sentence-${index}`}
            initial={{ opacity: 0, y: 16, filter: 'blur(2px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
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
