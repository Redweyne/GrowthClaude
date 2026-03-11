// ============================================
// PROFILE IDENTITY SYSTEM
// ============================================
// Types, constants, and definitions for the profile
// identity experience. Frame tiers, titles, badges,
// accent colors, auras, and timeline events.
// ============================================

import type { TransformationGoal } from './index';

// ─────────────────────────────────────────────
// AVATAR FRAME SYSTEM
// ─────────────────────────────────────────────
// Frames are unlockable by level. Users can equip
// any unlocked frame. The "highest tier" is derived
// for display contexts that don't allow selection.

export type AvatarFrameTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
export type EquippableFrameId = AvatarFrameTier | 'founder';

export interface FrameDefinition {
  id: EquippableFrameId;
  label: string;
  tier: AvatarFrameTier; // visual tier for color lookup
  minLevel: number;
  isSupporterExclusive: boolean;
}

export const ALL_FRAMES: FrameDefinition[] = [
  { id: 'bronze',   label: 'Bronze',   tier: 'bronze',   minLevel: 1, isSupporterExclusive: false },
  { id: 'silver',   label: 'Silver',   tier: 'silver',   minLevel: 3, isSupporterExclusive: false },
  { id: 'gold',     label: 'Gold',     tier: 'gold',     minLevel: 5, isSupporterExclusive: false },
  { id: 'platinum', label: 'Platinum', tier: 'platinum', minLevel: 7, isSupporterExclusive: false },
  { id: 'diamond',  label: 'Diamond',  tier: 'diamond',  minLevel: 9, isSupporterExclusive: false },
  { id: 'founder',  label: 'Founder',  tier: 'gold',     minLevel: 1, isSupporterExclusive: true },
];

export function isFrameUnlocked(frame: FrameDefinition, level: number, isSupporter: boolean): boolean {
  if (frame.isSupporterExclusive && !isSupporter) return false;
  return level >= frame.minLevel;
}

export function getUnlockedFrames(level: number, isSupporter: boolean): FrameDefinition[] {
  return ALL_FRAMES.filter(f => isFrameUnlocked(f, level, isSupporter));
}

// Highest earned tier (for contexts that don't use equipped frame)
export function getFrameTier(level: number): AvatarFrameTier {
  if (level >= 9) return 'diamond';
  if (level >= 7) return 'platinum';
  if (level >= 5) return 'gold';
  if (level >= 3) return 'silver';
  return 'bronze';
}

// Resolve equipped frame to a visual tier
export function getEffectiveFrameTier(equippedFrameId: EquippableFrameId | null, level: number): AvatarFrameTier {
  if (!equippedFrameId) return getFrameTier(level);
  const frame = ALL_FRAMES.find(f => f.id === equippedFrameId);
  if (!frame) return getFrameTier(level);
  return frame.tier;
}

export const FRAME_TIER_THRESHOLDS: Record<AvatarFrameTier, { minLevel: number }> = {
  bronze:   { minLevel: 1 },
  silver:   { minLevel: 3 },
  gold:     { minLevel: 5 },
  platinum: { minLevel: 7 },
  diamond:  { minLevel: 9 },
};

// Frame color palettes for each tier
export const FRAME_COLORS: Record<AvatarFrameTier, { primary: string; secondary: string; glow: string }> = {
  bronze:   { primary: '#cd7f32', secondary: '#b87333', glow: 'rgba(205,127,50,0.3)' },
  silver:   { primary: '#c0c0c0', secondary: '#a8a8a8', glow: 'rgba(192,192,192,0.3)' },
  gold:     { primary: '#fbbf24', secondary: '#f59e0b', glow: 'rgba(251,191,36,0.4)' },
  platinum: { primary: '#e5e4e2', secondary: '#a78bfa', glow: 'rgba(167,139,250,0.4)' },
  diamond:  { primary: '#b9f2ff', secondary: '#818cf8', glow: 'rgba(185,242,255,0.5)' },
};

// Founder frame has its own palette (golden + supporter shimmer)
export const FOUNDER_FRAME_COLORS = {
  primary: '#f59e0b',
  secondary: '#fbbf24',
  glow: 'rgba(245,158,11,0.5)',
};

// ─────────────────────────────────────────────
// ACCENT COLORS (stored in useStore)
// ─────────────────────────────────────────────

