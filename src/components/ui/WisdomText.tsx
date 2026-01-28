'use client';

// ═══════════════════════════════════════════════════════════════════════════
// WISDOM TEXT - BREATHABLE TYPOGRAPHY FOR MOBILE
// ═══════════════════════════════════════════════════════════════════════════
//
// This component transforms dense blocks of text into beautiful, readable
// "stanzas" that breathe on mobile screens. Like poetry for wisdom.
//
// Features:
// - Automatic sentence/phrase splitting for visual breathing room
// - Progressive reveal animation (optional)
// - Mobile-optimized line heights and spacing
// - Haptic feedback on key phrases (optional)
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WisdomTextProps {
  children: string;
  className?: string;
  variant?: 'narrative' | 'insight' | 'question' | 'instruction';
  animate?: boolean;
  staggerDelay?: number;
  maxWordsPerStanza?: number;
  onComplete?: () => void;
}

// Split text into natural reading chunks (stanzas)
function splitIntoStanzas(text: string, maxWords: number = 20): string[] {
  // First, try to split by sentence endings
  const sentences = text.split(/(?<=[.!?])\s+/);

  const stanzas: string[] = [];
  let currentStanza = '';
  let currentWordCount = 0;

  for (const sentence of sentences) {
    const sentenceWords = sentence.trim().split(/\s+/).length;

    // If adding this sentence would exceed limit and we have content,
    // push current stanza and start new one
    if (currentWordCount + sentenceWords > maxWords && currentStanza) {
      stanzas.push(currentStanza.trim());
      currentStanza = sentence;
      currentWordCount = sentenceWords;
    } else {
      // Add to current stanza
      currentStanza = currentStanza ? `${currentStanza} ${sentence}` : sentence;
      currentWordCount += sentenceWords;
    }
  }

  // Push any remaining content
  if (currentStanza.trim()) {
    stanzas.push(currentStanza.trim());
  }

  // If we only got one stanza and it's long, try splitting by commas/semicolons
  if (stanzas.length === 1 && stanzas[0].split(/\s+/).length > maxWords) {
    const parts = stanzas[0].split(/(?<=[,;—–])\s+/);
    if (parts.length > 1) {
      return parts.map(p => p.trim()).filter(Boolean);
    }
  }

  return stanzas;
}

// Variant styles
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

export function WisdomText({
  children,
  className = '',
  variant = 'narrative',
  animate = true,
  staggerDelay = 0.15,
  maxWordsPerStanza = 18,
  onComplete,
}: WisdomTextProps) {
  const [visibleStanzas, setVisibleStanzas] = useState(animate ? 0 : Infinity);

  const stanzas = useMemo(
    () => splitIntoStanzas(children, maxWordsPerStanza),
    [children, maxWordsPerStanza]
  );

  const styles = variantStyles[variant];

  // Progressive reveal effect
  useEffect(() => {
    if (!animate) {
      setVisibleStanzas(stanzas.length);
      return;
    }

    setVisibleStanzas(0);

    const timers: NodeJS.Timeout[] = [];

    stanzas.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleStanzas(index + 1);

        // Call onComplete when all stanzas are visible
        if (index === stanzas.length - 1 && onComplete) {
          setTimeout(onComplete, 200);
        }
      }, (index + 1) * staggerDelay * 1000);

      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [children, animate, stanzas.length, staggerDelay, onComplete]);

  // If just one short sentence, render simply
  if (stanzas.length === 1 && stanzas[0].split(/\s+/).length <= 10) {
    return (
      <motion.p
        initial={animate ? { opacity: 0, y: 8 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`${styles.base} ${styles.size} ${styles.leading} ${className}`}
      >
        {stanzas[0]}
      </motion.p>
    );
  }

  return (
    <div className={`${styles.spacing} ${className}`}>
      <AnimatePresence mode="popLayout">
        {stanzas.slice(0, visibleStanzas).map((stanza, index) => (
          <motion.p
            key={`${index}-${stanza.slice(0, 20)}`}
            initial={animate ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={`${styles.base} ${styles.size} ${styles.leading}`}
          >
            {stanza}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Simple non-animated version for performance-critical areas
export function WisdomTextStatic({
  children,
  className = '',
  variant = 'narrative',
  maxWordsPerStanza = 18,
}: Omit<WisdomTextProps, 'animate' | 'staggerDelay' | 'onComplete'>) {
  const stanzas = useMemo(
    () => splitIntoStanzas(children, maxWordsPerStanza),
    [children, maxWordsPerStanza]
  );

  const styles = variantStyles[variant];

  return (
    <div className={`${styles.spacing} ${className}`}>
      {stanzas.map((stanza, index) => (
        <p
          key={index}
          className={`${styles.base} ${styles.size} ${styles.leading}`}
        >
          {stanza}
        </p>
      ))}
    </div>
  );
}

export default WisdomText;
