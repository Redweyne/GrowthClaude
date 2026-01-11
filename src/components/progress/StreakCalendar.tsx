'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';

interface StreakCalendarProps {
  months?: number;
}

export function StreakCalendar({ months = 3 }: StreakCalendarProps) {
  const { getStreakCalendarData, currentStreak, longestStreak } = useStore();

  const calendarData = useMemo(() => {
    const data = getStreakCalendarData(months);
    const activityMap = new Map(data.map(d => [d.date, d]));

    // Generate all dates for the past N months
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1); // Start from first of month

    // Adjust to start from Sunday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const weeks: Array<Array<{ date: string; level: number; lessonsCompleted: number }>> = [];
    let currentWeek: Array<{ date: string; level: number; lessonsCompleted: number }> = [];
    const currentDate = new Date(startDate);

    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const activity = activityMap.get(dateStr);
      const lessonsCompleted = activity?.lessonsCompleted || 0;

      // Calculate intensity level (0-4)
      let level = 0;
      if (lessonsCompleted >= 3) level = 4;
      else if (lessonsCompleted >= 2) level = 3;
      else if (lessonsCompleted >= 1) level = 2;
      else if (activity) level = 1;

      currentWeek.push({ date: dateStr, level, lessonsCompleted });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Push remaining days
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, [getStreakCalendarData, months]);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-zinc-800/50';
      case 1: return 'bg-emerald-900/50';
      case 2: return 'bg-emerald-700/70';
      case 3: return 'bg-emerald-500/80';
      case 4: return 'bg-emerald-400';
      default: return 'bg-zinc-800/50';
    }
  };

  const getMonthLabels = () => {
    const labels: Array<{ month: string; index: number }> = [];
    let lastMonth = '';

    calendarData.forEach((week, weekIndex) => {
      const firstDayOfWeek = new Date(week[0].date);
      const monthStr = firstDayOfWeek.toLocaleDateString('en-US', { month: 'short' });

      if (monthStr !== lastMonth) {
        labels.push({ month: monthStr, index: weekIndex });
        lastMonth = monthStr;
      }
    });

    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Activity Calendar</h3>
          <p className="text-sm text-zinc-500">Your practice consistency</p>
        </div>
        <div className="flex gap-4 text-right">
          <div>
            <div className="text-2xl font-bold text-emerald-400">{currentStreak}</div>
            <div className="text-xs text-zinc-500">Current streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">{longestStreak}</div>
            <div className="text-xs text-zinc-500">Longest streak</div>
          </div>
        </div>
      </div>

      {/* Month labels */}
      <div className="flex mb-2 text-xs text-zinc-500">
        <div className="w-8" /> {/* Spacer for day labels */}
        <div className="flex-1 flex">
          {monthLabels.map(({ month, index }) => (
            <div
              key={`${month}-${index}`}
              style={{ marginLeft: index === 0 ? 0 : `${(index - (monthLabels[monthLabels.indexOf({ month, index }) - 1]?.index || 0)) * 14}px` }}
              className="text-xs"
            >
              {month}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 text-xs text-zinc-500 pr-2">
          <div className="h-3" /> {/* Mon */}
          <div className="h-3">Tue</div>
          <div className="h-3" /> {/* Wed */}
          <div className="h-3">Thu</div>
          <div className="h-3" /> {/* Fri */}
          <div className="h-3">Sat</div>
          <div className="h-3" /> {/* Sun */}
        </div>

        {/* Weeks */}
        <div className="flex gap-1 flex-1 overflow-x-auto pb-2">
          {calendarData.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <motion.div
                  key={day.date}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: (weekIndex * 7 + dayIndex) * 0.002 }}
                  className={`w-3 h-3 rounded-sm ${getLevelColor(day.level)} cursor-pointer transition-all hover:ring-2 hover:ring-white/30`}
                  title={`${day.date}: ${day.lessonsCompleted} lesson${day.lessonsCompleted === 1 ? '' : 's'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-zinc-500">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`w-3 h-3 rounded-sm ${getLevelColor(level)}`}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

export default StreakCalendar;
