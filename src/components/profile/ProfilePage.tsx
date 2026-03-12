'use client';

import { useRef, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroBanner } from './HeroBanner';
import { ProfileStatsRow } from './ProfileStatsRow';
import { BadgeWall } from './BadgeWall';
import { FramesTab } from './FramesTab';
import { IdentityEvolution } from './IdentityEvolution';
import { TransformationTimeline } from './TransformationTimeline';
import { CustomizationPanel } from './CustomizationPanel';
import { QuickActions } from './QuickActions';
import { ShareableCard } from './ShareableCard';
import { useStore } from '@/store/useStore';
import { getEquippedTitleLabel, buildTitleContext, getAutoTitle } from '@/lib/titleEngine';
import { ACCENT_COLORS, ALL_BADGES, getEffectiveFrameTier } from '@/types/profile';
import type { BadgeCheckContext, ShareableProfileData } from '@/types/profile';
import type { TransformationGoal } from '@/types';
import { useTranslation } from '@/i18n';

interface ProfilePageProps {
  name: string;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  level: { level: number; title: string };
  transformationGoal?: string;
  isWeeklyCheckinDue: boolean;
  isMonthlyAssessmentDue: boolean;
  unreadEchoCount: number;
  onClose: () => void;
  onOpenTodayPractice: () => void;
  onOpenWeeklyCheckin: () => void;
  onOpenMonthlyAssessment: () => void;
  onOpenBrowseEchoes: () => void;
  onOpenYourEchoes: () => void;
  onOpenPastLessons: () => void;
  onOpenIdentity: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  completedWorldSlugs: string[];
  totalEchoesSent: number;
}

type ProfileTab = 'overview' | 'frames' | 'badges' | 'journey';

