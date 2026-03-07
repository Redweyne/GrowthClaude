'use client';

// ============================================================================
// STREAK CALENDAR - YOUR COMMITMENT MADE VISIBLE
// Not just a GitHub-style grid. A visual story of every day you chose growth.
// ============================================================================

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Calendar, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useTranslation } from '@/i18n';

interface StreakCalendarProps {
  months?: number;
}

interface DayData {
  date: string;
  level: number;
  lessonsCompleted: number;
  reflectionsWritten: number;
  xpEarned: number;
  isToday: boolean;
  isFuture: boolean;
}

export function StreakCalendar({ months = 3 }: StreakCalendarProps) {
  const { locale } = useTranslation();
  const { getStreakCalendarData, currentStreak, longestStreak } = useStore();
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const localeTag = locale === 'ar' ? 'ar' : locale === 'fr' ? 'fr-FR' : 'en-US';

  const copy = {
    en: {
      commitment: 'Your Commitment',
      daysPractice: '{days} days of practice in {months} months',
      current: 'Current',
      best: 'Best',
      consistency: 'Consistency',
      consistencyHigh: "Exceptional consistency. You're building something lasting.",
      consistencyMid: 'Good consistency. Keep pushing to make this a daily habit.',
      consistencyLow: 'Building momentum. Every day you show up matters.',
      consistencyStart: 'Start your streak today. One day at a time.',
      andCounting: '{count} {dayWord} and counting...',
      startStreakToday: 'Start your streak today',
      day: 'day',
      days: 'days',
      less: 'Less',
      more: 'More',
      lesson: 'Lesson',
      lessons: 'Lessons',
      xpEarned: 'XP Earned',
      reflectionWritten: '{count} reflection{suffix} written',
      todayGreatWork: 'Great work today! Keep the momentum going.',
      showedUp: "You showed up. That's what matters.",
      noLessonsToday: 'No lessons yet today. Time to change that?',
      noPractice: 'No practice this day.',
      everyDayOpportunity: 'Every day is a new opportunity.',
    },
    fr: {
      commitment: 'Votre engagement',
      daysPractice: '{days} jours de pratique en {months} mois',
      current: 'Actuel',
      best: 'Meilleur',
      consistency: 'Régularité',
      consistencyHigh: 'Régularité exceptionnelle. Vous construisez quelque chose de durable.',
      consistencyMid: 'Bonne régularité. Continuez pour en faire une habitude quotidienne.',
      consistencyLow: 'La dynamique se construit. Chaque jour compte.',
      consistencyStart: "Commencez votre série aujourd'hui. Un jour à la fois.",
      andCounting: '{count} {dayWord} et ça continue...',
      startStreakToday: "Commencez votre série aujourd'hui",
      day: 'jour',
      days: 'jours',
      less: 'Moins',
      more: 'Plus',
      lesson: 'Leçon',
      lessons: 'Leçons',
      xpEarned: 'XP gagné',
      reflectionWritten: '{count} réflexion{suffix} écrite',
      todayGreatWork: "Excellent travail aujourd'hui. Gardez cet élan.",
      showedUp: "Vous vous êtes présenté. C'est ce qui compte.",
      noLessonsToday: "Aucune leçon pour aujourd'hui. Et si vous changiez ça ?",
      noPractice: 'Aucune pratique ce jour-là.',
      everyDayOpportunity: 'Chaque jour est une nouvelle opportunité.',
    },
    ar: {
      commitment: 'التزامك',
      daysPractice: '{days} يوم ممارسة خلال {months} أشهر',
      current: 'الحالي',
      best: 'الأفضل',
      consistency: 'الاستمرارية',
      consistencyHigh: 'استمرارية ممتازة. أنت تبني شيئاً دائماً.',
      consistencyMid: 'استمرارية جيدة. واصل حتى تصبح عادة يومية.',
      consistencyLow: 'الزخم يتشكل. كل يوم تحضر فيه مهم.',
      consistencyStart: 'ابدأ سلسلتك اليوم. يوماً بعد يوم.',
      andCounting: '{count} {dayWord} وما زالت مستمرة...',
      startStreakToday: 'ابدأ سلسلتك اليوم',
      day: 'يوم',
      days: 'أيام',
      less: 'أقل',
      more: 'أكثر',
      lesson: 'درس',
      lessons: 'دروس',
      xpEarned: 'XP مكتسب',
      reflectionWritten: 'تمت كتابة {count} تأمل{suffix}',
      todayGreatWork: 'عمل رائع اليوم! واصل الزخم.',
      showedUp: 'لقد حضرت. هذا هو المهم.',
      noLessonsToday: 'لا توجد دروس بعد اليوم. هل تريد تغيير ذلك؟',
      noPractice: 'لا توجد ممارسة في هذا اليوم.',
      everyDayOpportunity: 'كل يوم فرصة جديدة.',
    },
  } as const;
  const c = copy[locale] ?? copy.en;

  const today = new Date().toISOString().split('T')[0];

  const { weeks, stats } = useMemo(() => {
    const data = getStreakCalendarData(months);
    const activityMap = new Map(data.map(d => [d.date, d]));

    const todayDate = new Date();
    const startDate = new Date(todayDate);
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);

    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const weeks: DayData[][] = [];
    let currentWeek: DayData[] = [];
    const currentDate = new Date(startDate);

    let activeDays = 0;
    let totalLessons = 0;
    let totalXp = 0;

    while (currentDate <= todayDate || currentWeek.length > 0) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const activity = activityMap.get(dateStr);
      const lessonsCompleted = activity?.lessonsCompleted || 0;
      const reflectionsWritten = activity?.reflectionsWritten || 0;
      const xpEarned = activity?.xpEarned || 0;

      let level = 0;
      if (lessonsCompleted >= 3) level = 4;
      else if (lessonsCompleted >= 2) level = 3;
      else if (lessonsCompleted >= 1) level = 2;
      else if (activity) level = 1;

      const isToday = dateStr === today;
      const isFuture = currentDate > todayDate;

      if (!isFuture && lessonsCompleted > 0) {
        activeDays++;
        totalLessons += lessonsCompleted;
        totalXp += xpEarned;
      }

      currentWeek.push({
        date: dateStr,
        level: isFuture ? -1 : level,
        lessonsCompleted,
        reflectionsWritten,
        xpEarned,
        isToday,
        isFuture
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);

      if (isFuture && currentWeek.length === 0) break;
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        const futureDate = new Date(currentDate);
        currentWeek.push({
          date: futureDate.toISOString().split('T')[0],
          level: -1,
          lessonsCompleted: 0,
          reflectionsWritten: 0,
          xpEarned: 0,
          isToday: false,
          isFuture: true
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(currentWeek);
    }

    return {
      weeks,
      stats: { activeDays, totalLessons, totalXp }
    };
  }, [getStreakCalendarData, months, today]);

  const getLevelColor = (level: number, isToday: boolean) => {
    if (level === -1) return 'bg-stone-900/30 light:bg-stone-200/30';
    if (isToday && level === 0) return 'bg-stone-800 light:bg-stone-200 ring-2 ring-amber-500/50';
    switch (level) {
      case 0: return 'bg-stone-800/50 light:bg-stone-200/50';
      case 1: return 'bg-emerald-900/60 light:bg-emerald-200/60';
      case 2: return 'bg-emerald-700/70 light:bg-emerald-400/70';
      case 3: return 'bg-emerald-500/80 light:bg-emerald-500/80';
      case 4: return 'bg-emerald-400 shadow-lg shadow-emerald-500/20 light:bg-emerald-500 light:shadow-emerald-500/30';
      default: return 'bg-stone-800/50 light:bg-stone-200/50';
    }
  };

  const getMonthLabels = () => {
    const labels: Array<{ month: string; index: number }> = [];
    let lastMonth = '';

    weeks.forEach((week, weekIndex) => {
      if (week[0]) {
        const firstDayOfWeek = new Date(week[0].date);
        const monthStr = firstDayOfWeek.toLocaleDateString(localeTag, { month: 'short' });

        if (monthStr !== lastMonth) {
          labels.push({ month: monthStr, index: weekIndex });
          lastMonth = monthStr;
        }
      }
    });

    return labels;
  };

  const monthLabels = getMonthLabels();

  // Calculate consistency percentage
  const totalDays = Math.min(months * 30, weeks.length * 7);
  const consistencyPercent = totalDays > 0 ? Math.round((stats.activeDays / totalDays) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-stone-900/80 to-stone-950 light:from-white light:to-stone-50 border border-stone-800 light:border-stone-200 rounded-2xl p-6">
      {/* Header with meaning */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white light:text-stone-900 flex items-center gap-2">
            <Calendar size={20} className="text-stone-500 light:text-stone-500" />
            {c.commitment}
          </h3>
          <p className="text-sm text-stone-500 light:text-stone-500 mt-1">
            {c.daysPractice.replace('{days}', String(stats.activeDays)).replace('{months}', String(months))}
          </p>
        </div>

        {/* Streak badges */}
        <div className="flex gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-400">
              <Flame size={18} />
              <span className="text-xl font-bold">{currentStreak}</span>
            </div>
            <div className="text-xs text-stone-500 light:text-stone-500">{c.current}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400">
              <Trophy size={18} />
              <span className="text-xl font-bold">{longestStreak}</span>
            </div>
            <div className="text-xs text-stone-500 light:text-stone-500">{c.best}</div>
          </div>
        </div>
      </div>

      {/* Consistency bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-stone-400 light:text-stone-600">{c.consistency}</span>
          <span className="text-white light:text-stone-900 font-medium">{consistencyPercent}%</span>
        </div>
        <div className="h-2 bg-stone-800 light:bg-stone-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${consistencyPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-stone-600 light:text-stone-500 mt-2">
          {consistencyPercent >= 80
            ? c.consistencyHigh
            : consistencyPercent >= 50
            ? c.consistencyMid
            : consistencyPercent >= 20
            ? c.consistencyLow
            : c.consistencyStart}
        </p>
      </div>

      {/* Month labels */}
      <div className="flex mb-2 text-xs text-stone-500 light:text-stone-500">
        <div className="w-6" />
        <div className="flex-1 flex">
          {monthLabels.map(({ month, index }, i) => (
            <div
              key={`${month}-${index}`}
              className="text-xs"
              style={{
                marginLeft: i === 0 ? 0 : `${(index - (monthLabels[i - 1]?.index || 0)) * 14 - 20}px`
              }}
            >
              {month}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="flex gap-[3px]">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] text-[10px] text-stone-600 light:text-stone-500 pr-1">
          <div className="h-[14px]" />
          <div className="h-[14px] flex items-center">M</div>
          <div className="h-[14px]" />
          <div className="h-[14px] flex items-center">W</div>
          <div className="h-[14px]" />
          <div className="h-[14px] flex items-center">F</div>
          <div className="h-[14px]" />
        </div>

        {/* Weeks */}
        <div className="flex gap-[3px] flex-1 overflow-x-auto pb-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {week.map((day, dayIndex) => (
                <motion.button
                  key={day.date}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: (weekIndex * 7 + dayIndex) * 0.001 }}
                  onClick={() => !day.isFuture && setSelectedDay(day)}
                  disabled={day.isFuture}
                  className={`w-[14px] h-[14px] rounded-sm transition-all ${getLevelColor(day.level, day.isToday)} ${
                    !day.isFuture ? 'hover:ring-2 hover:ring-white/30 cursor-pointer' : 'cursor-default'
                  }`}
                  title={day.isFuture ? '' : `${day.date}: ${day.lessonsCompleted} ${day.lessonsCompleted === 1 ? c.lesson : c.lessons}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-xs text-stone-600 light:text-stone-500">
          {currentStreak > 0
            ? c.andCounting
              .replace('{count}', String(currentStreak))
              .replace('{dayWord}', currentStreak === 1 ? c.day : c.days)
            : c.startStreakToday}
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-500 light:text-stone-500">
          <span>{c.less}</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-[12px] h-[12px] rounded-sm ${getLevelColor(level, false)}`}
            />
          ))}
          <span>{c.more}</span>
        </div>
      </div>

      {/* Day detail modal */}
      <AnimatePresence>
        {selectedDay && !selectedDay.isFuture && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 light:bg-stone-900/50"
            onClick={() => setSelectedDay(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-stone-900 light:bg-stone-100 border border-stone-700 light:border-stone-300 rounded-2xl p-6 max-w-sm w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white light:text-stone-900">
                  {new Date(selectedDay.date).toLocaleDateString(localeTag, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h4>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="p-1 text-stone-500 hover:text-white light:hover:text-stone-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {selectedDay.lessonsCompleted > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-stone-800/50 light:bg-stone-200/50 rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold text-emerald-400">
                        {selectedDay.lessonsCompleted}
                      </div>
                      <div className="text-xs text-stone-500 light:text-stone-500">
                        {selectedDay.lessonsCompleted === 1 ? c.lesson : c.lessons}
                      </div>
                    </div>
                    <div className="bg-stone-800/50 light:bg-stone-200/50 rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold text-amber-400">
                        +{selectedDay.xpEarned}
                      </div>
                      <div className="text-xs text-stone-500 light:text-stone-500">{c.xpEarned}</div>
                    </div>
                  </div>

                  {selectedDay.reflectionsWritten > 0 && (
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
                      <div className="text-sm text-purple-300">
                        {c.reflectionWritten
                          .replace('{count}', String(selectedDay.reflectionsWritten))
                          .replace('{suffix}', selectedDay.reflectionsWritten !== 1 ? 's' : '')}
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-stone-400 light:text-stone-600 text-center">
                    {selectedDay.isToday
                      ? c.todayGreatWork
                      : c.showedUp}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-800/50 light:bg-stone-200/50 flex items-center justify-center">
                    <Calendar size={24} className="text-stone-600 light:text-stone-500" />
                  </div>
                  <p className="text-stone-400 light:text-stone-600">
                    {selectedDay.isToday
                      ? c.noLessonsToday
                      : c.noPractice}
                  </p>
                  {!selectedDay.isToday && (
                    <p className="text-xs text-stone-600 light:text-stone-500 mt-2">
                      {c.everyDayOpportunity}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default StreakCalendar;
