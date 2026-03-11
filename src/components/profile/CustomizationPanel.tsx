'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, ChevronDown, ChevronUp, Lock, Eye, EyeOff } from 'lucide-react';
import { ACCENT_COLORS, BANNER_PRESETS, ALL_TITLES, type ProfileAccentColor } from '@/types/profile';
import { getUnlockedTitles, buildTitleContext } from '@/lib/titleEngine';
import { useStore } from '@/store/useStore';
import { getLevelFromXp } from '@/types';
import { useTranslation } from '@/i18n';

interface CustomizationPanelProps {
  completedWorldSlugs: string[];
  totalEchoesSent: number;
}

export function CustomizationPanel({ completedWorldSlugs, totalEchoesSent }: CustomizationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    accentColor, setAccentColor,
    bannerKey, setBannerKey,
    motto, setMotto,
    equippedTitleId, equipTitle,
    profileVisibleInEchoes, setProfileVisibility,
    longestStreak, identityStatements, isSupporter, totalXp,
  } = useStore();

  const { t } = useTranslation();
  const level = getLevelFromXp(totalXp).level;

  const titleCtx = useMemo(() => buildTitleContext(
    { longestStreak, identityStatements, isSupporter, totalXp },
    completedWorldSlugs, totalEchoesSent, level,
  ), [longestStreak, identityStatements, isSupporter, totalXp, completedWorldSlugs, totalEchoesSent, level]);

  const unlockedTitles = useMemo(() => getUnlockedTitles(titleCtx), [titleCtx]);
  const unlockedTitleIds = new Set(unlockedTitles.map(t => t.id));

  return (
    <motion.div
      className="px-5 mt-6"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65 }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full text-left group"
      >
        <Palette className="w-4 h-4 text-amber-500/60" />
        <span className="text-sm font-medium text-stone-300 light:text-stone-600 group-hover:text-amber-300 transition-colors">
          {t('profilePage.customize')}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-stone-500 ml-auto" />
        ) : (
          <ChevronDown className="w-4 h-4 text-stone-500 ml-auto" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-5">
              {/* Accent Color */}
              <div>
                <label className="text-xs text-stone-500 uppercase tracking-wider mb-2 block">
                  {t('profilePage.accentColor')}
                </label>
                <div className="flex gap-3">
                  {(Object.entries(ACCENT_COLORS) as [ProfileAccentColor, typeof ACCENT_COLORS[ProfileAccentColor]][]).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setAccentColor(key)}
                      className="relative"
                    >
                      <div
                        className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                        style={{ backgroundColor: val.primary }}
                      />
                      {accentColor === key && (
                        <motion.div
                          className="absolute -inset-1 rounded-full border-2"
                          style={{ borderColor: val.primary }}
                          layoutId="accentRing"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs text-stone-500 uppercase tracking-wider mb-2 block">
                  {t('profilePage.title')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_TITLES.map(title => {
                    const isUnlocked = unlockedTitleIds.has(title.id);
                    const isEquipped = equippedTitleId === title.id;
                    return (
                      <button
                        key={title.id}
                        onClick={() => isUnlocked && equipTitle(isEquipped ? null : title.id)}
                        disabled={!isUnlocked}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isEquipped
                            ? 'bg-amber-900/50 text-amber-300 border border-amber-700/40'
                            : isUnlocked
                              ? 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-stone-700'
                              : 'bg-stone-900/40 text-stone-700 border border-stone-800/30 cursor-not-allowed'
                        }`}
                      >
                        {isUnlocked ? title.label : (
                          <span className="flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            {title.label}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Banner / Aura */}
              <div>
                <label className="text-xs text-stone-500 uppercase tracking-wider mb-2 block">
                  {t('profilePage.banner')}
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {/* Auto-aura option */}
                  <button
                    onClick={() => setBannerKey(null)}
                    className={`flex-shrink-0 w-16 h-10 rounded-lg text-[9px] font-medium transition-colors ${
                      bannerKey === null
                        ? 'bg-amber-900/40 text-amber-300 border border-amber-700/40'
                        : 'bg-stone-800 text-stone-400 hover:bg-stone-700 border border-stone-700'
                    }`}
                  >
                    {t('profilePage.autoAura')}
                  </button>
                  {BANNER_PRESETS.map(preset => {
                    const locked = preset.isSupporterExclusive && !isSupporter;
                    return (
                      <button
                        key={preset.key}
                        onClick={() => !locked && setBannerKey(preset.key)}
                        disabled={locked}
                        className={`relative flex-shrink-0 w-16 h-10 rounded-lg overflow-hidden border transition-colors ${
                          bannerKey === preset.key
                            ? 'border-amber-700/40 ring-1 ring-amber-600/30'
                            : locked
                              ? 'border-stone-800/30 opacity-40 cursor-not-allowed'
                              : 'border-stone-700 hover:border-stone-600'
                        }`}
                      >
                        <div
                          className="w-full h-full"
                          style={{ background: preset.gradient }}
                        />
                        {locked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-stone-950/60">
                            <Lock className="w-3 h-3 text-stone-500" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Motto */}
              <div>
                <label className="text-xs text-stone-500 uppercase tracking-wider mb-2 block">
                  {t('profilePage.motto')}
                </label>
                <input
                  type="text"
                  value={motto || ''}
                  onChange={(e) => setMotto(e.target.value || null)}
                  maxLength={120}
                  placeholder={t('profilePage.mottoPlaceholder')}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-700/50 transition-colors"
                />
                <div className="text-[10px] text-stone-600 mt-1 text-right">
                  {(motto?.length || 0)}/120
                </div>
              </div>

              {/* Echo Visibility */}
              <div>
                <label className="text-xs text-stone-500 uppercase tracking-wider mb-2 block">
                  {t('profilePage.echoVisibility')}
                </label>
                <button
                  onClick={() => setProfileVisibility(!profileVisibleInEchoes)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border transition-colors ${
                    profileVisibleInEchoes
                      ? 'bg-amber-900/30 border-amber-700/40 text-amber-200'
                      : 'bg-stone-800 border-stone-700 text-stone-400'
                  }`}
                >
                  {profileVisibleInEchoes ? (
                    <Eye className="w-4 h-4 text-amber-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-stone-500" />
                  )}
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">
                      {profileVisibleInEchoes ? t('profilePage.visibleInEchoes') : t('profilePage.hiddenInEchoes')}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {profileVisibleInEchoes
                        ? t('profilePage.visibleDesc')
                        : t('profilePage.hiddenDesc')}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
