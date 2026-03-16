// ═══════════════════════════════════════════════════════════════════════════
// HUMAN-READABLE EVENT DESCRIPTIONS
// Translates raw event types into plain English for the admin dashboard
// ═══════════════════════════════════════════════════════════════════════════

type EventData = Record<string, unknown> | null;

const STATIC_DESCRIPTIONS: Record<string, string> = {
  // Session lifecycle
  session_start: 'Opened the app',
  session_end: 'Left the app',

  // Auth / Identity
  user_identified: 'User identified',
  onboarding_started: 'Started onboarding',
  onboarding_completed: 'Finished onboarding',
  onboarding_name_entered: 'Entered their name',
  onboarding_language_selected: 'Selected a language',
  login_started: 'Started logging in',
  login_completed: 'Logged in',
  login_failed: 'Login failed',
  logout: 'Logged out',
  signup_started: 'Started signing up',
  signup_completed: 'Signed up',
  signup_failed: 'Signup failed',
  account_created: 'Created an account',
  account_deleted: 'Deleted their account',
  password_reset_requested: 'Requested a password reset',
  password_reset_completed: 'Reset their password',

  // Navigation / Views
  app_opened: 'Opened the app',
  app_backgrounded: 'Put the app in background',
  app_foregrounded: 'Returned to the app',

  // Daily practice flow
  lesson_started: 'Started a lesson',
  lesson_completed: 'Completed a lesson',
  lesson_skipped: 'Skipped a lesson',
  lesson_resumed: 'Resumed a lesson',
  lesson_section_viewed: 'Viewed a lesson section',

  echo_started: 'Started the echo',
  echo_completed: 'Completed the echo',
  echo_reflection_submitted: 'Submitted an echo reflection',
  echo_reflection_viewed: 'Viewed someone else\'s reflection',
  echo_skipped: 'Skipped the echo',
  mandatory_echo_completed: 'Completed the mandatory echo',

  exercise_started: 'Started an exercise',
  exercise_completed: 'Completed an exercise',
  exercise_skipped: 'Skipped an exercise',
  daily_exercise_completed: 'Completed an exercise',
  daily_exercise_started: 'Started an exercise',
  all_exercises_completed: 'Finished all exercises for today',
  daily_practice_completed: 'Completed the full daily practice',
  daily_complete: 'Finished everything for today',

  // Exercise types
  rapid_verdict_started: 'Started a Rapid Verdict exercise',
  rapid_verdict_completed: 'Completed a Rapid Verdict exercise',
  priority_tower_started: 'Started a Priority Tower exercise',
  priority_tower_completed: 'Completed a Priority Tower exercise',
  scenario_snap_started: 'Started a Scenario Snap exercise',
  scenario_snap_completed: 'Completed a Scenario Snap exercise',
  heat_check_started: 'Started a Heat Check exercise',
  heat_check_completed: 'Completed a Heat Check exercise',
  word_forge_started: 'Started a Word Forge exercise',
  word_forge_completed: 'Completed a Word Forge exercise',

  // XP & Progress
  xp_earned: 'Earned XP',
  level_up: 'Leveled up',
  streak_updated: 'Updated their streak',
  streak_broken: 'Broke their streak',
  streak_milestone: 'Hit a streak milestone',
  achievement_unlocked: 'Unlocked an achievement',
  badge_earned: 'Earned a badge',
  world_completed: 'Completed a world',

  // Sparks
  spark_viewed: 'Watched a Spark video',
  spark_liked: 'Liked a Spark',
  spark_shared: 'Shared a Spark',
  spark_completed: 'Finished watching a Spark',

  // Settings
  settings_opened: 'Opened settings',
  language_changed: 'Changed language',
  theme_changed: 'Changed theme',
  notifications_toggled: 'Toggled notifications',
  sound_toggled: 'Toggled sounds',

  // Payments
  checkout_started: 'Started checkout',
  checkout_completed: 'Completed a payment',
  checkout_cancelled: 'Cancelled checkout',
  payment_success: 'Payment succeeded',
  payment_failed: 'Payment failed',
  supporter_upgraded: 'Became a supporter',
  founder_upgraded: 'Became a founding member',

  // Social
  reflection_submitted: 'Submitted a reflection',
  reflection_liked: 'Liked a reflection',
  share_triggered: 'Shared content',

  // Errors
  error_occurred: 'Encountered an error',
  api_error: 'Hit an API error',

  // Misc
  feedback_submitted: 'Submitted feedback',
  help_opened: 'Opened help',
  tutorial_started: 'Started the tutorial',
  tutorial_completed: 'Finished the tutorial',
  notification_received: 'Received a notification',
  notification_opened: 'Opened a notification',
  deep_link_opened: 'Opened a deep link',
};

/**
 * Returns a human-readable description for an event.
 * Uses event data to add context where available.
 */
export function describeEvent(eventType: string, eventData?: EventData): string {
  // Dynamic descriptions that use event data
  if (eventData) {
    switch (eventType) {
      case 'view_change': {
        const to = eventData.to as string | undefined;
        const from = eventData.from as string | undefined;
        if (to && from) return `Navigated from ${from} to ${to}`;
        if (to) return `Navigated to ${to}`;
        return 'Changed screens';
      }
      case 'xp_earned': {
        const amount = eventData.amount ?? eventData.xp;
        const total = eventData.total ?? eventData.totalXp;
        if (amount && total) return `Earned ${amount} XP (total: ${total})`;
        if (amount) return `Earned ${amount} XP`;
        return 'Earned XP';
      }
      case 'level_up': {
        const level = eventData.level ?? eventData.newLevel;
        if (level) return `Leveled up to level ${level}`;
        return 'Leveled up';
      }
      case 'streak_updated': {
        const days = eventData.days ?? eventData.streak;
        if (days) return `Streak is now ${days} days`;
        return 'Updated their streak';
      }
      case 'streak_milestone': {
        const days = eventData.days ?? eventData.milestone;
        if (days) return `Hit a ${days}-day streak milestone`;
        return 'Hit a streak milestone';
      }
      case 'language_changed': {
        const lang = eventData.language ?? eventData.to;
        if (lang) return `Changed language to ${lang}`;
        return 'Changed language';
      }
      case 'user_identified': {
        const name = eventData.userName as string | undefined;
        if (name) return `Identified as ${name}`;
        return 'User identified';
      }
      case 'lesson_completed': {
        const title = eventData.title ?? eventData.lessonTitle;
        if (title) return `Completed lesson: ${title}`;
        return 'Completed a lesson';
      }
      case 'exercise_completed':
      case 'daily_exercise_completed': {
        const type = eventData.type ?? eventData.exerciseType;
        if (type) return `Completed a ${type} exercise`;
        return 'Completed an exercise';
      }
      case 'error_occurred':
      case 'api_error': {
        const msg = eventData.message ?? eventData.error;
        if (msg) return `Error: ${String(msg).slice(0, 80)}`;
        return 'Encountered an error';
      }
      case 'checkout_started': {
        const tier = eventData.tier;
        if (tier) return `Started checkout for ${tier}`;
        return 'Started checkout';
      }
      case 'world_completed': {
        const name = eventData.worldName ?? eventData.world;
        if (name) return `Completed world: ${name}`;
        return 'Completed a world';
      }
    }
  }

  // Static lookup
  if (STATIC_DESCRIPTIONS[eventType]) {
    return STATIC_DESCRIPTIONS[eventType];
  }

  // Fallback: convert snake_case to Title Case
  return eventType
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
