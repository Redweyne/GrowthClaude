'use client';

// ============================================================================
// MUSIC CONTROL - Floating music switcher for lesson phases
// ============================================================================

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, X, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { useStore } from '@/store/useStore';
import type { AmbientSound, WritingAmbience } from '@/lib/audioEngine';

interface MusicOption {
  id: string;
  label: string;
  icon: string;
  type: 'silence' | 'ambience' | 'music';
}

const MUSIC_OPTIONS: MusicOption[] = [
  { id: 'silence', label: 'Silence', icon: '🔇', type: 'silence' },
  { id: 'rain', label: 'Rain', icon: '🌧️', type: 'ambience' },
  { id: 'forest', label: 'Forest', icon: '🌲', type: 'ambience' },
  { id: 'lessonCalm', label: 'Calm', icon: '🌊', type: 'music' },
  { id: 'lessonDeep', label: 'Deep Focus', icon: '🧘', type: 'music' },
  { id: 'visualization', label: 'Ethereal', icon: '✨', type: 'music' },
  { id: 'reflection', label: 'Reflection', icon: '🪷', type: 'music' },
];

interface MusicControlProps {
  currentTrack?: string;
}

export function MusicControl({ currentTrack }: MusicControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { soundEnabled, setSoundEnabled } = useStore();
  const { startMusic, startAmbience, stopAllAudio, state } = useAudio();

  // Track the active track from engine state OR local selection
  const [selectedTrack, setSelectedTrack] = useState<string>(currentTrack || 'silence');

  // Sync with engine state
  useEffect(() => {
    if (state.currentMusicTrack) {
      setSelectedTrack(state.currentMusicTrack);
    } else if (state.currentAmbienceTrack) {
      setSelectedTrack(state.currentAmbienceTrack);
    } else if (!state.isMusicPlaying && !state.isAmbiencePlaying) {
      setSelectedTrack('silence');
    }
  }, [state.currentMusicTrack, state.currentAmbienceTrack, state.isMusicPlaying, state.isAmbiencePlaying]);

  const handleSelectTrack = useCallback((option: MusicOption, e: React.MouseEvent) => {
    // CRITICAL: Prevent iOS Safari from triggering page refresh
    e.preventDefault();
    e.stopPropagation();

    // Prevent rapid clicking
    if (isLoading) return;
    if (option.id === selectedTrack) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setSelectedTrack(option.id);

    // Stop ALL audio immediately before starting new track
    stopAllAudio();

    // Use proper delay for iOS cleanup (300ms minimum)
    setTimeout(() => {
      if (option.type === 'silence') {
        // Already stopped
      } else if (option.type === 'ambience') {
        startAmbience(option.id as WritingAmbience);
      } else {
        startMusic(option.id as AmbientSound, 2);
      }
      setIsLoading(false);
    }, 350); // 350ms delay for iOS audio context cleanup

    setIsOpen(false);
  }, [selectedTrack, isLoading, startMusic, startAmbience, stopAllAudio]);

  const toggleSound = useCallback(() => {
    if (soundEnabled) {
      stopAllAudio();
    }
    setSoundEnabled(!soundEnabled);
  }, [soundEnabled, setSoundEnabled, stopAllAudio]);

  const currentOption = MUSIC_OPTIONS.find(o => o.id === selectedTrack) || MUSIC_OPTIONS[0];
  const isPlaying = state.isMusicPlaying || state.isAmbiencePlaying;

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
                    type="button"
                    onClick={(e) => handleSelectTrack(option, e)}
                    disabled={isLoading}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm
                      transition-colors disabled:opacity-50
                      ${selectedTrack === option.id
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                      }
                    `}
                  >
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                    {isLoading && selectedTrack === option.id && (
                      <span className="ml-auto text-xs opacity-50">...</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Sound toggle */}
              <div className="mt-2 pt-2 border-t border-stone-700/50">
                <button
                  type="button"
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
          type="button"
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
              <Music size={18} className={soundEnabled && isPlaying ? 'text-cyan-400' : ''} />
              <span className="text-xs">{currentOption.icon}</span>
            </>
          )}
        </motion.button>
      </div>
    </>
  );
}

export default MusicControl;
