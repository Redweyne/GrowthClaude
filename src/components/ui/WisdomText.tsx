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
// - Word-by-word reveal mode for slower, contemplative reading
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
  staggerDelay?: number; // Time between chunks (default 1.2s for slow contemplative pace)
  maxWordsPerStanza?: number; // Maximum words per chunk (default 6 for very small chunks)
  initialDelay?: number; // Delay before first chunk appears (default 0.5s)
  wordByWord?: boolean; // Enable word-by-word reveal mode (even slower)
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

    // If a single sentence is longer than maxWords, try splitting by clauses
    if (sentenceWords > maxWords) {
      const clauses = sentence.split(/(?<=[,;:—–])\s+/);
      if (clauses.length > 1) {
        for (const clause of clauses) {
          const clauseWords = clause.trim().split(/\s+/).length;
          if (currentWordCount + clauseWords > maxWords && currentStanza) {
            stanzas.push(currentStanza.trim());
            currentStanza = clause;
            currentWordCount = clauseWords;
          } else {
            currentStanza = currentStanza ? `${currentStanza} ${clause}` : clause;
            currentWordCount += clauseWords;
          }
        }
        continue;
      }
    }

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

// Split text into individual words for word-by-word mode
function splitIntoWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
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
  staggerDelay = 0.9, // Balanced pace between chunks
  maxWordsPerStanza = 12, // Keep sentences intact while still chunking
  initialDelay = 0.6, // Brief pause before first chunk
  wordByWord = false, // Word-by-word mode for maximum slowness
  onComplete,
}: WisdomTextProps) {
  const [visibleCount, setVisibleCount] = useState(animate ? 0 : Infinity);

  // For word-by-word mode, split into individual words
  // Otherwise, split into stanzas
  const chunks = useMemo(() => {
    if (wordByWord) {
      return splitIntoWords(children);
    }
    return splitIntoStanzas(children, maxWordsPerStanza);
  }, [children, maxWordsPerStanza, wordByWord]);

  const styles = variantStyles[variant];

  // Progressive reveal effect with initial delay for contemplative reading
  useEffect(() => {
    if (!animate) {
      setVisibleCount(chunks.length);
      return;
    }

    setVisibleCount(0);

    const timers: NodeJS.Timeout[] = [];

    // For word-by-word mode, use faster interval between words but still slow overall
    const actualStagger = wordByWord ? 0.25 : staggerDelay; // 250ms between words, or full stagger for stanzas

    chunks.forEach((_, index) => {
      // Add initial delay before first chunk, then stagger subsequent ones
      const delay = (initialDelay * 1000) + (index * actualStagger * 1000);
      
      const timer = setTimeout(() => {
        setVisibleCount(index + 1);

        // Call onComplete when all chunks are visible
        if (index === chunks.length - 1 && onComplete) {
          setTimeout(onComplete, 500);
        }
      }, delay);

      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [children, animate, chunks.length, staggerDelay, initialDelay, wordByWord, onComplete]);

  // Word-by-word mode: render as flowing text with words appearing
  if (wordByWord) {
    return (
      <p className={`${styles.base} ${styles.size} ${styles.leading} ${className}`}>
        <AnimatePresence mode="popLayout">
          {chunks.slice(0, visibleCount).map((word, index) => (
            <motion.span
              key={`${index}-${word}`}
              initial={animate ? { opacity: 0, y: 4 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              className="inline"
            >
              {word}{index < chunks.length - 1 ? ' ' : ''}
            </motion.span>
          ))}
        </AnimatePresence>
      </p>
    );
  }

  // If just one short sentence, render simply
  if (chunks.length === 1 && chunks[0].split(/\s+/).length <= 10) {
    return (
      <motion.p
        initial={animate ? { opacity: 0, y: 8 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: initialDelay }}
        className={`${styles.base} ${styles.size} ${styles.leading} ${className}`}
      >
        {chunks[0]}
      </motion.p>
    );
  }

  return (
    <div className={`${styles.spacing} ${className}`}>
      <AnimatePresence mode="popLayout">
        {chunks.slice(0, visibleCount).map((stanza, index) => (
          <motion.p
            key={`${index}-${stanza.slice(0, 20)}`}
            initial={animate ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
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
}: Omit<WisdomTextProps, 'animate' | 'staggerDelay' | 'onComplete' | 'wordByWord'>) {
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
