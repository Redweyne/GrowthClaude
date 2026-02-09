'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, Share2, Volume2, VolumeX, X, Zap } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { useHaptics } from '@/hooks/useHaptics';
import type { SparkVideo } from '@/types/spark';
import { SPARK_CATEGORY_INFO } from '@/types/spark';

interface SparkOverlayProps {
  video: SparkVideo;
  videoIndex: number;
  totalVideos: number;
  isSaved: boolean;
  soundEnabled: boolean;
  videosWatchedSession: number;
  onSave: () => void;
  onToggleSound: () => void;
  onExit: () => void;
}

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  children: ReactNode;
}

function ActionButton({ label, onClick, children }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-1.5 active:scale-90 transition-transform"
      aria-label={label}
    >
      <div className="w-12 h-12 rounded-full bg-black/35 border border-white/10 backdrop-blur-sm flex items-center justify-center">
        {children}
      </div>
      <span className="text-white/75 text-[10px] font-medium">{label}</span>
    </button>
  );
}

export function SparkOverlay({
  video,
  videoIndex,
  totalVideos,
  isSaved,
  soundEnabled,
  videosWatchedSession,
  onSave,
  onToggleSound,
  onExit,
}: SparkOverlayProps) {
  const [showSavePulse, setShowSavePulse] = useState(false);
  const [shareStatus, setShareStatus] = useState<'copied' | 'shared' | null>(null);

  const audio = useAudio();
  const { hapticTap, hapticMedium } = useHaptics();

  const categoryInfo = SPARK_CATEGORY_INFO[video.category];

  const creatorHandle = useMemo(() => {
    if (!video.creatorName) return null;
    return video.creatorName.replace(/\s+/g, '').toLowerCase();
  }, [video.creatorName]);

  const showShareFeedback = useCallback((status: 'copied' | 'shared') => {
    setShareStatus(status);
    window.setTimeout(() => {
      setShareStatus(null);
    }, 1300);
  }, []);

  const handleSave = useCallback(() => {
    onSave();

    if (!isSaved) {
      setShowSavePulse(true);
      window.setTimeout(() => {
        setShowSavePulse(false);
      }, 650);
      audio.playTapConfirm();
      hapticMedium();
      return;
    }

    audio.playTap();
    hapticTap();
  }, [onSave, isSaved, audio, hapticMedium, hapticTap]);

  const handleShare = useCallback(async () => {
    const shareUrl = `https://www.youtube.com/shorts/${video.youtubeId}`;
    const shareText = video.caption || 'Check this spark from the app.';

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Spark',
          text: shareText,
          url: shareUrl,
        });

        audio.playTapConfirm();
        hapticMedium();
        showShareFeedback('shared');
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        audio.playTapConfirm();
        hapticMedium();
        showShareFeedback('copied');
        return;
      }

      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      audio.playTap();
      hapticTap();
      showShareFeedback('shared');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      audio.playTap();
      hapticTap();
    }
  }, [video.youtubeId, video.caption, audio, hapticMedium, hapticTap, showShareFeedback]);

  const handleToggleSound = useCallback(() => {
    onToggleSound();
    audio.playTap();
    hapticTap();
  }, [onToggleSound, audio, hapticTap]);

  return (
    <div className="absolute inset-0 z-40 pointer-events-none select-none">
      <div
        className="absolute top-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 65%, transparent 100%)',
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0 h-56"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 45%, transparent 100%)',
        }}
      />

      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pointer-events-auto"
        style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}
      >
        <button
          type="button"
          onClick={onExit}
          className="w-10 h-10 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white active:scale-90 transition-transform"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm text-[11px] text-white/85 font-semibold tracking-wide">
            {videoIndex + 1} / {totalVideos}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm">
            <Zap size={12} className="text-amber-400" />
            <span className="text-white/85 text-[11px] font-semibold">{videosWatchedSession}</span>
          </div>
        </div>
      </div>

      <div
        className="absolute right-3 flex flex-col items-center gap-6 pointer-events-auto"
        style={{ bottom: 'calc(8.75rem + env(safe-area-inset-bottom))' }}
      >
        <div className="relative">
          <ActionButton label={isSaved ? 'Saved' : 'Save'} onClick={handleSave}>
            {isSaved ? (
              <BookmarkCheck size={23} className="text-amber-400" />
            ) : (
              <Bookmark size={23} className="text-white" />
            )}
          </ActionButton>

          <AnimatePresence>
            {showSavePulse && (
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-amber-400"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 1.85, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </AnimatePresence>
        </div>

        <ActionButton label="Share" onClick={handleShare}>
          <Share2 size={22} className="text-white" />
        </ActionButton>

        <ActionButton label={soundEnabled ? 'Sound on' : 'Sound off'} onClick={handleToggleSound}>
          {soundEnabled ? (
            <Volume2 size={22} className="text-emerald-300" />
          ) : (
            <VolumeX size={22} className="text-white" />
          )}
        </ActionButton>

        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-black/35 border border-white/10 backdrop-blur-sm flex items-center justify-center">
            <span className="text-xl" role="img" aria-label={categoryInfo.label}>{categoryInfo.emoji}</span>
          </div>
          <span className="text-white/75 text-[10px] font-medium">{categoryInfo.label}</span>
        </div>
      </div>

      <div
        className="absolute left-4 right-20 pointer-events-auto"
        style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
      >
        {creatorHandle && (
          <p className="text-white text-[15px] font-bold mb-1.5 drop-shadow-lg">@{creatorHandle}</p>
        )}

        {video.caption && (
          <p className="text-white/90 text-[13px] leading-[1.4] drop-shadow-lg mb-2 line-clamp-3">{video.caption}</p>
        )}

        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {video.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-white/60 text-[11px] font-medium">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      <motion.div
        className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none"
        initial={{ opacity: 0.8, y: 0 }}
        animate={{ opacity: 0, y: -10 }}
        transition={{ delay: 2.4, duration: 1.4 }}
      >
        <div className="flex flex-col items-center gap-1">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.1, repeat: 2 }}
            className="w-1 h-6 rounded-full bg-white/35"
          />
          <span className="text-white/45 text-[10px] font-medium">Swipe up</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {shareStatus && (
          <motion.div
            className="absolute top-[max(5rem,calc(2.75rem+env(safe-area-inset-top)))] left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/60 border border-white/15 text-xs text-white/90 backdrop-blur-md"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {shareStatus === 'copied' ? 'Link copied' : 'Shared'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SparkOverlay;
