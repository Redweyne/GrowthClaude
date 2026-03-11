'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { generateTimeline } from '@/lib/timelineEngine';
import type { BadgeEarnedRecord, TimelineEvent } from '@/types/profile';
import { useTranslation } from '@/i18n';

interface TransformationTimelineProps {
  completedLessons: Record<string, boolean>;
  identityStatements: Array<{ id: string; statement: string; createdAt: string }>;
  longestStreak: number;
  totalXp: number;
  badgesEarned: BadgeEarnedRecord[];
  weeklyCheckins: Array<{ id: string; date: string }>;
  activityLog: Array<{ date: string; lessonsCompleted: number }>;
}

const INITIAL_SHOW = 5;

export function TransformationTimeline(props: TransformationTimelineProps) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

  const events = useMemo(() => generateTimeline(props), [props]);

  if (events.length === 0) {
    return (
      <div className="px-5 mt-5 pb-4 text-center">
        <p className="text-sm text-stone-500">{t('profilePage.noJourneyYet')}</p>
      </div>
    );
  }

  const visible = expanded ? events : events.slice(0, INITIAL_SHOW);
  const hasMore = events.length > INITIAL_SHOW;

  return (
    <motion.div
      className="px-5 mt-5"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="text-sm font-medium uppercase tracking-wider text-stone-500 mb-4">
        {t('profilePage.transformationTimeline')}
      </h3>

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-amber-700/40 via-stone-800 to-transparent" />

        {/* NOW marker */}
        <motion.div
          className="relative flex items-center gap-3 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <div className="relative flex-shrink-0">
            <motion.div
              className="w-6 h-6 rounded-full bg-amber-500/30 flex items-center justify-center"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.8, 0.4, 0.8],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            </div>
          </div>
          <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
            {t('common.today')}
          </span>
        </motion.div>

        {/* Events */}
        {visible.map((event, i) => (
          <TimelineEventRow key={event.id} event={event} index={i} t={t} />
        ))}
      </div>

      {/* Show more / less */}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs text-amber-500/60 hover:text-amber-400 transition-colors"
        >
          {expanded ? t('profilePage.showLess') : t('profilePage.showAllEvents', { count: String(events.length) })}
        </button>
      )}
    </motion.div>
  );
}

function TimelineEventRow({
  event,
  index,
  t,
}: {
  event: TimelineEvent;
  index: number;
  t: (key: string, params?: Record<string, string>) => string;
}) {
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[event.icon] || Icons.Circle;
  const date = new Date(event.date);
  const meta = event.meta ?? {};
  const isEstimated = !!meta.isEstimated;

  // Resolve i18n keys with interpolation
  const title = resolveText(event.title, event, t);
  const description = resolveText(event.description, event, t);

  return (
    <motion.div
      className="relative flex gap-3 pb-4 last:pb-0"
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: 0.15 + (index + 1) * 0.08,
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
    >
      {/* Node */}
      <div className="relative flex-shrink-0">
        <div className="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center border border-stone-700">
          <IconComponent className="w-3 h-3 text-stone-400" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-stone-600">
          {isEstimated ? '~' : ''}{date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </div>
        <div className="text-sm text-stone-300 light:text-stone-600">{title}</div>
        <div className="text-xs text-stone-500 mt-0.5 line-clamp-2">{description}</div>
      </div>
    </motion.div>
  );
}

/**
 * Resolve a timeline text field: if it looks like an i18n key (contains '.'),
 * translate it with meta interpolation. Otherwise return as-is (raw text).
 */
function resolveText(
  text: string,
  event: TimelineEvent,
  t: (key: string, params?: Record<string, string>) => string,
): string {
  const meta = event.meta ?? {};

  // If it doesn't contain a dot, it's raw text (e.g., identity statements, badge descriptions)
  if (!text.includes('.') || meta.isRaw) return text;

  // Build interpolation params from meta
  const params: Record<string, string> = {};
  if (meta.days != null) params.days = String(meta.days);
  if (meta.level != null) params.level = String(meta.level);
  if (meta.levelTitle != null) params.levelTitle = String(meta.levelTitle);
  if (meta.minXp != null) params.minXp = String(meta.minXp);
  if (meta.badgeName != null) params.badgeName = String(meta.badgeName);

  return t(text, params);
}