export type ProfileAccentColor = 'gold' | 'rose' | 'purple' | 'emerald' | 'indigo';

export const ACCENT_COLORS: Record<ProfileAccentColor, { primary: string; glow: string; bg: string; label: string }> = {
  gold:    { primary: '#fbbf24', glow: 'rgba(251,191,36,0.3)',  bg: 'rgba(251,191,36,0.1)',  label: 'Gold' },
  rose:    { primary: '#fb7185', glow: 'rgba(251,113,133,0.3)', bg: 'rgba(251,113,133,0.1)', label: 'Rose' },
  purple:  { primary: '#a78bfa', glow: 'rgba(167,139,250,0.3)', bg: 'rgba(167,139,250,0.1)', label: 'Purple' },
  emerald: { primary: '#34d399', glow: 'rgba(52,211,153,0.3)',  bg: 'rgba(52,211,153,0.1)',  label: 'Emerald' },
  indigo:  { primary: '#818cf8', glow: 'rgba(129,140,248,0.3)', bg: 'rgba(129,140,248,0.1)', label: 'Indigo' },
};

// ─────────────────────────────────────────────
// AURAS (derived from transformationGoal, never stored)
// ─────────────────────────────────────────────

export type ProfileAura = 'calm' | 'discipline' | 'courage' | 'focus' | 'wisdom' | 'resilience';

export const GOAL_TO_AURA: Record<TransformationGoal, ProfileAura> = {
  calmer: 'calm',
  disciplined: 'discipline',
  confident: 'courage',
  leader: 'wisdom',
  focused: 'focus',
  resilient: 'resilience',
};

export const AURA_STYLES: Record<ProfileAura, { gradient: string; particleColor: string; label: string }> = {
  calm:       { gradient: 'from-cyan-900/40 via-teal-900/30 to-stone-950',   particleColor: '#22d3ee', label: 'Serenity' },
  discipline: { gradient: 'from-amber-900/40 via-yellow-900/30 to-stone-950', particleColor: '#fbbf24', label: 'Forge' },
  courage:    { gradient: 'from-orange-900/40 via-amber-900/30 to-stone-950', particleColor: '#f97316', label: 'Ember' },
  focus:      { gradient: 'from-indigo-900/40 via-purple-900/30 to-stone-950', particleColor: '#818cf8', label: 'Clarity' },
  wisdom:     { gradient: 'from-purple-900/40 via-amber-900/20 to-stone-950', particleColor: '#a78bfa', label: 'Constellation' },
  resilience: { gradient: 'from-stone-700/40 via-amber-900/20 to-stone-950',  particleColor: '#d4a574', label: 'Bedrock' },
};

// ─────────────────────────────────────────────
// BANNER PRESETS
// ─────────────────────────────────────────────

export interface BannerPreset {
  key: string;
  label: string;
  /** CSS gradient string for the banner background */
  gradient: string;
  isSupporterExclusive: boolean;
}

export const BANNER_PRESETS: BannerPreset[] = [
  { key: 'stoic-columns',    label: 'Stoic Columns',      gradient: 'linear-gradient(135deg, #1a1510 0%, #2a1f14 30%, #1c1612 60%, #0f0c08 100%)',  isSupporterExclusive: false },
  { key: 'mountain-peak',    label: 'Mountain Peak',      gradient: 'linear-gradient(180deg, #1a1e2e 0%, #2d3548 30%, #4a5568 60%, #1a1e2e 100%)',  isSupporterExclusive: false },
  { key: 'ocean-horizon',    label: 'Ocean Horizon',      gradient: 'linear-gradient(180deg, #0c1929 0%, #1a3a5c 40%, #0e4d6e 70%, #0a2540 100%)',  isSupporterExclusive: false },
  { key: 'forest-path',      label: 'Forest Path',        gradient: 'linear-gradient(180deg, #0d1a0d 0%, #1a2f1a 35%, #162816 65%, #0a140a 100%)',  isSupporterExclusive: false },
  { key: 'starfield',        label: 'Starfield',          gradient: 'radial-gradient(ellipse at 30% 20%, #1a1040 0%, #0a0820 40%, #050410 80%, #020108 100%)', isSupporterExclusive: false },
  { key: 'sunrise',          label: 'Sunrise',            gradient: 'linear-gradient(180deg, #1a0a1e 0%, #3d1a2a 25%, #6b3a20 50%, #2a1510 80%, #0f0a08 100%)', isSupporterExclusive: false },
  { key: 'golden-dawn',      label: 'Golden Dawn',        gradient: 'linear-gradient(135deg, #1a1200 0%, #3d2a00 25%, #5c4000 45%, #3d2a00 70%, #1a1200 100%)', isSupporterExclusive: true },
  { key: 'philosophers-garden', label: "Philosopher's Garden", gradient: 'linear-gradient(135deg, #0d1a14 0%, #1a2d22 30%, #2a3d30 55%, #1a2d22 80%, #0d1a14 100%)', isSupporterExclusive: true },
];

