'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/hooks/useAudio';
import { useHaptics } from '@/hooks/useHaptics';
import { useTranslation } from '@/i18n';

interface AddTaskOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (text: string) => void;
}

export function AddTaskOverlay({ isOpen, onClose, onAddTask }: AddTaskOverlayProps) {
  const { locale } = useTranslation();
  const [text, setText] = useState('');
  const [showSweep, setShowSweep] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const audio = useAudio();
  const { hapticMedium } = useHaptics();

  const copy = {
    en: {
      motivations: [
        'What will you conquer today?',
        'Name your next victory.',
        'One task closer to greatness.',
        'Write it. Own it. Crush it.',
        "Today's mission:",
        'Set your target.',
        'Declare your intent.',
      ],
      placeholder: 'Type your task...',
      addTask: 'Add Task',
    },
    fr: {
      motivations: [
        'Que vas-tu conquérir aujourd hui ?',
        'Nomme ta prochaine victoire.',
        'Une tâche de plus vers la grandeur.',
        'Écris-la. Assume-la. Réussis.',
        'Mission du jour :',
        'Fixe ta cible.',
        'Déclare ton intention.',
      ],
      placeholder: 'Écris ta tâche...',
      addTask: 'Ajouter la tâche',
    },
    ar: {
      motivations: [
        'ماذا ستتغلب عليه اليوم؟',
        'سمِّ انتصارك القادم.',
        'مهمة واحدة أقرب للعظمة.',
        'اكتبها. امتلكها. أنجزها.',
        'مهمة اليوم:',
        'حدد هدفك.',
        'أعلن نيتك.',
      ],
      placeholder: 'اكتب مهمتك...',
      addTask: 'إضافة مهمة',
    },
  } as const;
  const c = copy[locale] ?? copy.en;

  const motivation = useMemo(() => {
    if (!isOpen) return '';
    return c.motivations[Math.floor(Math.random() * c.motivations.length)];
  }, [c.motivations, isOpen]);

  // Auto-focus input + trigger sweep on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      // Light sweep reveal
      setTimeout(() => setShowSweep(true), 150);
      setTimeout(() => setShowSweep(false), 1500);
      return () => clearTimeout(timer);
    } else {
      setText('');
      setShowSweep(false);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    hapticMedium();
    // Layered sounds
    audio.playUI('pop');
    audio.playUI('whoosh');
    onAddTask(trimmed);
    setText('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Dynamic glow intensity based on text length
  const glowIntensity = Math.min(text.length * 1.5, 25);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-stone-950/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Content panel */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[101] bg-stone-900/70 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl overflow-hidden"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
            }}
          >
            {/* Light sweep reveal effect */}
            <AnimatePresence>
              {showSweep && (
                <motion.div
                  className="absolute left-0 right-0 h-[2px] pointer-events-none z-10"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, #fbbf24 50%, transparent 100%)',
                    boxShadow: '0 0 30px 10px rgba(251,191,36,0.25)',
                  }}
                  initial={{ top: '0%', opacity: 0 }}
                  animate={{ top: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: 'easeInOut', opacity: { times: [0, 0.1, 0.9, 1] } }}
                />
              )}
            </AnimatePresence>

            {/* Drag handle pill */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-stone-600" />
            </div>

            <div className="px-6 pt-4 pb-6">
              {/* Motivational text */}
              <motion.p
                className="text-sm text-stone-400 text-center font-medium mb-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                {motivation}
              </motion.p>

              {/* Input field with dynamic glow */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={c.placeholder}
                  className="w-full text-xl text-center text-stone-100 light:text-stone-800 bg-transparent border-b-2 border-amber-500/30 focus:border-amber-400 outline-none py-4 px-4 placeholder:text-stone-600 transition-colors duration-200"
                  style={{
                    boxShadow: text.length > 0
                      ? `0 4px ${glowIntensity}px rgba(251,191,36,${Math.min(0.1 + text.length * 0.01, 0.3)})`
                      : 'none',
                  }}
                  maxLength={120}
                  enterKeyHint="done"
                  autoComplete="off"
                />
              </motion.div>

              {/* Confirm button */}
              <AnimatePresence>
                {text.trim().length > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.85, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: 12 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={handleSubmit}
                    className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 font-bold text-lg shadow-lg shadow-amber-500/25"
                  >
                    {c.addTask}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
