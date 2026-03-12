'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lock, Check, Crown } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/i18n';
import {
  ALL_FRAMES, isFrameUnlocked, FRAME_COLORS, FOUNDER_FRAME_COLORS,
  GM_FRAME_COLORS, isGmFrame,
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
  const { session } = useAuth();
  const userEmail = session?.user?.email ?? null;

  // Split frames into regular and GM-exclusive
  const { regularFrames, gmFrames } = useMemo(() => {
    const regular: { frame: FrameDefinition; unlocked: boolean; equipped: boolean }[] = [];
    const gm: { frame: FrameDefinition; unlocked: boolean; equipped: boolean }[] = [];

    for (const frame of ALL_FRAMES) {
      const item = {
        frame,
        unlocked: isFrameUnlocked(frame, level, isSupporter, userEmail),
        equipped: equippedFrameId === frame.id,
      };
      if (frame.isGmExclusive) {
        // Only show GM frames to the GM user
        if (item.unlocked) gm.push(item);
      } else {
        regular.push(item);
      }
    }
    return { regularFrames: regular, gmFrames: gm };
  }, [level, isSupporter, equippedFrameId, userEmail]);

  const handleEquip = (frameId: EquippableFrameId) => {
    if (equippedFrameId === frameId) {
      equipFrame(null);
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
        {regularFrames.map(({ frame, unlocked, equipped }) => (
          <FrameCard
            key={frame.id}
            frame={frame}
            unlocked={unlocked}
            equipped={equipped}
            onEquip={() => handleEquip(frame.id)}
          />
        ))}
      </div>

      {/* GM-exclusive frames section */}
      {gmFrames.length > 0 && (
        <>
          <div className="flex items-center gap-2 mt-6 mb-3">
            <Crown className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-medium uppercase tracking-wider text-amber-400/80">
              Prestige Collection
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {gmFrames.map(({ frame, unlocked, equipped }) => (
              <GmFrameCard
                key={frame.id}
                frame={frame}
                unlocked={unlocked}
                equipped={equipped}
                onEquip={() => handleEquip(frame.id)}
              />
            ))}
          </div>
        </>
      )}

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

function GmFrameCard({
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
  const gmColors = isGmFrame(frame.id) ? GM_FRAME_COLORS[frame.id] : null;
  if (!gmColors) return null;

  return (
    <motion.button
      onClick={() => unlocked && onEquip()}
      disabled={!unlocked}
      className={`relative rounded-xl p-4 border transition-colors text-left overflow-hidden ${
        equipped
          ? 'border-transparent bg-stone-800/80'
          : 'border-stone-700/30 bg-stone-900/60 hover:bg-stone-800/60'
      }`}
      whileTap={unlocked ? { scale: 0.97 } : undefined}
    >
      {/* Animated gradient border for GM frames */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: gmColors.gradient,
          maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: equipped ? 2 : 1,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-20"
        style={{ background: `radial-gradient(ellipse at center, ${gmColors.glow}, transparent 70%)` }}
      />

      {/* Frame preview ring */}
      <div className="relative flex items-center gap-3 mb-2">
        <div className="relative w-10 h-10">
          {/* Animated ring preview */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: gmColors.gradient }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-[2px] rounded-full bg-stone-900 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-stone-800" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium" style={{ color: gmColors.primary }}>
            {frame.label}
          </div>
          <div className="text-[10px] text-amber-400/60">
            GM Exclusive
          </div>
        </div>
      </div>

      {/* Equipped indicator */}
      {equipped && (
        <motion.div
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: gmColors.gradient }}
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
