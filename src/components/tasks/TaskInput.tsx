'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { useHaptics } from '@/hooks/useHaptics';

interface TaskInputProps {
  onAddTask: (text: string) => void;
}

export function TaskInput({ onAddTask }: TaskInputProps) {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const audio = useAudio();
  const { hapticTap } = useHaptics();

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    onAddTask(trimmed);
    setText('');
    hapticTap();

    // Keep input focused for rapid task entry
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-4 pb-3 pt-2">
      <motion.div
        className={`flex items-center gap-2 rounded-2xl border transition-colors duration-200 ${
          isFocused
            ? 'border-amber-500/50 bg-stone-900/90 light:bg-white/90 shadow-[0_0_15px_rgba(251,191,36,0.1)]'
            : 'border-stone-700/50 light:border-stone-300/50 bg-stone-900/60 light:bg-white/60'
        }`}
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="What will you conquer today?"
          className="flex-1 bg-transparent px-4 py-3.5 text-sm text-stone-100 light:text-stone-800 placeholder:text-stone-500 light:placeholder:text-stone-400 outline-none"
          maxLength={120}
          enterKeyHint="done"
          autoComplete="off"
        />

        <AnimatePresence mode="wait">
          {text.trim().length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              whileTap={{ scale: 0.85 }}
              onClick={handleSubmit}
              className="mr-2 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
              aria-label="Add task"
            >
              <Plus size={20} className="text-stone-950" strokeWidth={3} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
