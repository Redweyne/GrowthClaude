'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, X, Check } from 'lucide-react';
import type { ShareableProfileData } from '@/types/profile';
import { FRAME_COLORS, getFrameTier } from '@/types/profile';
import { useTranslation } from '@/i18n';

interface ShareableCardProps {
  data: ShareableProfileData;
}

export function ShareableCard({ data }: ShareableCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useTranslation();

  const generateCard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 600;
    const H = 400;
    canvas.width = W;
    canvas.height = H;

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#0a0908');
    bgGrad.addColorStop(1, '#1c1917');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle gold accent line at top
    const frameColors = FRAME_COLORS[data.frameTier];
    ctx.fillStyle = frameColors.primary;
    ctx.fillRect(0, 0, W, 3);

    // Avatar circle
    const avatarX = W / 2;
    const avatarY = 90;
    const avatarR = 40;

    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR + 3, 0, Math.PI * 2);
    ctx.fillStyle = frameColors.primary;
    ctx.fill();

    // Draw avatar image or initial fallback
    if (data.avatarUrl) {
      try {
        const img = await loadImage(data.avatarUrl);
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, avatarX - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2);
        ctx.restore();
      } catch {
        drawAvatarFallback(ctx, avatarX, avatarY, avatarR, frameColors.primary, data.name);
      }
    } else {
      drawAvatarFallback(ctx, avatarX, avatarY, avatarR, frameColors.primary, data.name);
    }

    // Name
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 24px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(data.name, W / 2, 155);

    // Title
    if (data.equippedTitle) {
      ctx.fillStyle = '#fbbf2480';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText(`◆ ${data.equippedTitle} ◆`, W / 2, 180);
    }

    // Featured badge pill (below title)
    let nextY = data.equippedTitle ? 195 : 175;
    if (data.featuredBadgeName) {
      ctx.fillStyle = frameColors.primary + '60';
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillText(`★ ${data.featuredBadgeName}`, W / 2, nextY);
      nextY += 20;
    }

    // Stats row
    const statsY = nextY + 10;
    const statsItems = [
      { label: t('profilePage.level'), value: `${data.level}` },
      { label: t('profilePage.streak'), value: `${data.currentStreak}d` },
      { label: data.topBadgeName ? t('profilePage.tabBadges') : t('profilePage.level'), value: data.topBadgeName || data.levelTitle },
    ];

    statsItems.forEach((item, i) => {
      const x = (W / 4) * (i + 1);
      ctx.fillStyle = '#a8a29e';
      ctx.font = '10px system-ui, sans-serif';
      ctx.fillText(item.label.toUpperCase(), x, statsY);
      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.fillText(item.value, x, statsY + 22);
    });

    // Motto
    const contentY = statsY + 55;
    if (data.motto) {
      ctx.fillStyle = '#d6d3d1a0';
      ctx.font = 'italic 13px Georgia, serif';
      const maxWidth = W - 80;
      wrapText(ctx, `"${data.motto}"`, W / 2, contentY, maxWidth, 18);
    }

    // Identity statement (shown below motto, or in its place)
    if (data.identityStatement) {
      const idY = data.motto ? contentY + 30 : contentY;
      ctx.fillStyle = '#d6d3d180';
      ctx.font = 'italic 12px Georgia, serif';
      const maxWidth = W - 80;
      wrapText(ctx, `"${data.identityStatement}"`, W / 2, idY, maxWidth, 18);
    }

    // Supporter badge
    if (data.isSupporter) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('★ SUPPORTER', W - 20, 25);
      ctx.textAlign = 'center';
    }

    // Branding
    ctx.fillStyle = '#78716c';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText('Transformation Hub', W / 2, H - 20);

    return canvas;
  }, [data, t]);

  const handleShare = useCallback(async () => {
    const canvas = await generateCard();
    if (!canvas) return;

    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(b => b ? resolve(b) : reject(new Error('Failed')), 'image/png');
      });

      if (navigator.share && navigator.canShare) {
        const file = new File([blob], 'profile-card.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: t('profilePage.shareYourJourney') });
          return;
        }
      }

      // Fallback: copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail - user cancelled share or clipboard not available
    }
  }, [generateCard]);

  const handleDownload = useCallback(async () => {
    const canvas = await generateCard();
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'profile-card.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [generateCard]);

  return (
    <motion.div
      className="px-5 mt-4"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.68 }}
    >
      <button
        onClick={() => setShowPreview(true)}
        className="flex items-center gap-2 text-sm text-amber-500/60 hover:text-amber-400 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        {t('profilePage.shareProfileCard')}
      </button>

      <canvas ref={canvasRef} className="hidden" />

      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-stone-950/80" onClick={() => setShowPreview(false)} />
            <motion.div
              className="relative bg-stone-900 rounded-2xl border border-stone-800 p-5 w-[340px]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-3 right-3 text-stone-500 hover:text-stone-300"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-display text-amber-100 mb-4">{t('profilePage.shareYourJourney')}</h3>

              {/* Mini preview */}
              <div className="bg-stone-950 rounded-xl p-4 mb-4 text-center">
                <div className="text-lg font-display text-amber-100">{data.name}</div>
                {data.equippedTitle && (
                  <div className="text-xs text-amber-400/60 mt-1">◆ {data.equippedTitle} ◆</div>
                )}
                <div className="flex justify-center gap-6 mt-3 text-xs">
                  <div>
                    <div className="text-stone-500">{t('profilePage.level')}</div>
                    <div className="text-amber-200 font-bold">{data.level}</div>
                  </div>
                  <div>
                    <div className="text-stone-500">{t('profilePage.streak')}</div>
                    <div className="text-amber-200 font-bold">{data.currentStreak}d</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-sm font-medium hover:bg-stone-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {t('profilePage.download')}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-500 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  {copied ? t('profilePage.copied') : t('profilePage.share')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawAvatarFallback(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, name: string) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = '#292524';
  ctx.fill();
  ctx.fillStyle = color;
  ctx.font = 'bold 32px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name.charAt(0).toUpperCase(), x, y);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (const word of words) {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line !== '') {
      ctx.fillText(line.trim(), x, currentY);
      line = word + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}
