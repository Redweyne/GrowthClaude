'use client';

// ═══════════════════════════════════════════════════════════════════════════
// GO DO IT STEP - THE SACRED DISMISSAL
// ═══════════════════════════════════════════════════════════════════════════
//
// This is the moment of truth. The user has made a commitment.
// Now Sage sends them into the world to fulfill it.
//
// "Go. Take action. Only return after you've moved."
//
// This is not passive learning. This is life integration.
// The transformation happens out there, not in here.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui';
import type { GoDoItStep as GoDoItStepType } from '@/types/lessons';

interface GoDoItStepProps {
  step: GoDoItStepType;
  commitment?: string;
  onDismiss: () => void;
}

// Sage avatar component
function SageAvatar({ mood }: { mood: 'wise' | 'encouraging' | 'serious' }) {
  const colors = {
    wise: 'from-purple-500/20 to-amber-500/10',
    encouraging: 'from-emerald-500/20 to-cyan-500/10',
    serious: 'from-amber-500/20 to-rose-500/10',
  };

  return (
    <motion.div
      className="relative w-24 h-24 mx-auto mb-8"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-60"
        style={{
          background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
        }}
      />

      {/* Avatar container */}
      <div
        className={`
          relative w-full h-full rounded-full
          bg-gradient-to-br ${colors[mood]}
          border border-stone-700/50
          flex items-center justify-center
          shadow-lg shadow-stone-950/50
        `}
      >
        {/* Sage emoji/icon */}
        <span className="text-4xl">🧙</span>
      </div>

      {/* Subtle pulse */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-amber-500/20"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}

export function GoDoItStep({ step, commitment, onDismiss }: GoDoItStepProps) {
  const [phase, setPhase] = useState<'entering' | 'message' | 'ready'>('entering');
  const [displayedText, setDisplayedText] = useState('');
  const [textComplete, setTextComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Phase transitions
  useEffect(() => {
    const timer = setTimeout(() => setPhase('message'), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Typewriter effect for Sage's message
  useEffect(() => {
    if (phase !== 'message') return;

    const text = step.sageMessage;
    let index = 0;
    const speed = 35; // ms per character

    intervalRef.current = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTextComplete(true);
        setTimeout(() => setPhase('ready'), 800);
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase, step.sageMessage]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Deep atmospheric glow */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 50% 30%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 50% 70%, rgba(251, 191, 36, 0.08) 0%, transparent 50%)
          `,
        }}
      />

      <div className="max-w-lg w-full relative z-10">
        <AnimatePresence mode="wait">
          {/* ─────────────────────────────────────────────────────────────────
              Entering Phase
          ───────────────────────────────────────────────────────────────── */}
          {phase === 'entering' && (
            <motion.div
              key="entering"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                className="w-16 h-16 mx-auto rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              Message Phase - Sage Speaks
          ───────────────────────────────────────────────────────────────── */}
          {(phase === 'message' || phase === 'ready') && (
            <motion.div
              key="message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-8"
            >
              {/* Sage avatar */}
              <SageAvatar mood="serious" />

              {/* Your commitment (if provided) */}
              {commitment && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-stone-900/60 border border-stone-700/50 rounded-xl p-4 mb-6"
                >
                  <p className="text-xs text-amber-400/70 tracking-[0.15em] uppercase mb-2">
                    Your Commitment
                  </p>
                  <p className="text-stone-300 italic">&ldquo;{commitment}&rdquo;</p>
                </motion.div>
              )}

              {/* Sage's message with typewriter effect */}
              <div className="min-h-[120px]">
                <motion.p
                  className="text-xl sm:text-2xl text-stone-200 leading-relaxed font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {displayedText}
                  {!textComplete && (
                    <motion.span
                      className="inline-block w-0.5 h-6 bg-purple-400 ml-1 align-middle"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </motion.p>
              </div>

              {/* Subtext */}
              {step.sageSubtext && textComplete && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-stone-500 text-sm"
                >
                  {step.sageSubtext}
                </motion.p>
              )}

              {/* Dismiss button */}
              <AnimatePresence>
                {phase === 'ready' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-4"
                  >
                    <Button
                      size="lg"
                      onClick={onDismiss}
                      glow
                      className="w-full group"
                    >
                      {step.dismissLabel}
                      <ExternalLink
                        size={18}
                        className="ml-2 opacity-60 group-hover:opacity-100 transition-opacity"
                      />
                    </Button>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-stone-600 text-xs mt-4"
                    >
                      The lesson will wait for you here
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default GoDoItStep;
