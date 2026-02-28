'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/hooks/useAudio';
import { useHaptics } from '@/hooks/useHaptics';

interface AddTaskOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (text: string) => void;
}

const MOTIVATIONS = [
  'What will you conquer today?',
  'Name your next victory.',
  'One task closer to greatness.',
  'Write it. Own it. Crush it.',
  "Today's mission:",
  'Set your target.',
  'Declare your intent.',
];

export function AddTaskOverlay({ isOpen, onClose, onAddTask }: AddTaskOverlayProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const audio = useAudio();
  const { hapticTap, hapticMedium } = useHaptics();

  // Pick a random motivation on each open
  const motivation = useMemo(() => {
    if (!isOpen) return '';
    return MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
  }, [isOpen]);

  // Auto-focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to let the spring animation start before focusing
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setText('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    hapticMedium();
    audio.playTap();
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

          {/* Content panel — slides up from bottom */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[101] bg-stone-900/70 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
            }}
          >
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

              {/* Input field — large, centered, premium feel */}
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
                  placeholder="Type your task..."
                  className="w-full text-xl text-center text-stone-100 light:text-stone-800 bg-transparent border-b-2 border-amber-500/30 focus:border-amber-400 outline-none py-4 px-4 placeholder:text-stone-600 transition-colors duration-200"
                  maxLength={120}
                  enterKeyHint="done"
                  autoComplete="off"
                />
              </motion.div>

              {/* Confirm button — appears when text is entered */}
              <AnimatePresence>
                {text.trim().length > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 font-bold text-lg shadow-lg shadow-amber-500/20"
                  >
                    Add Task
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
