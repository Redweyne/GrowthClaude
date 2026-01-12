'use client';

// ============================================================================
// SHAREABLE STORY CARD
// Beautiful, exportable cards for sharing your transformation on social media.
// Designed to make people curious about your journey.
// ============================================================================

import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, X, Quote } from 'lucide-react';
import { ShareableStoryCard as ShareableStoryCardType } from '@/types/story';

interface ShareableStoryCardProps {
  card: ShareableStoryCardType;
  onClose: () => void;
}

export function ShareableStoryCard({ card, onClose }: ShareableStoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Get background gradient
  const backgroundStyle = {
    background: `linear-gradient(135deg, ${card.theme.background.join(', ')})`
  };

  // Handle copy to clipboard (simplified - no canvas export to avoid dependency)
  const handleDownload = useCallback(async () => {
    const shareText = createShareText();
    try {
      await navigator.clipboard.writeText(shareText);
      // Could show a toast notification here
    } catch {
      handleShare();
    }
  }, [card]);

  // Create shareable text
  const createShareText = () => {
    let text = `${card.title}\n\n`;
    text += card.stats.map(s => `${s.icon} ${s.value} ${s.label}`).join('\n');
    if (card.quote) {
      text += `\n\n"${card.quote.text}"\n${card.quote.attribution}`;
    }
    text += `\n\n${card.period}\n\n#TransformationHub #PersonalGrowth`;
    return text;
  };

  // Handle native share
  const handleShare = useCallback(async () => {
    const shareText = `${card.title}\n\n${card.stats.map(s => `${s.icon} ${s.value} ${s.label}`).join('\n')}\n\n#TransformationHub #PersonalGrowth`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: card.title,
          text: shareText
        });
      } catch (error) {
        // User cancelled or share failed - fallback to clipboard
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  }, [card]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could show a toast here
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="flex flex-col items-center gap-6 max-w-md w-full">
        {/* The Card */}
        <div
          ref={cardRef}
          className="w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
          style={backgroundStyle}
        >
          {/* Pattern overlay */}
          {card.theme.pattern === 'geometric' && (
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            />
          )}
          {card.theme.pattern === 'organic' && (
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'radial-gradient(circle at 25% 25%, white 2%, transparent 2%), radial-gradient(circle at 75% 75%, white 2%, transparent 2%)',
                backgroundSize: '50px 50px'
              }}
            />
          )}

          <div className="relative h-full flex flex-col p-8">
            {/* Header */}
            <div className="mb-auto">
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: card.theme.textColor }}
              >
                {card.title}
              </h2>
              <p
                className="text-sm opacity-70"
                style={{ color: card.theme.textColor }}
              >
                {card.subtitle}
              </p>
            </div>

            {/* Stats */}
            <div className="flex justify-between mb-8">
              {card.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div
                    className="text-3xl font-bold"
                    style={{ color: card.theme.accentColor }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs opacity-60"
                    style={{ color: card.theme.textColor }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Quote (if available) */}
            {card.quote && (
              <div className="mb-8">
                <Quote
                  className="w-6 h-6 mb-2 opacity-30"
                  style={{ color: card.theme.textColor }}
                />
                <p
                  className="text-sm italic opacity-80 leading-relaxed"
                  style={{ color: card.theme.textColor }}
                >
                  "{card.quote.text}"
                </p>
                <p
                  className="text-xs opacity-50 mt-2"
                  style={{ color: card.theme.textColor }}
                >
                  {card.quote.attribution}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span
                className="text-xs opacity-50"
                style={{ color: card.theme.textColor }}
              >
                {card.period}
              </span>
              <span
                className="text-xs font-medium opacity-70"
                style={{ color: card.theme.accentColor }}
              >
                Transformation Hub
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-900 font-medium hover:bg-gray-100 transition-colors"
          >
            <Download className="w-5 h-5" />
            Copy Text
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
        </div>

        <p className="text-white/40 text-sm text-center">
          Copy to clipboard or share directly to social media
        </p>
      </div>
    </motion.div>
  );
}
