'use client';

// ==============================================================================
// WISDOM TEXT - Word-by-Word Reveal via Pure CSS Animation
// ==============================================================================
//
// Mobile-first word reveal using CSS @keyframes + animation-delay.
// ZERO per-word React re-renders — all timing is handled by the browser's
// hardware-accelerated CSS animation engine.
//
// Key principles:
// - Pure CSS animations: each word gets animation-delay, browser handles timing
// - Only ~N sentence-level renders (2-5), not 30+ word-level renders
// - Trailing space chars for word spacing (no marginRight overflow)
// - overflow:hidden on container prevents any horizontal bleed
// - Gradient classes applied per-span for iOS Safari stacking context compat
//
// ==============================================================================

import { useState, useEffect, useMemo, useRef } from 'react';

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
  animDuration: number;   // ms for word fade-in CSS animation
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

// ─── Gradient detection ──────────────────────────────────────────────────────

const GRADIENT_CLASS_RE = /\bgradient-text-\w+\b/;

function extractGradientClass(cls: string): { gradient: string; rest: string } {
  const match = cls.match(GRADIENT_CLASS_RE);
  if (!match) return { gradient: '', rest: cls };
  return { gradient: match[0], rest: cls.replace(GRADIENT_CLASS_RE, '').trim() };
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

  // Extract gradient class to apply per-span (not per-paragraph)
  const { gradient: gradientClass, rest: restClassName } = useMemo(
    () => extractGradientClass(className),
    [className],
  );

  // Pre-calculate the complete word timing timeline (memoized, runs once)
  const wordTimeline = useMemo(
    () => buildWordTimeline(sentenceData, timing),
    [sentenceData, timing],
  );

  // Total animation duration for onComplete
  const totalDuration = useMemo(() => {
    if (wordTimeline.length === 0) return 0;
    return wordTimeline[wordTimeline.length - 1] + timing.wordInterval + timing.finalPause;
  }, [wordTimeline, timing]);

  // Sentence visibility — only N-1 timers (typically 2-4), not 30+
  const [visibleSentences, setVisibleSentences] = useState(
    animate ? 1 : sentenceData.length,
  );

  // Refs
  const onCompleteRef = useRef(onComplete);
  const signatureRef = useRef('');
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Keep onComplete ref fresh
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // ─── Animation engine — sentence timers + completion ────────────────────

  useEffect(() => {
    const signature = `${children}::${speed}::${animate}`;
    if (signatureRef.current === signature) return;
    signatureRef.current = signature;

    // Cleanup previous timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (!animate) {
      setVisibleSentences(sentenceData.length);
      const t = setTimeout(() => onCompleteRef.current?.(), 100);
      timersRef.current.push(t);
      return () => {
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
      };
    }

    // Reset for new animation
    setVisibleSentences(1);

    // Schedule sentence reveals (only N-1 timers for N sentences)
    sentenceData.forEach((s, idx) => {
      if (idx === 0) return; // First sentence is always visible
      const delay = wordTimeline[s.globalStart] || 0;
      timersRef.current.push(
        setTimeout(() => {
          setVisibleSentences(prev => Math.max(prev, idx + 1));
          // Auto-scroll when new sentence appears
          requestAnimationFrame(() => {
            sentinelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          });
        }, delay),
      );
    });

    // Schedule onComplete
    timersRef.current.push(
      setTimeout(() => onCompleteRef.current?.(), totalDuration),
    );

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [children, speed, animate, sentenceData, wordTimeline, totalDuration]);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={`${styles.spacing} overflow-hidden`}>
      {sentenceData.map((sentence, sIdx) => {
        // Only render sentences that should be visible
        if (sIdx >= visibleSentences) return null;

        const isFirst = sIdx === 0;
        // When gradient class is present, omit styles.base (text color conflicts)
        const pClass = isFirst && firstSentenceClassName
          ? `${firstSentenceClassName} ${restClassName}`
          : gradientClass
            ? `${styles.size} ${styles.leading} ${restClassName}`
            : `${styles.base} ${styles.size} ${styles.leading} ${restClassName}`;

        return (
          <p
            key={sIdx}
            className={pClass}
            style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
          >
            {sentence.words.map((word, wIdx) => {
              const globalIdx = sentence.globalStart + wIdx;
              const delayMs = wordTimeline[globalIdx] || 0;
              const isLast = wIdx === sentence.words.length - 1;

              // CSS animation: opacity 0→1 with per-word delay. Zero JS re-renders.
              const spanStyle: React.CSSProperties = animate
                ? {
                    opacity: 0,
                    animation: `wisdomReveal ${timing.animDuration}ms ease-out ${delayMs}ms forwards`,
                  }
                : {};

              return (
                <span
                  key={wIdx}
                  className={gradientClass || undefined}
                  style={spanStyle}
                >
                  {word}{isLast ? '' : ' '}
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
