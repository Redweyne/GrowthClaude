'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lock, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useTranslation } from '@/i18n';
import {
  ALL_FRAMES, isFrameUnlocked, FRAME_COLORS, FOUNDER_FRAME_COLORS,
  type FrameDefinition, type EquippableFrameId,
} from '@/types/profile';

interface FramesTabProps {
  level: number;
  isSupporter: boolean;
}

export function FramesTab({ level, isSupporter }: FramesTabProps) {
  const equippedFrameId = useStore(s => s.equippedFrameId);
  const equipFrame = useStore(s => s.equipFrame);
  const { t } = useTranslation();

  const frames = useMemo(() => {
    return ALL_FRAMES.map(frame => ({
      frame,
      unlocked: isFrameUnlocked(frame, level, isSupporter),
      equipped: equippedFrameId === frame.id,
    }));
  }, [level, isSupporter, equippedFrameId]);

  const handleEquip = (frameId: EquippableFrameId) => {
    if (equippedFrameId === frameId) {
      equipFrame(null); // unequip
    } else {
      equipFrame(frameId);
    }
  };

  return (
    <div className="px-5 mt-5 pb-4">
      <h3 className="text-sm font-medium uppercase tracking-wider text-stone-500 mb-1">
        {t('profilePage.frames')}
      </h3>
      <p className="text-xs text-stone-600 mb-4">
        {t('profilePage.framesDesc')}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {frames.map(({ frame, unlocked, equipped }) => (
          <FrameCard
            key={frame.id}
            frame={frame}
            unlocked={unlocked}
            equipped={equipped}
            onEquip={() => handleEquip(frame.id)}
          />
        ))}
      </div>

      {/* Auto frame note */}
      <div className="mt-4 p-3 rounded-lg bg-stone-900/40 border border-stone-800/30">
        <p className="text-[11px] text-stone-500 text-center">
          {equippedFrameId
            ? t('profilePage.frameEquippedNote')
            : t('profilePage.frameAutoNote')}
        </p>
      </div>
    </div>
  );
}

function FrameCard({
  frame,
  unlocked,
  equipped,
  onEquip,
}: {
  frame: FrameDefinition;
  unlocked: boolean;
  equipped: boolean;
  onEquip: () => void;
}) {
  const colors = frame.id === 'founder' ? FOUNDER_FRAME_COLORS : FRAME_COLORS[frame.tier];
  const { t } = useTranslation();

  return (
    <motion.button
      onClick={() => unlocked && onEquip()}
      disabled={!unlocked}
      className={`relative rounded-xl p-4 border transition-colors text-left ${
        equipped
          ? 'border-amber-700/50 bg-stone-800/80'
          : unlocked
            ? 'border-stone-700/50 bg-stone-900/60 hover:bg-stone-800/60'
            : 'border-stone-800/30 bg-stone-900/30 opacity-50 cursor-not-allowed'
      }`}
      whileTap={unlocked ? { scale: 0.97 } : undefined}
    >
      {/* Frame preview ring */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: unlocked
              ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
              : 'rgba(41,37,36,0.6)',
            boxShadow: unlocked ? `0 0 12px ${colors.glow}` : 'none',
          }}
        >
          {unlocked ? (
            <div className="w-6 h-6 rounded-full bg-stone-900" />
          ) : (
            <Lock className="w-4 h-4 text-stone-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-stone-200">{frame.label}</div>
          <div className="text-[10px] text-stone-500">
            {frame.isSupporterExclusive
              ? t('profilePage.supporterExclusive')
              : `${t('profilePage.level')} ${frame.minLevel}+`}
          </div>
        </div>
      </div>

      {/* Equipped indicator */}
      {equipped && (
        <motion.div
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'var(--profile-accent, #fbbf24)' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
        >
          <Check className="w-3 h-3 text-stone-900" />
        </motion.div>
      )}
    </motion.button>
  );
}
