'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import type { ActivityDay } from '@/store/useStore';

interface StreakCalendarProps {
  compact?: boolean;
}

const CELL_SIZE = 12;
const CELL_GAP = 2;
const CELL_STEP = CELL_SIZE + CELL_GAP;

const DAY_LABELS: Record<number, string> = {
  1: 'M',
  3: 'W',
  5: 'F',
};

function getActivityLevel(day: ActivityDay | undefined): number {
  if (!day) return 0;
  const total = day.lessonsCompleted + day.reflectionsWritten;
  if (total === 0) return 0;
  if (total === 1) return 1;
  if (total === 2) return 2;
  return 3;
}

const LEVEL_COLORS: Record<number, string> = {
  0: '#1c1917',
  1: 'rgba(245, 158, 11, 0.3)',
  2: 'rgba(245, 158, 11, 0.5)',
  3: 'rgba(245, 158, 11, 0.8)',
};

export function StreakCalendar({ compact = false }: StreakCalendarProps) {
  const { getStreakCalendarData } = useStore();

  const { weeks, activeDays } = useMemo(() => {
    const data = getStreakCalendarData(3);
    const activityMap = new Map<string, ActivityDay>();
    for (const d of data) {
      activityMap.set(d.date, d);
    }

    const numWeeks = compact ? 8 : 13;
    const today = new Date();
    const todayDow = today.getDay(); // 0=Sun

    // End of the current week (Saturday)
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + (6 - todayDow));

    // Start date: go back numWeeks weeks from the start of the end-week
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - numWeeks * 7 + 1);

    const weeks: (ActivityDay | undefined)[][] = [];
    let activeDays = 0;
    const cursor = new Date(startDate);

    for (let w = 0; w < numWeeks; w++) {
      const week: (ActivityDay | undefined)[] = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = cursor.toISOString().split('T')[0];
        const entry = activityMap.get(dateStr);

        if (cursor <= today) {
          week.push(entry);
          if (entry && (entry.lessonsCompleted > 0 || entry.reflectionsWritten > 0)) {
            activeDays++;
          }
        } else {
          week.push(undefined);
        }

        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
    }

    return { weeks, activeDays };
  }, [getStreakCalendarData, compact]);

  const labelWidth = 20;
  const svgWidth = labelWidth + weeks.length * CELL_STEP;
  const svgHeight = 7 * CELL_STEP;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-stone-300 light:text-stone-700">
          Activity
        </span>
        <span className="text-xs text-stone-500">
          {activeDays} active day{activeDays !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Calendar SVG */}
      <div className="overflow-x-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="block"
        >
          {/* Day labels */}
          {[0, 1, 2, 3, 4, 5, 6].map((dow) => {
            const label = DAY_LABELS[dow];
            if (!label) return null;
            return (
              <text
                key={`label-${dow}`}
                x={0}
                y={dow * CELL_STEP + CELL_SIZE - 2}
                fill="#78716c"
                fontSize={9}
                fontFamily="monospace"
              >
                {label}
              </text>
            );
          })}

          {/* Grid cells */}
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              const level = getActivityLevel(day);
              const x = labelWidth + wi * CELL_STEP;
              const y = di * CELL_STEP;

              const total = day
                ? day.lessonsCompleted + day.reflectionsWritten
                : 0;
              const titleText = day
                ? `${day.date}: ${total} activit${total === 1 ? 'y' : 'ies'}`
                : '';

              return (
                <rect
                  key={`${wi}-${di}`}
                  x={x}
                  y={y}
                  width={CELL_SIZE}
                  height={CELL_SIZE}
                  rx={2}
                  ry={2}
                  fill={LEVEL_COLORS[level]}
                >
                  {titleText && <title>{titleText}</title>}
                </rect>
              );
            })
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-2">
        <span className="text-[10px] text-stone-600 mr-1">Less</span>
        {[0, 1, 2, 3].map((level) => (
          <div
            key={level}
            className="rounded-sm"
            style={{
              width: 10,
              height: 10,
              backgroundColor: LEVEL_COLORS[level],
            }}
          />
        ))}
        <span className="text-[10px] text-stone-600 ml-1">More</span>
      </div>
    </motion.div>
  );
}
