'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, Heart, Share2, X, Zap } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { useHaptics } from '@/hooks/useHaptics';
import type { SparkVideo } from '@/types/spark';
import { SPARK_CATEGORY_INFO } from '@/types/spark';

// ═══════════════════════════════════════════════════════════════════════════
// SPARK OVERLAY — TikTok Layout
// Right-side icon stack, bottom-left info, gradient vignettes
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
  onExit: () => void;
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
  onExit,
  hasPrevious,
  hasNext,
}: SparkOverlayProps) {
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const audio = useAudio();
  const { hapticMedium, hapticTap } = useHaptics();

  const categoryInfo = SPARK_CATEGORY_INFO[video.category];

  const handleSave = useCallback(() => {
    onSave();
    if (!isSaved) {
      setShowSaveAnimation(true);
      audio.playTapConfirm();
      hapticMedium();
      setTimeout(() => setShowSaveAnimation(false), 800);
    } else {
      audio.playTap();
      hapticTap();
    }
  }, [onSave, isSaved, audio, hapticMedium, hapticTap]);

  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      {/* Top gradient vignette */}
      <div
        className="absolute top-0 left-0 right-0 h-28 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
        }}
      />

      {/* Bottom gradient vignette */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)',
        }}
      />

      {/* Top bar — exit + counter */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pointer-events-auto" style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
        <button
          onClick={onExit}
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white active:scale-90 transition-transform"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm">
            <Zap size={12} className="text-amber-400" />
            <span className="text-white/80 text-xs font-medium">
              {videosWatchedSession}
            </span>
          </div>
        </div>
      </div>

      {/* Right side icon stack — TikTok style */}
      <div
        className="absolute right-3 flex flex-col items-center gap-6 pointer-events-auto"
        style={{ bottom: 'calc(9rem + env(safe-area-inset-bottom))' }}
      >
        {/* Save/Bookmark */}
        <button
          onClick={handleSave}
          className="relative flex flex-col items-center gap-1 active:scale-90 transition-transform"
          aria-label={isSaved ? 'Unsave' : 'Save'}
        >
          <div className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
            {isSaved ? (
              <BookmarkCheck size={24} className="text-amber-400" />
            ) : (
              <Bookmark size={24} className="text-white" />
            )}
          </div>
          <span className="text-white/70 text-[10px] font-medium">
            {isSaved ? 'Saved' : 'Save'}
          </span>

          <AnimatePresence>
            {showSaveAnimation && (
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-amber-400"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </AnimatePresence>
        </button>

        {/* Category */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-xl">{categoryInfo.emoji}</span>
          </div>
          <span className="text-white/70 text-[10px] font-medium">{categoryInfo.label}</span>
        </div>

        {/* Share */}
        <button
          className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
          aria-label="Share"
          onClick={() => { hapticTap(); }}
        >
          <div className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
            <Share2 size={22} className="text-white" />
          </div>
          <span className="text-white/70 text-[10px] font-medium">Share</span>
        </button>
      </div>

      {/* Bottom left — creator info, caption, tags */}
      <div
        className="absolute left-4 right-20 pointer-events-auto"
        style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
      >
        {video.creatorName && (
          <p className="text-white font-bold text-[15px] mb-1.5 drop-shadow-lg">
            @{video.creatorName.replace(/\s+/g, '').toLowerCase()}
          </p>
        )}

        {video.caption && (
          <p className="text-white/90 text-[13px] leading-[1.4] drop-shadow-lg mb-2 line-clamp-3">
            {video.caption}
          </p>
        )}

        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {video.tags.slice(0, 4).map(tag => (
              <span
                key={tag}
                className="text-white/50 text-[11px] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Swipe hint (fades out) */}
      <motion.div
        className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none"
        initial={{ opacity: 0.8, y: 0 }}
        animate={{ opacity: 0, y: -10 }}
        transition={{ delay: 2.5, duration: 1.5 }}
      >
        <div className="flex flex-col items-center gap-1">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.2, repeat: 2 }}
            className="w-1 h-6 rounded-full bg-white/30"
          />
          <span className="text-white/40 text-[10px]">Swipe up</span>
        </div>
      </motion.div>

      {/* Double-tap heart animation */}
      <AnimatePresence>
        {showHeartAnimation && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.4 }}
          >
            <Heart size={80} className="text-red-500" fill="currentColor" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SparkOverlay;
