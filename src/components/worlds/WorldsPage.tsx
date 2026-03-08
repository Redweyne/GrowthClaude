'use client';

import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';
import { WorldOrb } from './WorldOrb';
import { worldsDisplayData } from '@/content/worldsData';
import { CosmicBackground } from '@/components/effects/CosmicBackground';

// ═══════════════════════════════════════════════════════════════════════════
// WORLDS PAGE
// Main page component with header, scrollable world grid, and cosmic bg
// ═══════════════════════════════════════════════════════════════════════════

interface WorldsPageProps {
  locale: string;
  completedLessons: Record<string, boolean>;
  onContinueJourney: () => void;
  copy: {
    title: string;
    subtitle: string;
    continueJourney: string;
    comingSoon: string;
    locked: string;
    lessons: string;
  };
}

export const WorldsPage = memo(function WorldsPage({
  locale,
  completedLessons,
  onContinueJourney,
  copy,
}: WorldsPageProps) {
  const sortedWorlds = useMemo(
    () => [...worldsDisplayData].sort((a, b) => a.order - b.order),
    []
  );

  const featuredWorld = sortedWorlds.find(w => w.status === 'active') || sortedWorlds[0];
  const otherWorlds = sortedWorlds.filter(w => w.id !== featuredWorld.id);

  // Count completed lessons for the active world
  const activeCompletedCount = useMemo(() => {
    let count = 0;
    for (const key of Object.keys(completedLessons)) {
      if (completedLessons[key]) count++;
    }
    return count;
  }, [completedLessons]);

  return (
    <div className="relative flex-1 min-h-0 overflow-y-auto overscroll-contain">
      {/* Cosmic background */}
      <CosmicBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center min-h-full px-4 pb-8"
        style={{ paddingTop: 'max(24px, env(safe-area-inset-top))' }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{
              fontFamily: 'var(--font-display), Georgia, serif',
              fontStyle: 'italic',
              color: '#fef3c7',
              textShadow: '0 0 30px rgba(251, 191, 36, 0.15)',
            }}
          >
            {copy.title}
          </h1>
          <p className="text-stone-400 text-sm sm:text-base mt-2 max-w-xs mx-auto leading-relaxed"
            style={{ fontStyle: 'italic' }}
          >
            {copy.subtitle}
          </p>
        </motion.div>

        {/* Featured world (center, larger) */}
        <div className="mb-6">
          <WorldOrb
            world={featuredWorld}
            locale={locale}
            completedLessons={activeCompletedCount}
            featured
            index={0}
            onContinue={onContinueJourney}
            continueLabel={copy.continueJourney}
            comingSoonLabel={copy.comingSoon}
            lockedLabel={copy.locked}
            lessonsLabel={copy.lessons}
          />
        </div>

        {/* Other worlds in a 2-column grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 max-w-sm mx-auto">
          {otherWorlds.map((world, i) => (
            <WorldOrb
              key={world.id}
              world={world}
              locale={locale}
              index={i + 1}
              continueLabel={copy.continueJourney}
              comingSoonLabel={copy.comingSoon}
              lockedLabel={copy.locked}
              lessonsLabel={copy.lessons}
            />
          ))}
        </div>

        {/* Bottom spacer for more worlds in future */}
        <div className="mt-8 mb-4 flex flex-col items-center gap-2">
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === 0 ? 'bg-amber-400/80' : 'bg-stone-600/50'
                }`}
              />
            ))}
          </div>
          <p className="text-stone-600 text-xs italic">
            {locale === 'fr' ? 'Plus de mondes bientôt...' :
             locale === 'ar' ? 'المزيد من العوالم قريباً...' :
             'More worlds coming soon...'}
          </p>
        </div>
      </div>
    </div>
  );
});

export default WorldsPage;