export function ProfilePage({
  name,
  totalXp,
  currentStreak,
  longestStreak,
  level,
  transformationGoal,
  isWeeklyCheckinDue,
  isMonthlyAssessmentDue,
  unreadEchoCount,
  onOpenTodayPractice,
  onOpenWeeklyCheckin,
  onOpenMonthlyAssessment,
  onOpenBrowseEchoes,
  onOpenPastLessons,
  onOpenIdentity,
  onOpenStats,
  onOpenSettings,
  completedWorldSlugs,
  totalEchoesSent,
}: ProfilePageProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const { t } = useTranslation();

  // Store reads
  const avatarUrl = useStore(s => s.avatarUrl);
  const equippedTitleId = useStore(s => s.equippedTitleId);
  const equippedFrameId = useStore(s => s.equippedFrameId);
  const featuredBadgeId = useStore(s => s.featuredBadgeId);
  const isSupporter = useStore(s => s.isSupporter);
  const identityStatements = useStore(s => s.identityStatements);
  const bannerKey = useStore(s => s.bannerKey);
  const accentColor = useStore(s => s.accentColor);
  const motto = useStore(s => s.motto);
  const badgesEarned = useStore(s => s.badgesEarned);
  const completedLessons = useStore(s => s.completedLessons);
  const weeklyCheckins = useStore(s => s.weeklyCheckins);
  const activityLog = useStore(s => s.activityLog);

  // Anonymous avatar fallback
  const effectiveAvatarUrl = useMemo(() => {
    if (avatarUrl) return avatarUrl;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('avatar-local');
    }
    return null;
  }, [avatarUrl]);

  // Derive title
  const titleCtx = useMemo(() => buildTitleContext(
    { longestStreak, identityStatements, isSupporter, totalXp },
    completedWorldSlugs, totalEchoesSent, level.level,
  ), [longestStreak, identityStatements, isSupporter, totalXp, completedWorldSlugs, totalEchoesSent, level.level]);

  const equippedTitle = useMemo(() => {
    const explicit = getEquippedTitleLabel(equippedTitleId, titleCtx);
    if (explicit) return explicit;
    return getAutoTitle(titleCtx).label;
  }, [equippedTitleId, titleCtx]);

  // Latest identity statement
  const latestIdentity = useMemo(() => {
    if (identityStatements.length === 0) return null;
    return identityStatements[identityStatements.length - 1].statement;
  }, [identityStatements]);

  // Badge check context
  const badgeCtx: BadgeCheckContext = useMemo(() => ({
    longestStreak,
    currentStreak,
    totalLessonsCompleted: Object.keys(completedLessons).length,
    totalEchoesSent,
    identityStatementCount: identityStatements.length,
    completedWorldSlugs,
    level: level.level,
    isSupporter,
  }), [longestStreak, currentStreak, completedLessons, totalEchoesSent, identityStatements, completedWorldSlugs, level.level, isSupporter]);

  // Top badge (highest rarity)
  const topBadgeName = useMemo(() => {
    if (badgesEarned.length === 0) return null;
    const rarityRank = { legendary: 3, rare: 2, common: 1 } as const;
    let best: { name: string; rank: number } | null = null;
    for (const earned of badgesEarned) {
      const def = ALL_BADGES.find(b => b.id === earned.badgeId);
      if (!def) continue;
      const rank = rarityRank[def.rarity] ?? 0;
      if (!best || rank > best.rank) {
        best = { name: def.name, rank };
      }
    }
    return best?.name ?? null;
  }, [badgesEarned]);

  // Featured badge name
  const featuredBadgeName = useMemo(() => {
    if (!featuredBadgeId) return null;
    const def = ALL_BADGES.find(b => b.id === featuredBadgeId);
    return def?.name ?? null;
  }, [featuredBadgeId]);

  // Shareable card data
  const shareData: ShareableProfileData = useMemo(() => ({
    name,
    avatarUrl: effectiveAvatarUrl,
    frameTier: getEffectiveFrameTier(equippedFrameId, level.level),
    equippedTitle,
    level: level.level,
    levelTitle: level.title,
    currentStreak,
    topBadgeName,
    featuredBadgeName,
    motto,
    identityStatement: latestIdentity,
    isSupporter,
  }), [name, effectiveAvatarUrl, equippedFrameId, level, equippedTitle, currentStreak, topBadgeName, featuredBadgeName, motto, latestIdentity, isSupporter]);

  // Accent color CSS variables
  const accentVars = ACCENT_COLORS[accentColor];

  const tabs: { key: ProfileTab; label: string }[] = [
    { key: 'overview', label: t('profilePage.tabOverview') },
    { key: 'frames', label: t('profilePage.tabFrames') },
    { key: 'badges', label: t('profilePage.tabBadges') },
    { key: 'journey', label: t('profilePage.tabJourney') },
  ];

  return (
    <motion.div
      ref={scrollRef}
      className="h-full overflow-y-auto overscroll-contain"
      style={{
        '--profile-accent': accentVars.primary,
        '--profile-glow': accentVars.glow,
        '--profile-bg': accentVars.bg,
      } as React.CSSProperties}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Banner */}
      <HeroBanner
        name={name}
        avatarUrl={effectiveAvatarUrl}
        level={level.level}
        isSupporter={isSupporter}
        equippedFrameId={equippedFrameId}
        equippedTitle={equippedTitle}
        motto={motto}
        featuredBadgeId={featuredBadgeId}
        badgesEarned={badgesEarned}
        identityStatement={latestIdentity}
        transformationGoal={(transformationGoal as TransformationGoal) || null}
        bannerKey={bannerKey}
        scrollRef={scrollRef}
        onIdentityTap={() => setActiveTab('journey')}
      />

      {/* Stats Row */}
      <ProfileStatsRow
        totalXp={totalXp}
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        level={level}
      />

      {/* Tab Bar */}
      <div className="px-5 mt-4">
        <div className="flex gap-1 p-1 rounded-xl bg-stone-900/60 border border-stone-800/40">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                activeTab === tab.key
                  ? 'text-amber-100'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              {activeTab === tab.key && (
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  style={{ backgroundColor: 'var(--profile-bg, rgba(251,191,36,0.1))', border: '1px solid var(--profile-accent, #fbbf24)', borderColor: 'color-mix(in srgb, var(--profile-accent, #fbbf24) 30%, transparent)' }}
                  layoutId="profileTab"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Identity Evolution (if statements exist) */}
            {identityStatements.length > 0 && (
              <IdentityEvolution statements={identityStatements} />
            )}

            {/* Shareable Card */}
            <ShareableCard data={shareData} />

            {/* Customization Panel */}
            <CustomizationPanel
              completedWorldSlugs={completedWorldSlugs}
              totalEchoesSent={totalEchoesSent}
            />

            {/* Quick Actions */}
            <QuickActions
              isWeeklyCheckinDue={isWeeklyCheckinDue}
              isMonthlyAssessmentDue={isMonthlyAssessmentDue}
              unreadEchoCount={unreadEchoCount}
              onOpenTodayPractice={onOpenTodayPractice}
              onOpenWeeklyCheckin={onOpenWeeklyCheckin}
              onOpenMonthlyAssessment={onOpenMonthlyAssessment}
              onOpenBrowseEchoes={onOpenBrowseEchoes}
              onOpenPastLessons={onOpenPastLessons}
              onOpenIdentity={onOpenIdentity}
              onOpenStats={onOpenStats}
              onOpenSettings={onOpenSettings}
            />
          </motion.div>
        )}

        {activeTab === 'frames' && (
          <motion.div
            key="frames"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <FramesTab level={level.level} isSupporter={isSupporter} />
          </motion.div>
        )}

        {activeTab === 'badges' && (
          <motion.div
            key="badges"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <BadgeWall ctx={badgeCtx} earned={badgesEarned} />
          </motion.div>
        )}

        {activeTab === 'journey' && (
          <motion.div
            key="journey"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TransformationTimeline
              completedLessons={completedLessons}
              identityStatements={identityStatements}
              longestStreak={longestStreak}
              totalXp={totalXp}
              badgesEarned={badgesEarned}
              weeklyCheckins={weeklyCheckins}
              activityLog={activityLog}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom spacing */}
      <div className="h-8" />
    </motion.div>
  );
}
