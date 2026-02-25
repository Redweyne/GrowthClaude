'use client';

// ==============================================================================
// WISDOM TEXT - Word-by-Word Reveal at Natural Reading Pace
// ==============================================================================
//
// Reveals text one word at a time, calibrated to human reading speed.
// Each word fades in via CSS transition — no Framer Motion per-word overhead.
// Punctuation pauses (.!? commas, semicolons) create natural rhythm.
// Auto-scrolls to keep new content visible on long texts.
//
// Key principles:
// - Word-by-word reveal matches how humans actually read
// - Consistent timing across all step types (no more 4x variation)
// - Stable layout: unrevealed words hold space (opacity:0) so lines don't reflow
// - Auto-scroll sentinel keeps new text visible without user scrolling
// - STABLE: Does not re-animate on parent re-renders
//
// ==============================================================================

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';

interface WisdomTextProps {
  children: string;
  className?: string;
  variant?: 'narrative' | 'insight' | 'question' | 'instruction' | 'dramatic';
  animate?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
  onComplete?: () => void;
  /** If provided, the first sentence uses this class instead of variant styles */
  firstSentenceClassName?: string;
}

// ─── Text Parsing ────────────────────────────────────────────────────────────

function splitIntoSentences(text: string): string[] {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  // If single long sentence, try splitting by clauses
  if (sentences.length === 1 && sentences[0].length > 100) {
    const clauses = text
      .split(/(?<=[;:—–])\s+/)
      .map(s => s.trim())
      .filter(Boolean);
    if (clauses.length > 1) return clauses;
  }

  return sentences.length > 0 ? sentences : [text];
}

function splitIntoWords(sentence: string): string[] {
  return sentence.split(/\s+/).filter(Boolean);
}

// Detect trailing punctuation on a word to determine pause duration
function getPunctuationPause(word: string, timing: SpeedConfig): number {
  if (/[.!?]+$/.test(word)) return timing.periodPause;
  if (/,$/.test(word)) return timing.commaPause;
  if (/[;:—–\-]+$/.test(word)) return timing.semicolonPause;
  if (/\.{2,}$/.test(word)) return timing.periodPause; // ellipsis
  return 0;
}

// ─── Variant Styles ──────────────────────────────────────────────────────────

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

// ─── Speed Configs (word-by-word timing) ─────────────────────────────────────

interface SpeedConfig {
  initialDelay: number;   // ms before first word
  wordInterval: number;   // ms between word starts
  periodPause: number;    // extra ms after . ! ?
  commaPause: number;     // extra ms after ,
  semicolonPause: number; // extra ms after ; : — –
  paragraphGap: number;   // extra ms between sentences
  animDuration: number;   // ms for word fade-in CSS transition
  finalPause: number;     // ms after last word before onComplete
}

const speedConfigs: Record<string, SpeedConfig> = {
  slow: {
    initialDelay: 600,
    wordInterval: 250,
    periodPause: 450,
    commaPause: 160,
    semicolonPause: 220,
    paragraphGap: 280,
    animDuration: 120,
    finalPause: 400,
  },
  normal: {
    initialDelay: 400,
    wordInterval: 180,
    periodPause: 350,
    commaPause: 130,
    semicolonPause: 180,
    paragraphGap: 220,
    animDuration: 100,
    finalPause: 300,
  },
  fast: {
    initialDelay: 250,
    wordInterval: 120,
    periodPause: 250,
    commaPause: 100,
    semicolonPause: 140,
    paragraphGap: 160,
    animDuration: 80,
    finalPause: 200,
  },
};

// ─── Word metadata for the timing engine ─────────────────────────────────────

interface SentenceData {
  words: string[];
  globalStart: number; // index of first word in the flat word array
}

function buildSentenceData(sentences: string[]): SentenceData[] {
  let offset = 0;
  return sentences.map(sentence => {
    const words = splitIntoWords(sentence);
    const data: SentenceData = { words, globalStart: offset };
    offset += words.length;
    return data;
  });
}

