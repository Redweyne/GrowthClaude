import { ALL_TITLES, type TitleDefinition, type TitleCheckContext } from '@/types/profile';

/**
 * Get all titles the user has unlocked based on their current state.
 * Unlock conditions are fully derived — no persistence needed.
 */
export function getUnlockedTitles(ctx: TitleCheckContext): TitleDefinition[] {
  return ALL_TITLES.filter(title => isTitleUnlocked(title, ctx));
}

/**
 * Get the equipped title label, or null if none equipped.
 */
export function getEquippedTitleLabel(equippedTitleId: string | null, ctx: TitleCheckContext): string | null {
  if (!equippedTitleId) return null;
  const title = ALL_TITLES.find(t => t.id === equippedTitleId);
  if (!title) return null;
  // Only show if still unlocked
  if (!isTitleUnlocked(title, ctx)) return null;
  return title.label;
}

/**
 * Get the best auto-selected title (highest-tier unlocked) if user hasn't equipped one.
 */
export function getAutoTitle(ctx: TitleCheckContext): TitleDefinition {
  const unlocked = getUnlockedTitles(ctx);
  // Return the last unlocked title (highest tier since ALL_TITLES is ordered by progression)
  return unlocked[unlocked.length - 1] || ALL_TITLES[0];
}

function isTitleUnlocked(title: TitleDefinition, ctx: TitleCheckContext): boolean {
  switch (title.id) {
    case 'seeker':
      return true; // Everyone starts with this
    case 'steady-one':
      return ctx.longestStreak >= 7;
    case 'daybreaker':
      return ctx.longestStreak >= 14;
    case 'iron-soul':
      return ctx.longestStreak >= 30;
    case 'witness':
      return ctx.totalEchoes >= 10;
    case 'echo-giver':
      return ctx.totalEchoes >= 25;
    case 'the-reflective':
      return ctx.identityStatementCount >= 5;
    case 'stoic-apprentice':
      return ctx.completedWorldSlugs.includes('stoicism');
    case 'wisdom-keeper':
      return ctx.completedWorldSlugs.includes('modern-wisdom');
    case 'philosopher':
      return ctx.level >= 7;
    case 'the-enlightened':
      return ctx.level >= 10;
    case 'founding-flame':
      return ctx.isSupporter;
    default:
      return false;
  }
}

/**
 * Build a TitleCheckContext from store state.
 */
export function buildTitleContext(state: {
  longestStreak: number;
  identityStatements: { id: string }[];
  isSupporter: boolean;
  totalXp: number;
}, completedWorldSlugs: string[], totalEchoes: number, level: number): TitleCheckContext {
  return {
    longestStreak: state.longestStreak,
    totalEchoes,
    identityStatementCount: state.identityStatements.length,
    completedWorldSlugs,
    level,
    isSupporter: state.isSupporter,
  };
}
