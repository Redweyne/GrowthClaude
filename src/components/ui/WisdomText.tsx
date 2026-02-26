'use client';

// ==============================================================================
// WISDOM TEXT - Sentence-by-Sentence Reveal
// ==============================================================================
//
// Reveals text one SENTENCE at a time. Each sentence fades in as a whole unit.
// No per-word spans, no timing bugs, no overflow issues.
// Pure CSS fade-in animation, minimal React re-renders.
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
  firstSentenceClassName?: string;
}

// ─── Text Parsing ────────────────────────────────────────────────────────────

function splitIntoSentences(text: string): string[] {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  if (sentences.length === 1 && sentences[0].length > 100) {
    const clauses = text
      .split(/(?<=[;:—–])\s+/)
      .map(s => s.trim())
      .filter(Boolean);
    if (clauses.length > 1) return clauses;
  }

  return sentences.length > 0 ? sentences : [text];
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

// ─── Speed Configs (sentence-level timing) ───────────────────────────────────

interface SpeedConfig {
  initialDelay: number;   // ms before first sentence
  interval: number;       // fixed ms between each sentence reveal
  fadeDuration: number;   // ms for sentence fade-in
  finalPause: number;     // ms after last sentence before onComplete
}

const speedConfigs: Record<string, SpeedConfig> = {
  slow: {
    initialDelay: 300,
    interval: 1400,
    fadeDuration: 400,
    finalPause: 500,
  },
  normal: {
    initialDelay: 200,
    interval: 1000,
    fadeDuration: 350,
    finalPause: 400,
  },
  fast: {
    initialDelay: 100,
    interval: 650,
    fadeDuration: 250,
    finalPause: 300,
  },
};

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
  const timing = speedConfigs[speed] || speedConfigs.normal;
  const styles = variantStyles[variant];

  const { gradient: gradientClass, rest: restClassName } = useMemo(
    () => extractGradientClass(className),
    [className],
  );

  // How many sentences are visible
  const [revealed, setRevealed] = useState(animate ? 0 : sentences.length);

  // Refs
  const onCompleteRef = useRef(onComplete);
  const signatureRef = useRef('');
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  // ─── Sentence reveal engine ─────────────────────────────────────────────

  useEffect(() => {
    const sig = `${children}::${speed}::${animate}`;
    if (signatureRef.current === sig) return;
    signatureRef.current = sig;

    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (!animate) {
      setRevealed(sentences.length);
      timersRef.current.push(setTimeout(() => onCompleteRef.current?.(), 50));
      return () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };
    }

    setRevealed(0);

    // Fixed interval between every sentence — consistent rhythm
    for (let i = 0; i < sentences.length; i++) {
      const revealAt = timing.initialDelay + i * timing.interval;
      timersRef.current.push(
        setTimeout(() => {
          setRevealed(prev => Math.max(prev, i + 1));
          if (i > 0) {
            requestAnimationFrame(() => {
              sentinelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
          }
        }, revealAt),
      );
    }

    // onComplete after last sentence + final pause
    const totalTime = timing.initialDelay + (sentences.length - 1) * timing.interval + timing.finalPause;
    timersRef.current.push(
      setTimeout(() => onCompleteRef.current?.(), totalTime),
    );

    return () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };
  }, [children, speed, animate, sentences, timing]);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={styles.spacing}>
      {sentences.map((sentence, sIdx) => {
        if (sIdx >= revealed) return null;

        const isFirst = sIdx === 0;
        const pClass = isFirst && firstSentenceClassName
          ? `${firstSentenceClassName} ${restClassName} ${gradientClass}`
          : gradientClass
            ? `${styles.size} ${styles.leading} ${restClassName} ${gradientClass}`
            : `${styles.base} ${styles.size} ${styles.leading} ${restClassName}`;

        return (
          <p
            key={sIdx}
            className={pClass}
            style={animate ? {
              animation: `wisdomReveal ${timing.fadeDuration}ms ease-out forwards`,
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            } : {
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}
          >
            {sentence}
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
