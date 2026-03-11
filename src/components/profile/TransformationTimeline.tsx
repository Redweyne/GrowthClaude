'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { generateTimeline } from '@/lib/timelineEngine';
import type { BadgeEarnedRecord } from '@/types/profile';

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

  const events = useMemo(() => generateTimeline(props), [props]);

  if (events.length === 0) return null;

  const visible = expanded ? events : events.slice(0, INITIAL_SHOW);
  const hasMore = events.length > INITIAL_SHOW;

  return (
    <motion.div
      className="px-5 mt-6"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <h3 className="text-sm font-medium uppercase tracking-wider text-stone-500 mb-4">
        Transformation Timeline
      </h3>

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-amber-700/40 via-stone-800 to-transparent" />

        {/* NOW marker */}
        <motion.div
          className="relative flex items-center gap-3 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
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
          <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Now</span>
        </motion.div>

        {/* Events */}
        {visible.map((event, i) => {
          const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[event.icon] || Icons.Circle;
          const date = new Date(event.date);

          return (
            <motion.div
              key={event.id}
              className="relative flex gap-3 pb-4 last:pb-0"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.65 + (i + 1) * 0.08,
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
                  {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-sm text-stone-300 light:text-stone-600">{event.title}</div>
                <div className="text-xs text-stone-500 mt-0.5 line-clamp-1">{event.description}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Show more / less */}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs text-amber-500/60 hover:text-amber-400 transition-colors"
        >
          {expanded ? 'Show less' : `Show all ${events.length} events`}
        </button>
      )}
    </motion.div>
  );
}
