'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bookmark,
  BookmarkCheck,
  Share2,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { useHaptics } from '@/hooks/useHaptics';
import type { SparkVideo } from '@/types/spark';
import { useTranslation } from '@/i18n';

interface SparkOverlayProps {
  video: SparkVideo;
  isSaved: boolean;
  soundEnabled: boolean;
  onSave: () => void;
  onToggleSound: () => void;
  onExit: () => void;
}

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  children: ReactNode;
  active?: boolean;
  testId?: string;
}

function ActionButton({ label, onClick, children, active = false, testId }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform"
      aria-label={label}
      data-testid={testId}
    >
      <div
        className={`w-12 h-12 rounded-full border backdrop-blur-sm flex items-center justify-center ${
          active
            ? 'bg-emerald-500/25 border-emerald-300/50'
            : 'bg-black/35 border-white/15'
        }`}
      >
        {children}
      </div>
      <span className="text-white/80 text-[10px] font-medium">{label}</span>
    </button>
  );
}

export function SparkOverlay({
  video,
  isSaved,
  soundEnabled,
  onSave,
  onToggleSound,
  onExit,
}: SparkOverlayProps) {
  const { locale } = useTranslation();
  const [savePulse, setSavePulse] = useState(false);
  const [shareStatus, setShareStatus] = useState<'copied' | 'shared' | null>(null);

  const audio = useAudio();
  const { hapticTap, hapticMedium } = useHaptics();

  const copy = {
    en: {
      closeSpark: 'Close Spark',
      save: 'Save',
      saved: 'Saved',
      share: 'Share',
      soundOn: 'Sound on',
      soundOff: 'Sound off',
      shareFallbackText: 'Check this Spark video.',
      sparkTitle: 'Spark',
      linkCopied: 'Link copied',
      shared: 'Shared',
    },
    fr: {
      closeSpark: 'Fermer Spark',
      save: 'Enregistrer',
      saved: 'Enregistré',
      share: 'Partager',
      soundOn: 'Son activé',
      soundOff: 'Son désactivé',
      shareFallbackText: 'Regarde cette vidéo Spark.',
      sparkTitle: 'Spark',
      linkCopied: 'Lien copié',
      shared: 'Partagé',
    },
    ar: {
      closeSpark: 'إغلاق Spark',
      save: 'حفظ',
      saved: 'تم الحفظ',
      share: 'مشاركة',
      soundOn: 'الصوت مفعّل',
      soundOff: 'الصوت متوقف',
      shareFallbackText: 'شاهد فيديو Spark هذا.',
      sparkTitle: 'Spark',
      linkCopied: 'تم نسخ الرابط',
      shared: 'تمت المشاركة',
    },
  } as const;
  const c = copy[locale] ?? copy.en;

  const creatorHandle = useMemo(() => {
    if (!video.creatorName) return null;
    return video.creatorName.replace(/\s+/g, '').toLowerCase();
  }, [video.creatorName]);

  const showShareStatus = useCallback((status: 'copied' | 'shared') => {
    setShareStatus(status);
    window.setTimeout(() => {
      setShareStatus(null);
    }, 1200);
  }, []);

  const handleSave = useCallback(() => {
    onSave();

    if (!isSaved) {
      setSavePulse(true);
      window.setTimeout(() => {
        setSavePulse(false);
      }, 580);
      audio.playTapConfirm();
      hapticMedium();
      return;
    }

    audio.playTap();
    hapticTap();
  }, [audio, hapticMedium, hapticTap, isSaved, onSave]);

  const handleShare = useCallback(async () => {
    const url = `https://www.youtube.com/shorts/${video.youtubeId}`;
    const text = video.caption || c.shareFallbackText;

    try {
      if (navigator.share) {
        await navigator.share({
          title: c.sparkTitle,
          text,
          url,
        });
        showShareStatus('shared');
        audio.playTapConfirm();
        hapticMedium();
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        showShareStatus('copied');
        audio.playTapConfirm();
        hapticMedium();
        return;
      }

      window.open(url, '_blank', 'noopener,noreferrer');
      showShareStatus('shared');
      audio.playTap();
      hapticTap();
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      audio.playTap();
      hapticTap();
    }
  }, [audio, c.shareFallbackText, c.sparkTitle, hapticMedium, hapticTap, showShareStatus, video.caption, video.youtubeId]);

  const handleToggleSound = useCallback(() => {
    onToggleSound();
    audio.playTap();
    hapticTap();
  }, [audio, hapticTap, onToggleSound]);

  return (
    <div className="absolute inset-0 z-40 pointer-events-none select-none">
      <div
        className="absolute top-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.26) 62%, transparent 100%)',
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0 h-56"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.44) 45%, transparent 100%)',
        }}
      />

      <div
        className="absolute top-0 left-0 right-0 p-4 pointer-events-auto flex items-center justify-between"
        style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}
      >
        <button
          type="button"
          onClick={onExit}
          className="w-10 h-10 rounded-full bg-black/45 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white active:scale-90 transition-transform"
          aria-label={c.closeSpark}
          data-testid="spark-close-btn"
        >
          <X size={18} />
        </button>

      </div>

      <div
        className="absolute right-3 pointer-events-auto flex flex-col items-center gap-6"
        style={{ bottom: 'calc(8.75rem + env(safe-area-inset-bottom))' }}
      >
        <div className="relative">
          <ActionButton label={isSaved ? c.saved : c.save} onClick={handleSave} testId="spark-save-btn">
            {isSaved ? (
              <BookmarkCheck size={22} className="text-amber-300" />
            ) : (
              <Bookmark size={22} className="text-white" />
            )}
          </ActionButton>

          <AnimatePresence>
            {savePulse && (
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-amber-300"
                initial={{ opacity: 0.85, scale: 1 }}
                animate={{ opacity: 0, scale: 1.85 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              />
            )}
          </AnimatePresence>
        </div>

        <ActionButton label={c.share} onClick={handleShare} testId="spark-share-btn">
          <Share2 size={21} className="text-white" />
        </ActionButton>

        <ActionButton
          label={soundEnabled ? c.soundOn : c.soundOff}
          onClick={handleToggleSound}
          active={soundEnabled}
          testId="spark-sound-btn"
        >
          {soundEnabled ? (
            <Volume2 size={21} className="text-emerald-100" />
          ) : (
            <VolumeX size={21} className="text-white" />
          )}
        </ActionButton>

      </div>

      <div
        className="absolute left-4 right-20 pointer-events-auto"
        style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
      >
        {creatorHandle && (
          <p className="text-white text-[15px] font-bold mb-1.5 drop-shadow-lg">@{creatorHandle}</p>
        )}

        {video.caption && (
          <p className="text-white/92 text-[13px] leading-[1.45] mb-2 drop-shadow-lg line-clamp-3">{video.caption}</p>
        )}

      </div>

      <AnimatePresence>
        {shareStatus && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-[max(5rem,calc(2.7rem+env(safe-area-inset-top)))] px-3 py-1.5 rounded-full bg-black/65 border border-white/15 text-white/90 text-xs font-medium backdrop-blur-md"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {shareStatus === 'copied' ? c.linkCopied : c.shared}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SparkOverlay;
