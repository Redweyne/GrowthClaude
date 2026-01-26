'use client';

// ============================================================================
// MUSIC CONTROL - Floating music switcher for lesson phases
// ============================================================================
// iOS Safari Safe: All interactions use proper event handling to prevent
// page crashes and unwanted navigation.
// ============================================================================

import { useState, useCallback, useEffect, useRef } from 'react';
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
  const isOperatingRef = useRef(false);

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

  // Prevent double-firing from touch + click on iOS
  const lastInteractionRef = useRef<number>(0);
  const DEBOUNCE_MS = 300;

  const shouldIgnoreEvent = useCallback(() => {
    const now = Date.now();
    if (now - lastInteractionRef.current < DEBOUNCE_MS) {
      return true;
    }
    lastInteractionRef.current = now;
    return false;
  }, []);

  // Safe close menu handler
  const closeMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (shouldIgnoreEvent()) return;
    setIsOpen(false);
  }, [shouldIgnoreEvent]);

  // Handle track selection with iOS-safe audio operations
  const handleSelectTrack = useCallback((option: MusicOption) => (e: React.MouseEvent) => {
    // CRITICAL: Prevent default behavior that causes iOS crashes
    e.preventDefault();
    e.stopPropagation();

    // Debounce to prevent double-firing
    if (shouldIgnoreEvent()) return;

    // Prevent rapid clicking or double operations
    if (isLoading || isOperatingRef.current) return;
    if (option.id === selectedTrack) {
      setIsOpen(false);
      return;
    }

    isOperatingRef.current = true;
    setIsLoading(true);
    setSelectedTrack(option.id);
    setIsOpen(false);

    // Wrap audio operations in try-catch to prevent crashes
    try {
      stopAllAudio();
    } catch (err) {
      console.warn('[MusicControl] Error stopping audio:', err);
    }

    // Longer delay for iOS Safari audio context cleanup
    setTimeout(() => {
      try {
        if (option.type === 'silence') {
          // Already stopped
        } else if (option.type === 'ambience') {
          startAmbience(option.id as WritingAmbience);
        } else {
          startMusic(option.id as AmbientSound, 2);
        }
      } catch (err) {
        console.warn('[MusicControl] Error starting audio:', err);
      }
      setIsLoading(false);
      isOperatingRef.current = false;
    }, 500); // 500ms delay for iOS safety
  }, [selectedTrack, isLoading, startMusic, startAmbience, stopAllAudio, shouldIgnoreEvent]);

  // Toggle sound with iOS safety
  const toggleSound = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (shouldIgnoreEvent()) return;
    if (isOperatingRef.current) return;
    isOperatingRef.current = true;

    try {
      if (soundEnabled) {
        stopAllAudio();
      }
      setSoundEnabled(!soundEnabled);
    } catch (err) {
      console.warn('[MusicControl] Error toggling sound:', err);
    }

    setTimeout(() => {
      isOperatingRef.current = false;
    }, 300);
  }, [soundEnabled, setSoundEnabled, stopAllAudio, shouldIgnoreEvent]);

  // Toggle menu with iOS safety
  const toggleMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (shouldIgnoreEvent()) return;
    setIsOpen(prev => !prev);
  }, [shouldIgnoreEvent]);

  const currentOption = MUSIC_OPTIONS.find(o => o.id === selectedTrack) || MUSIC_OPTIONS[0];
  const isPlaying = state.isMusicPlaying || state.isAmbiencePlaying;

  return (
    <>
      {/* Backdrop to close menu when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[998]"
          onClick={closeMenu}
          role="button"
          tabIndex={-1}
          aria-label="Close music menu"
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
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-1">
                {MUSIC_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={handleSelectTrack(option)}
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
          onClick={toggleMenu}
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