// ─────────────────────────────────────────────
// EQUIPPABLE TITLES (derived from behavior, never stored)
// Unlock state is derived. Only equippedTitleId is stored.
// ─────────────────────────────────────────────

export interface TitleDefinition {
  id: string;
  label: string;
  unlockDescription: string;
  isSupporterExclusive: boolean;
}

// Title unlock condition context
export interface TitleCheckContext {
  longestStreak: number;
  totalEchoes: number;
  identityStatementCount: number;
  completedWorldSlugs: string[];
  level: number;
  isSupporter: boolean;
}

export const ALL_TITLES: TitleDefinition[] = [
  { id: 'seeker',           label: 'Seeker',            unlockDescription: 'Begin your journey',                   isSupporterExclusive: false },
  { id: 'steady-one',       label: 'The Steady One',    unlockDescription: 'Reach a 7-day streak',                 isSupporterExclusive: false },
  { id: 'daybreaker',       label: 'Daybreaker',        unlockDescription: 'Reach a 14-day streak',                isSupporterExclusive: false },
  { id: 'iron-soul',        label: 'Iron Soul',         unlockDescription: 'Reach a 30-day streak',                isSupporterExclusive: false },
  { id: 'witness',          label: 'Witness',           unlockDescription: 'Send 10 echoes',                       isSupporterExclusive: false },
  { id: 'echo-giver',       label: 'Echo Giver',        unlockDescription: 'Send 25 echoes',                       isSupporterExclusive: false },
  { id: 'the-reflective',   label: 'The Reflective',    unlockDescription: 'Write 5 identity statements',          isSupporterExclusive: false },
  { id: 'stoic-apprentice',  label: 'Stoic Apprentice',  unlockDescription: 'Complete the Stoicism world',          isSupporterExclusive: false },
  { id: 'wisdom-keeper',    label: 'Wisdom Keeper',     unlockDescription: 'Complete the Modern Wisdom world',     isSupporterExclusive: false },
  { id: 'philosopher',      label: 'Philosopher',       unlockDescription: 'Reach level 7',                        isSupporterExclusive: false },
  { id: 'the-enlightened',  label: 'The Enlightened',   unlockDescription: 'Reach level 10',                       isSupporterExclusive: false },
  { id: 'founding-flame',   label: 'Founding Flame',    unlockDescription: 'Support during the beta',              isSupporterExclusive: true },
];

// ─────────────────────────────────────────────
// BADGE SYSTEM
// ─────────────────────────────────────────────

export type BadgeCategory = 'streak' | 'world' | 'social' | 'mastery' | 'special';
export type BadgeRarity = 'common' | 'rare' | 'legendary';

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  category: BadgeCategory;
  rarity: BadgeRarity;
  isSupporterExclusive: boolean;
}

// Non-derivable: only the earnedAt timestamp is stored
export interface BadgeEarnedRecord {
  badgeId: string;
  earnedAt: string; // ISO date string
}

// Context for checking badge eligibility (all derivable from useStore)
export interface BadgeCheckContext {
  longestStreak: number;
  currentStreak: number;
  totalLessonsCompleted: number;
  totalEchoesSent: number;
  identityStatementCount: number;
  completedWorldSlugs: string[];
  level: number;
  isSupporter: boolean;
}

