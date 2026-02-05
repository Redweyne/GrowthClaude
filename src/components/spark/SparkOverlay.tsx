'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, ChevronUp, ChevronDown, Zap } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { useHaptics } from '@/hooks/useHaptics';
import type { SparkVideo } from '@/types/spark';
import { SPARK_CATEGORY_INFO } from '@/types/spark';

// ═══════════════════════════════════════════════════════════════════════════
// SPARK OVERLAY
// Floating controls, caption, and video info overlay on the feed
// ═══════════════════════════════════════════════════════════════════════════

interface SparkOverlayProps {
  video: SparkVideo;
  videoIndex: number;
  totalVideos: number;
  isSaved: boolean;
  videosWatchedSession: number;
  onSave: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function SparkOverlay({
  video,
  videoIndex,
  totalVideos,
  isSaved,
  videosWatchedSession,
  onSave,
  onNext,
  onPrevious,
  hasPrevious,
  hasNext,
}: SparkOverlayProps) {
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);
  const audio = useAudio();
  const { hapticMedium, hapticTap } = useHaptics();

  const categoryInfo = SPARK_CATEGORY_INFO[video.category];

  const handleSave = useCallback(() => {
    onSave();
    if (!isSaved) {
      setShowSaveAnimation(true);
      audio.playTapConfirm();
      hapticMedium();
      setTimeout(() => setShowSaveAnimation(false), 1000);
    } else {
      audio.playTap();
      hapticTap();
    }
  }, [onSave, isSaved, audio, hapticMedium, hapticTap]);

  return (
    <div className="absolute inset-0 z-40 pointer-events-none flex flex-col">
      {/* Top bar — spark count + category badge */}
      <div className="flex items-center justify-between p-4 pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
            <Zap size={14} className="text-amber-400" />
            <span className="text-white text-xs font-medium">
              {videosWatchedSession} watched
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
          <span className="text-sm">{categoryInfo.emoji}</span>
          <span className="text-white text-xs font-medium">{categoryInfo.label}</span>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-5 pointer-events-auto">
        {/* Previous */}
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
            hasPrevious
              ? 'bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 active:scale-90'
              : 'bg-black/20 text-white/20 cursor-not-allowed'
          }`}
          aria-label="Previous video"
        >
          <ChevronUp size={22} />
        </button>

        {/* Save/Bookmark */}
        <button
          onClick={handleSave}
          className="relative w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 active:scale-90 transition-all"
          aria-label={isSaved ? 'Remove from saved' : 'Save video'}
        >
          {isSaved ? (
            <BookmarkCheck size={22} className="text-amber-400" />
          ) : (
            <Bookmark size={22} />
          )}

          {/* Save animation */}
          <AnimatePresence>
            {showSaveAnimation && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-amber-400"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            )}
          </AnimatePresence>
        </button>

        {/* Next */}
        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
            hasNext
              ? 'bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 active:scale-90'
              : 'bg-black/20 text-white/20 cursor-not-allowed'
          }`}
          aria-label="Next video"
        >
          <ChevronDown size={22} />
        </button>
      </div>

      {/* Bottom info — caption + creator */}
      <div className="p-5 pb-6 pointer-events-auto">
        <div className="max-w-[75%]">
          {video.creatorName && (
            <p className="text-white font-semibold text-sm mb-1 drop-shadow-lg">
              @{video.creatorName.replace(/\s+/g, '').toLowerCase()}
            </p>
          )}
          {video.caption && (
            <p className="text-white/90 text-sm leading-relaxed drop-shadow-lg">
              &ldquo;{video.caption}&rdquo;
            </p>
          )}
          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {video.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="text-white/50 text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation hint (shown briefly at start) */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none">
        <motion.p
          className="text-white/30 text-xs text-center whitespace-nowrap"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3, duration: 1 }}
        >
          Scroll or use arrow keys to navigate
        </motion.p>
      </div>
    </div>
  );
}

export default SparkOverlay;
