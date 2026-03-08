'use client';

import { motion } from 'framer-motion';
import { memo, useMemo, useState, useEffect, useCallback } from 'react';
import { WorldOrb } from './WorldOrb';
import { worldsDisplayData } from '@/content/worldsData';

// ═══════════════════════════════════════════════════════════════════════════
// TWINKLING STAR
// Individual star that fades in and out
// ═══════════════════════════════════════════════════════════════════════════

const TwinklingStar = memo(function TwinklingStar({
  x, y, size, delay, duration,
}: { x: number; y: number; size: number; delay: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0.1))',
        boxShadow: `0 0 ${size * 2}px rgba(255,255,255,0.3)`,
      }}
      animate={{
        opacity: [0.2, 0.8, 0.2],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// NEBULA CLOUD
// Soft colored gradient cloud for cosmic atmosphere
// ═══════════════════════════════════════════════════════════════════════════

const NebulaCloud = memo(function NebulaCloud({
  color, x, y, width, height, blur, opacity,
}: { color: string; x: number; y: number; width: number; height: number; blur: number; opacity: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        background: `radial-gradient(ellipse at center, ${color}, transparent 70%)`,
        filter: `blur(${blur}px)`,
        opacity,
      }}
      animate={{
        x: [0, 15, -10, 0],
        y: [0, -10, 8, 0],
        opacity: [opacity, opacity * 1.2, opacity * 0.8, opacity],
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// COSMIC BACKGROUND
// Starfield + nebula clouds for the worlds page
// ═══════════════════════════════════════════════════════════════════════════

const CosmicBackground = memo(function CosmicBackground() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const mobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent) ||
      window.matchMedia('(max-width: 768px)').matches;
    setIsMobile(mobile);
  }, []);

  const starCount = prefersReducedMotion ? 0 : (isMobile ? 40 : 80);

  const stars = useMemo(() =>
    Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      delay: Math.random() * 6,
      duration: 3 + Math.random() * 4,
    })),
  [starCount]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Deep space gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, #0f0d1a 0%, #080612 30%, #040208 60%, #020106 100%)',
        }}
      />

      {/* Nebula clouds */}
      <NebulaCloud color="rgba(88, 28, 135, 0.15)" x={-10} y={10} width={60} height={50} blur={60} opacity={0.6} />
      <NebulaCloud color="rgba(30, 58, 138, 0.12)" x={50} y={-5} width={55} height={45} blur={50} opacity={0.5} />
      <NebulaCloud color="rgba(120, 53, 15, 0.1)" x={20} y={55} width={50} height={40} blur={55} opacity={0.4} />
      <NebulaCloud color="rgba(88, 28, 135, 0.08)" x={60} y={60} width={45} height={35} blur={45} opacity={0.35} />

      {/* Twinkling stars */}
      {stars.map((star) => (
        <TwinklingStar key={star.id} {...star} />
      ))}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  );
});

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