function buildWordTimeline(
  sentenceData: SentenceData[],
  timing: SpeedConfig,
): number[] {
  // Returns an array of cumulative reveal times (ms) for each word
  const times: number[] = [];
  let t = timing.initialDelay;

  for (let sIdx = 0; sIdx < sentenceData.length; sIdx++) {
    const { words } = sentenceData[sIdx];

    // Add paragraph gap before non-first sentences
    if (sIdx > 0) {
      t += timing.paragraphGap;
    }

    for (let wIdx = 0; wIdx < words.length; wIdx++) {
      times.push(t);

      // Calculate delay AFTER this word
      const punctPause = getPunctuationPause(words[wIdx], timing);
      t += timing.wordInterval + punctPause;
    }
  }

  return times;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function WisdomText({
  children,
  className = '',
  variant = 'narrative',
  animate = true,
  speed = 'normal',
  onComplete,
  firstSentenceClassName,
}: WisdomTextProps) {
  const sentences = useMemo(() => splitIntoSentences(children), [children]);
  const sentenceData = useMemo(() => buildSentenceData(sentences), [sentences]);
  const totalWords = useMemo(
    () => sentenceData.reduce((sum, s) => sum + s.words.length, 0),
    [sentenceData],
  );

  const timing = speedConfigs[speed] || speedConfigs.normal;
  const styles = variantStyles[variant];

  // Core state: how many words have been revealed
  const [revealedCount, setRevealedCount] = useState(animate ? 0 : totalWords);
  const [hasAnimated, setHasAnimated] = useState(!animate);

  // Refs for stability
  const mountedRef = useRef(true);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const onCompleteRef = useRef(onComplete);
  const signatureRef = useRef(`${children}::${speed}::${animate}`);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Keep onComplete ref fresh
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Auto-scroll when a new sentence starts revealing
  const lastScrolledSentence = useRef(-1);
  const scrollToSentinel = useCallback(() => {
    sentinelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, []);

  // Determine which sentence we're currently in (for scroll triggering)
  const currentSentenceIndex = useMemo(() => {
    for (let i = sentenceData.length - 1; i >= 0; i--) {
      if (revealedCount > sentenceData[i].globalStart) return i;
    }
    return -1;
  }, [revealedCount, sentenceData]);

  // Scroll when a new sentence starts
  useEffect(() => {
    if (currentSentenceIndex > lastScrolledSentence.current && currentSentenceIndex > 0) {
      lastScrolledSentence.current = currentSentenceIndex;
      scrollToSentinel();
    }
  }, [currentSentenceIndex, scrollToSentinel]);

  // ─── Word reveal engine ──────────────────────────────────────────────────

  useEffect(() => {
    const signature = `${children}::${speed}::${animate}`;
    if (signatureRef.current === signature && hasAnimated) {
      return;
    }

    signatureRef.current = signature;
    mountedRef.current = true;
    lastScrolledSentence.current = -1;

    // Cleanup previous timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (!animate) {
      setRevealedCount(totalWords);
      setHasAnimated(true);
      const t = setTimeout(() => {
        if (mountedRef.current && onCompleteRef.current) {
          onCompleteRef.current();
        }
      }, 100);
      timersRef.current.push(t);
      return () => {
        mountedRef.current = false;
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
      };
    }

    // Reset
    setRevealedCount(0);
    setHasAnimated(false);

    // Build timeline
    const timeline = buildWordTimeline(sentenceData, timing);

    // Schedule each word reveal
    timeline.forEach((revealAt, wordIndex) => {
      const timer = setTimeout(() => {
        if (!mountedRef.current) return;
        setRevealedCount(wordIndex + 1);
      }, revealAt);
      timersRef.current.push(timer);
    });

    // Schedule onComplete after the last word + finalPause
    const lastWordTime = timeline.length > 0 ? timeline[timeline.length - 1] : 0;
    const completeAt = lastWordTime + timing.wordInterval + timing.finalPause;
    const completeTimer = setTimeout(() => {
      if (!mountedRef.current) return;
      setHasAnimated(true);
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, completeAt);
    timersRef.current.push(completeTimer);

    return () => {
      mountedRef.current = false;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [children, animate, speed, sentenceData, timing, totalWords, hasAnimated]);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={styles.spacing}>
      {sentenceData.map((sentence, sIdx) => {
        // Only render future sentences once their first word starts revealing
        // First sentence always renders (with opacity-0 words) to avoid invisible gap
        if (sIdx > 0 && revealedCount <= sentence.globalStart) return null;

        const isFirst = sIdx === 0;
        const pClass = isFirst && firstSentenceClassName
          ? `${firstSentenceClassName} ${className}`
          : `${styles.base} ${styles.size} ${styles.leading} ${className}`;

        return (
          <p key={sIdx} className={pClass}>
            {sentence.words.map((word, wIdx) => {
              const globalIdx = sentence.globalStart + wIdx;
              const isRevealed = globalIdx < revealedCount;

              return (
                <span
                  key={wIdx}
                  className="inline-block mr-[0.3em]"
                  style={{
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed ? 'translateY(0)' : 'translateY(4px)',
                    transition: `opacity ${timing.animDuration}ms ease-out, transform ${timing.animDuration}ms ease-out`,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </p>
        );
      })}
      <div ref={sentinelRef} className="h-0 w-0" aria-hidden />
    </div>
  );
}

// ─── Static version (no animation) ──────────────────────────────────────────

export function WisdomTextStatic({
  children,
  className = '',
  variant = 'narrative',
}: Omit<WisdomTextProps, 'animate' | 'speed' | 'onComplete' | 'firstSentenceClassName'>) {
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
