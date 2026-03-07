'use client';

// ============================================================================
// MUSIC CONTROLS - Mute + Change Track buttons for background music
// ============================================================================
// A minimal floating control bar for background music.
// Shows during onboarding (after name prompt) and lessons.
// iOS Safari Safe: Uses proper touch event handling.
// ============================================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, SkipForward, Music } from 'lucide-react';
import { backgroundMusic } from '@/lib/backgroundMusic';
import { useStore } from '@/store/useStore';
import { useTranslation } from '@/i18n';

interface MusicControlsProps {
  /** Whether to show the controls */
  show?: boolean;
}

const COPY_BY_LOCALE = {
  en: {
    unmuteMusic: 'Unmute music',
    muteMusic: 'Mute music',
    changeTrack: 'Change music track',
    tracks: {
      forest: 'Forest',
      lessonDeep: 'Deep',
      rain: 'Rain',
      visualization: 'Cosmic',
    },
  },
  fr: {
    unmuteMusic: 'Réactiver la musique',
    muteMusic: 'Couper la musique',
    changeTrack: 'Changer de piste musicale',
    tracks: {
      forest: 'Forêt',
      lessonDeep: 'Profonde',
      rain: 'Pluie',
      visualization: 'Cosmique',
    },
  },
  ar: {
    unmuteMusic: 'تشغيل الموسيقى',
    muteMusic: 'كتم الموسيقى',
    changeTrack: 'تغيير المقطع الموسيقي',
    tracks: {
      forest: 'غابة',
      lessonDeep: 'عميق',
      rain: 'مطر',
      visualization: 'كوني',
    },
  },
} as const;

export function MusicControls({ show = true }: MusicControlsProps) {
  const { soundEnabled } = useStore();
  const { locale } = useTranslation();
  const [isMuted, setIsMuted] = useState(backgroundMusic.isMuted());
  const [currentTrack, setCurrentTrack] = useState(backgroundMusic.getCurrentTrackName());
  const isOperatingRef = useRef(false);
  const copy = COPY_BY_LOCALE[locale] ?? COPY_BY_LOCALE.en;
  
  // Debounce to prevent double-firing on iOS
  const lastInteractionRef = useRef<number>(0);
  const DEBOUNCE_MS = 300;

  // Sync muted state with soundEnabled from store
  useEffect(() => {
    if (!soundEnabled) {
      backgroundMusic.setMuted(true);
      setIsMuted(true);
    }
  }, [soundEnabled]);

  // Subscribe to track changes so the label always reflects the actual playing track
  useEffect(() => {
    const unsubscribe = backgroundMusic.subscribe((trackName) => {
      setCurrentTrack(trackName);
    });
    // Also sync the current track name on mount in case it already changed
    setCurrentTrack(backgroundMusic.getCurrentTrackName());
    return unsubscribe;
  }, []);

  const shouldIgnoreEvent = useCallback(() => {
    const now = Date.now();
    if (now - lastInteractionRef.current < DEBOUNCE_MS) {
      return true;
    }
    lastInteractionRef.current = now;
    return false;
  }, []);

  // Toggle mute with iOS safety
  const handleToggleMute = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (shouldIgnoreEvent()) return;
    if (isOperatingRef.current) return;
    isOperatingRef.current = true;

    try {
      const newMuted = backgroundMusic.toggleMute();
      setIsMuted(newMuted);
    } catch (err) {
      console.warn('[MusicControls] Error toggling mute:', err);
    }

    setTimeout(() => {
      isOperatingRef.current = false;
    }, 300);
  }, [shouldIgnoreEvent]);

  // Change track with iOS safety
  const handleChangeTrack = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (shouldIgnoreEvent()) return;
    if (isOperatingRef.current) return;
    isOperatingRef.current = true;

    try {
      backgroundMusic.changeTrack();
      // Track label update is handled by the subscription listener
    } catch (err) {
      console.warn('[MusicControls] Error changing track:', err);
    }

    setTimeout(() => {
      isOperatingRef.current = false;
    }, 300);
  }, [shouldIgnoreEvent]);

  // Format track name for display
  const getTrackDisplayName = (name: string) => {
    return copy.tracks[name as keyof typeof copy.tracks] || name;
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="fixed bottom-4 left-4 z-[999] flex items-center gap-2"
        >
          {/* Mute Button */}
          <motion.button
            type="button"
            onClick={handleToggleMute}
            onTouchEnd={handleToggleMute}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`
              w-12 h-12 rounded-full
              flex items-center justify-center
              transition-colors shadow-lg
              ${!isMuted
                ? 'bg-stone-900/90 light:bg-stone-100/90 border border-stone-700/50 light:border-stone-300 text-stone-400 light:text-stone-700 hover:text-cyan-400 hover:border-cyan-500/30'
                : 'bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300'
              }
            `}
            aria-label={isMuted ? copy.unmuteMusic : copy.muteMusic}
          >
            {!isMuted ? (
              <Volume2 size={20} />
            ) : (
              <VolumeX size={20} />
            )}
          </motion.button>

          {/* Change Track Button */}
          <motion.button
            type="button"
            onClick={handleChangeTrack}
            onTouchEnd={handleChangeTrack}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="
              h-12 px-4 rounded-full
              flex items-center justify-center gap-2
              bg-stone-900/90 light:bg-stone-100/90 border border-stone-700/50 light:border-stone-300 
              text-stone-400 light:text-stone-700 hover:text-amber-400 hover:border-amber-500/30
              transition-colors shadow-lg
            "
            aria-label={copy.changeTrack}
          >
            <Music size={16} />
            <span className="text-sm font-medium">{getTrackDisplayName(currentTrack)}</span>
            <SkipForward size={16} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MusicControls;
