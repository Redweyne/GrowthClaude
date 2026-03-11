'use client';

import { useRef, useMemo, useState } from 'react';
import { HeroBanner } from './HeroBanner';
import { ProfileStatsRow } from './ProfileStatsRow';
import { BadgeWall } from './BadgeWall';
import { IdentityEvolution } from './IdentityEvolution';
import { TransformationTimeline } from './TransformationTimeline';
import { CustomizationPanel } from './CustomizationPanel';
import { QuickActions } from './QuickActions';
import { ShareableCard } from './ShareableCard';
import { useStore } from '@/store/useStore';
import { getLevelFromXp } from '@/types';
import { getEquippedTitleLabel, buildTitleContext, getAutoTitle } from '@/lib/titleEngine';
import { ACCENT_COLORS, ALL_BADGES } from '@/types/profile';
import type { BadgeCheckContext, ShareableProfileData } from '@/types/profile';
import type { TransformationGoal } from '@/types';

interface ProfilePageProps {
  // User info
  name: string;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  level: { level: number; title: string };
  transformationGoal?: string;

  // Due indicators
  isWeeklyCheckinDue: boolean;
  isMonthlyAssessmentDue: boolean;

  // Echo counts
  unreadEchoCount: number;

  // Navigation callbacks (same as DashboardNew)
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

  // World data for badge/title derivation
  completedWorldSlugs: string[];
  totalEchoesSent: number;
}

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
  const [showIdentityEvolution, setShowIdentityEvolution] = useState(false);

  // Store reads for profile-specific data
  const avatarUrl = useStore(s => s.avatarUrl);
  const equippedTitleId = useStore(s => s.equippedTitleId);
  const isSupporter = useStore(s => s.isSupporter);
  const identityStatements = useStore(s => s.identityStatements);
  const bannerKey = useStore(s => s.bannerKey);
  const accentColor = useStore(s => s.accentColor);
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

  // Compute top badge (highest rarity among earned)
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

  // Shareable card data
  const shareData: ShareableProfileData = useMemo(() => ({
    name,
    avatarUrl: effectiveAvatarUrl,
    frameTier: getLevelFromXp(totalXp).level >= 9 ? 'diamond' : getLevelFromXp(totalXp).level >= 7 ? 'platinum' : getLevelFromXp(totalXp).level >= 5 ? 'gold' : getLevelFromXp(totalXp).level >= 3 ? 'silver' : 'bronze',
    equippedTitle,
    level: level.level,
    levelTitle: level.title,
    currentStreak,
    topBadgeName,
    identityStatement: latestIdentity,
    isSupporter,
  }), [name, effectiveAvatarUrl, totalXp, equippedTitle, level, currentStreak, topBadgeName, latestIdentity, isSupporter]);

  // Accent color CSS variables
  const accentVars = ACCENT_COLORS[accentColor];

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto overscroll-contain"
      style={{
        '--profile-accent': accentVars.primary,
        '--profile-glow': accentVars.glow,
        '--profile-bg': accentVars.bg,
      } as React.CSSProperties}
    >
      {/* Hero Banner */}
      <HeroBanner
        name={name}
        avatarUrl={effectiveAvatarUrl}
        level={level.level}
        isSupporter={isSupporter}
        equippedTitle={equippedTitle}
        identityStatement={latestIdentity}
        transformationGoal={(transformationGoal as TransformationGoal) || null}
        bannerKey={bannerKey}
        scrollRef={scrollRef}
        onIdentityTap={() => setShowIdentityEvolution(!showIdentityEvolution)}
      />

      {/* Stats Row */}
      <ProfileStatsRow
        totalXp={totalXp}
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        level={level}
      />

      {/* Badge Wall */}
      <BadgeWall ctx={badgeCtx} earned={badgesEarned} />

      {/* Identity Evolution (toggleable from hero tap) */}
      {(showIdentityEvolution || identityStatements.length > 0) && (
        <IdentityEvolution statements={identityStatements} />
      )}

      {/* Transformation Timeline */}
      <TransformationTimeline
        completedLessons={completedLessons}
        identityStatements={identityStatements}
        longestStreak={longestStreak}
        totalXp={totalXp}
        badgesEarned={badgesEarned}
        weeklyCheckins={weeklyCheckins}
        activityLog={activityLog}
      />

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
    </div>
  );
}
