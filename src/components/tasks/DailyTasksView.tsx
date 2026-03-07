'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListChecks, Plus, Sparkles } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { AddTaskOverlay } from './AddTaskOverlay';
import { useTasksStore } from '@/store/useTasksStore';
import { useAudio } from '@/hooks/useAudio';
import { useHaptics } from '@/hooks/useHaptics';
import { Confetti } from '@/components/effects/Confetti';
import { GoldShimmer, GlowRing, LightSweep } from '@/components/effects/GoldShimmer';
import { useTranslation } from '@/i18n';

function getFormattedDate(localeTag: string): string {
  return new Date().toLocaleDateString(localeTag, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function DailyTasksView() {
  const { locale } = useTranslation();
  const { addTask, completeTask, clearOldTasks } = useTasksStore();
  const tasks = useTasksStore(s => s.tasks);
  const audio = useAudio();
  const { customHaptic } = useHaptics();
  const localeTag = locale === 'ar' ? 'ar' : locale === 'fr' ? 'fr-FR' : 'en-US';

  const copy = {
    en: {
      title: 'Daily Tasks',
      tapToBegin: 'Tap the golden button to begin',
      allConquered: 'All {count} tasks conquered!',
      remainingDone: '{remaining} remaining · {done} done',
      emptyTitle: 'Your slate is clean',
      emptyBody: 'Tap the golden button to add your first task',
      allDoneTitle: 'You conquered everything',
      crossedOffToday: '{count} task{suffix} crossed off today',
      addTaskAria: 'Add task',
      crushedIt: 'You crushed it!',
      conqueredToday: '{count} task{suffix} conquered today',
    },
    fr: {
      title: 'Tâches du jour',
      tapToBegin: 'Touchez le bouton doré pour commencer',
      allConquered: '{count} tâches terminées !',
      remainingDone: '{remaining} restantes · {done} terminées',
      emptyTitle: 'Votre liste est vide',
      emptyBody: 'Touchez le bouton doré pour ajouter votre première tâche',
      allDoneTitle: 'Vous avez tout conquis',
      crossedOffToday: "{count} tâche{suffix} cochée aujourd'hui",
      addTaskAria: 'Ajouter une tâche',
      crushedIt: 'Mission accomplie !',
      conqueredToday: "{count} tâche{suffix} accomplie aujourd'hui",
    },
    ar: {
      title: 'مهام اليوم',
      tapToBegin: 'اضغط الزر الذهبي للبدء',
      allConquered: 'تم إنجاز كل {count} مهمة!',
      remainingDone: '{remaining} متبقية · {done} مكتملة',
      emptyTitle: 'قائمتك نظيفة',
      emptyBody: 'اضغط الزر الذهبي لإضافة أول مهمة',
      allDoneTitle: 'أنجزت كل شيء',
      crossedOffToday: 'تم شطب {count} مهمة{suffix} اليوم',
      addTaskAria: 'إضافة مهمة',
      crushedIt: 'أبدعت!',
      conqueredToday: 'تم إنجاز {count} مهمة{suffix} اليوم',
    },
  } as const;
  const c = copy[locale] ?? copy.en;

  const [newTaskIds, setNewTaskIds] = useState<Set<string>>(new Set());
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [showAllDone, setShowAllDone] = useState(false);

  const todayKey = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todaysTasks = useMemo(
    () => tasks.filter(t => t.dateKey === todayKey),
    [tasks, todayKey]
  );
  const pendingTasks = useMemo(
    () => todaysTasks.filter(t => !t.completedAt),
    [todaysTasks]
  );
  const completedCount = useMemo(
    () => todaysTasks.filter(t => t.completedAt).length,
    [todaysTasks]
  );

  // Clear old tasks on mount
  useEffect(() => {
    clearOldTasks(7);
  }, [clearOldTasks]);

  const handleAddTask = useCallback((text: string) => {
    const task = addTask(text);
    setNewTaskIds(prev => new Set(prev).add(task.id));
    setTimeout(() => {
      setNewTaskIds(prev => {
        const next = new Set(prev);
        next.delete(task.id);
        return next;
      });
    }, 700);
  }, [addTask]);

  const handleCompleteTask = useCallback((taskId: string) => {
    completeTask(taskId);

    // Check if this was the last pending task
    const remainingAfter = pendingTasks.filter(t => t.id !== taskId);
    if (remainingAfter.length === 0 && todaysTasks.length > 0) {
      // ALL DONE — MASSIVE layered celebration
      setTimeout(() => {
        setShowAllDone(true);

        // Layered audio
        audio.playUI('levelUp');
        setTimeout(() => audio.playUI('celebrate'), 300);

        // Extended intense haptic burst
        customHaptic([40, 50, 40, 50, 50, 80, 70, 100, 50]);

        setTimeout(() => {
          setShowAllDone(false);
        }, 3500);
      }, 500);
    }
  }, [completeTask, pendingTasks, todaysTasks, audio, customHaptic]);

  return (
    <div
      className="h-full flex flex-col bg-stone-950 light:bg-stone-50 relative"
      style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}
    >
      {/* Header */}
      <div className="shrink-0 px-5 pt-4 pb-3">
        <motion.p
          className="text-sm text-stone-400 light:text-stone-500 font-medium"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {getFormattedDate(localeTag)}
        </motion.p>
        <motion.h1
          className="text-2xl font-bold text-white light:text-stone-900 mt-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {c.title}
        </motion.h1>
        <motion.p
          className="text-xs text-stone-500 light:text-stone-400 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {todaysTasks.length === 0
            ? c.tapToBegin
            : pendingTasks.length === 0
              ? c.allConquered.replace('{count}', String(completedCount))
              : c.remainingDone
                .replace('{remaining}', String(pendingTasks.length))
                .replace('{done}', String(completedCount))}
        </motion.p>
      </div>

      {/* Task list — SCROLLABLE with generous bottom padding */}
      <div
        className="flex-1 min-h-0 overflow-y-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingBottom: '120px' }}
      >
        <AnimatePresence mode="popLayout">
          {pendingTasks.length === 0 && todaysTasks.length === 0 ? (
            /* Empty state */
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center pt-24 text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.3, 0.55, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ListChecks size={64} className="text-stone-700 light:text-stone-300" strokeWidth={1.5} />
              </motion.div>
              <p className="mt-6 text-stone-400 light:text-stone-500 text-base font-semibold">
                {c.emptyTitle}
              </p>
              <p className="mt-2 text-stone-600 light:text-stone-400 text-xs">
                {c.emptyBody}
              </p>
            </motion.div>
          ) : pendingTasks.length === 0 && completedCount > 0 ? (
            /* All done persistent state */
            <motion.div
              key="alldone"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center pt-24 text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.12, 1],
                  rotate: [0, 8, -8, 0],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles size={64} className="text-amber-400" strokeWidth={1.5} />
              </motion.div>
              <p className="mt-6 text-amber-300 light:text-amber-600 text-base font-bold">
                {c.allDoneTitle}
              </p>
              <p className="mt-2 text-stone-500 light:text-stone-400 text-xs">
                {c.crossedOffToday
                  .replace('{count}', String(completedCount))
                  .replace('{suffix}', completedCount !== 1 ? 's' : '')}
              </p>
            </motion.div>
          ) : (
            /* Task cards */
            pendingTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                isNew={newTaskIds.has(task.id)}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Floating Add Task button */}
      <motion.button
        className="fixed bottom-24 right-5 z-30 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center animate-[float_3s_ease-in-out_infinite]"
        animate={{
          boxShadow: [
            '0 0 25px rgba(251,191,36,0.4)',
            '0 0 45px rgba(251,191,36,0.6)',
            '0 0 25px rgba(251,191,36,0.4)',
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        whileTap={{ scale: 0.88 }}
        onClick={() => setShowAddOverlay(true)}
        aria-label={c.addTaskAria}
      >
        <Plus size={28} className="text-stone-950" strokeWidth={3} />
      </motion.button>

      {/* Add Task Overlay */}
      <AddTaskOverlay
        isOpen={showAddOverlay}
        onClose={() => setShowAddOverlay(false)}
        onAddTask={handleAddTask}
      />

      {/* ═══ ALL DONE CELEBRATION — LAYERED EFFECTS ═══ */}

      {/* Light sweep */}
      <LightSweep active={showAllDone} color="#fbbf24" duration={1.5} />

      {/* Glow rings */}
      <GlowRing active={showAllDone} rings={4} color="#fbbf24" />

      {/* Confetti — real multi-shape system */}
      <Confetti active={showAllDone} particleCount={50} duration={3500} />

      {/* Gold shimmer — rising particles */}
      <GoldShimmer active={showAllDone} variant="gold" intensity="intense" duration={3000} />

      {/* Celebration text overlay */}
      <AnimatePresence>
        {showAllDone && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background dim */}
            <motion.div
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Text */}
            <motion.div
              className="relative z-10 text-center"
              initial={{ scale: 0.4, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.3, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 12 }}
            >
              <h2 className="text-5xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-lg">
                {c.crushedIt}
              </h2>
              <motion.p
                className="mt-3 text-stone-300 text-base"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {c.conqueredToday
                  .replace('{count}', String(completedCount))
                  .replace('{suffix}', completedCount !== 1 ? 's' : '')}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
