'use client';

// ============================================================================
// MUSIC CONTROL - Floating music switcher for lesson phases
// ============================================================================

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, X, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { useStore } from '@/store/useStore';
import type { AmbientSound, WritingAmbience } from '@/lib/audioEngine';

interface MusicOption {
  id: string;
  label: string;
  icon: string;
}

const MUSIC_OPTIONS: MusicOption[] = [
  { id: 'silence', label: 'Silence', icon: '🔇' },
  { id: 'rain', label: 'Rain', icon: '🌧️' },
  { id: 'forest', label: 'Forest', icon: '🌲' },
  { id: 'lessonCalm', label: 'Calm', icon: '🌊' },
  { id: 'lessonDeep', label: 'Deep Focus', icon: '🧘' },
  { id: 'visualization', label: 'Ethereal', icon: '✨' },
  { id: 'reflection', label: 'Reflection', icon: '🪷' },
];

interface MusicControlProps {
  currentTrack?: string;
}

export function MusicControl({ currentTrack }: MusicControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState<string>(currentTrack || 'silence');
  const [isLoading, setIsLoading] = useState(false);
  const { soundEnabled, setSoundEnabled } = useStore();
  const { startMusic, startWritingAmbience, stopAllAudio } = useAudio();

  const handleSelectTrack = useCallback((trackId: string) => {
    // Prevent rapid clicking
    if (isLoading) return;
    if (trackId === activeTrack) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setActiveTrack(trackId);

    // Stop ALL audio immediately before starting new track
    stopAllAudio();

    // Small delay to ensure cleanup, then start new track
    setTimeout(() => {
      if (trackId === 'silence') {
        // Already stopped
      } else if (['rain', 'forest', 'fire'].includes(trackId)) {
        startWritingAmbience(trackId as WritingAmbience);
      } else {
        startMusic(trackId as AmbientSound, 2);
      }
      setIsLoading(false);
    }, 100);

    setIsOpen(false);
  }, [activeTrack, isLoading, startMusic, startWritingAmbience, stopAllAudio]);

  const toggleSound = useCallback(() => {
    if (soundEnabled) {
      stopAllAudio();
    }
    setSoundEnabled(!soundEnabled);
  }, [soundEnabled, setSoundEnabled, stopAllAudio]);

  const currentOption = MUSIC_OPTIONS.find(o => o.id === activeTrack) || MUSIC_OPTIONS[0];

  return (
    <>
      {/* Backdrop to close menu when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[998]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Music control - fixed position, doesn't affect layout */}
      <div className="fixed bottom-4 left-4 z-[999]">
        {/* Dropdown menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-12 left-0 mb-2 p-2 rounded-xl bg-stone-900/95 border border-stone-700/50 backdrop-blur-sm shadow-2xl min-w-[160px]"
            >
              <div className="space-y-1">
                {MUSIC_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelectTrack(option.id)}
                    disabled={isLoading}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm
                      transition-colors disabled:opacity-50
                      ${activeTrack === option.id
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                      }
                    `}
                  >
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>

              {/* Sound toggle */}
              <div className="mt-2 pt-2 border-t border-stone-700/50">
                <button
                  onClick={toggleSound}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm
                    transition-colors
                    ${!soundEnabled
                      ? 'bg-red-500/20 text-red-300'
                      : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                    }
                  `}
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-full
            bg-stone-900/90 border border-stone-700/50 backdrop-blur-sm
            text-stone-400 hover:text-stone-200 hover:border-stone-600
            transition-colors shadow-lg
          `}
        >
          {isOpen ? (
            <X size={18} />
          ) : (
            <>
              <Music size={18} className={soundEnabled && activeTrack !== 'silence' ? 'text-cyan-400' : ''} />
              <span className="text-xs">{currentOption.icon}</span>
            </>
          )}
        </motion.button>
      </div>
    </>
  );
}

export default MusicControl;