export const ALL_BADGES: BadgeDefinition[] = [
  // Streak
  { id: 'first-flame',    name: 'First Flame',      description: 'Complete your first day',        icon: 'Flame',     category: 'streak',  rarity: 'common',    isSupporterExclusive: false },
  { id: 'week-warrior',   name: 'Week Warrior',     description: 'Reach a 7-day streak',           icon: 'Shield',    category: 'streak',  rarity: 'common',    isSupporterExclusive: false },
  { id: 'iron-will',      name: 'Iron Will',        description: 'Reach a 30-day streak',          icon: 'Swords',    category: 'streak',  rarity: 'rare',      isSupporterExclusive: false },
  { id: 'century',        name: 'Century',           description: 'Reach a 100-day streak',         icon: 'Crown',     category: 'streak',  rarity: 'legendary', isSupporterExclusive: false },

  // World
  { id: 'world-walker',   name: 'World Walker',     description: 'Complete your first world',       icon: 'Globe',     category: 'world',   rarity: 'rare',      isSupporterExclusive: false },

  // Social
  { id: 'echo-sender',    name: 'Echo Sender',      description: 'Send 10 echoes to others',       icon: 'MessageCircle', category: 'social', rarity: 'common', isSupporterExclusive: false },

  // Mastery
  { id: 'deep-diver',     name: 'Deep Diver',       description: 'Complete 15 lessons',             icon: 'Compass',   category: 'mastery', rarity: 'rare',      isSupporterExclusive: false },
  { id: 'identity-forger', name: 'Identity Forger',  description: 'Write 3 identity statements',    icon: 'Fingerprint', category: 'mastery', rarity: 'common',  isSupporterExclusive: false },
  { id: 'philosopher-king', name: 'Philosopher King', description: 'Reach the highest level',       icon: 'Sparkles',  category: 'mastery', rarity: 'legendary', isSupporterExclusive: false },

  // Special
  { id: 'founding-member', name: 'Founding Member',  description: 'Supported during the beta launch', icon: 'Star',    category: 'special', rarity: 'legendary', isSupporterExclusive: true },
];

// ─────────────────────────────────────────────
// TIMELINE EVENTS (fully derived, never stored)
// ─────────────────────────────────────────────

export type TimelineEventType =
  | 'journey_start'
  | 'first_lesson'
  | 'streak_milestone'
  | 'level_up'
  | 'world_complete'
  | 'identity_change'
  | 'badge_unlock'
  | 'first_checkin';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  date: string; // ISO date string
  title: string; // i18n key or raw text
  description: string; // i18n key or raw text
  icon: string; // Lucide icon name
  meta?: Record<string, unknown>; // type-specific context for i18n interpolation
}

// ─────────────────────────────────────────────
// AVATAR DEFAULTS
// ─────────────────────────────────────────────

export const INITIAL_AVATAR_GRADIENTS = [
  'from-amber-600 to-orange-800',
  'from-purple-600 to-indigo-800',
  'from-emerald-600 to-teal-800',
  'from-rose-600 to-pink-800',
  'from-cyan-600 to-blue-800',
  'from-yellow-600 to-amber-800',
] as const;

export const SILHOUETTE_AVATARS = [
  { key: 'thinker',    label: 'The Thinker',    path: '/avatars/silhouette-thinker.svg' },
  { key: 'meditator',  label: 'The Meditator',  path: '/avatars/silhouette-meditator.svg' },
  { key: 'warrior',    label: 'The Warrior',    path: '/avatars/silhouette-warrior.svg' },
  { key: 'sage',       label: 'The Sage',       path: '/avatars/silhouette-sage.svg' },
  { key: 'phoenix',    label: 'The Phoenix',    path: '/avatars/silhouette-phoenix.svg' },
  { key: 'lotus',      label: 'The Lotus',      path: '/avatars/silhouette-lotus.svg' },
] as const;

// ─────────────────────────────────────────────
// SHAREABLE PROFILE CARD
// ─────────────────────────────────────────────

export interface ShareableProfileData {
  name: string;
  avatarUrl: string | null;
  frameTier: AvatarFrameTier;
  equippedTitle: string | null;
  level: number;
  levelTitle: string;
  currentStreak: number;
  topBadgeName: string | null;
  featuredBadgeName: string | null;
  identityStatement: string | null;
  motto: string | null;
  isSupporter: boolean;
}

// ─────────────────────────────────────────────
// MINI PROFILE (for echo interactions)
// ─────────────────────────────────────────────

export interface MiniProfile {
  userId: string;
  name: string | null;
  avatarUrl: string | null;
  equippedTitleId: string | null;
  currentLevel: number;
  profileVisible: boolean;
}
