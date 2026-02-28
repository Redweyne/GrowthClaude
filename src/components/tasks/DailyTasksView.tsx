'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListChecks, Sparkles } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { TaskInput } from './TaskInput';
import { useTasksStore } from '@/store/useTasksStore';
import { useAudio } from '@/hooks/useAudio';
import { useHaptics } from '@/hooks/useHaptics';

function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

interface ConfettiRainParticle {
  id: number;
  x: number;
  delay: number;
  size: number;
  color: string;
  rotation: number;
}

const RAIN_COLORS = ['#fbbf24', '#f59e0b', '#d97706', '#34d399', '#fcd34d', '#a78bfa'];

export function DailyTasksView() {
  const { addTask, completeTask, clearOldTasks } = useTasksStore();
  const tasks = useTasksStore(s => s.tasks);
  const audio = useAudio();
  const { customHaptic } = useHaptics();

  const [newTaskIds, setNewTaskIds] = useState<Set<string>>(new Set());
  const [showAllDone, setShowAllDone] = useState(false);
  const [confettiRain, setConfettiRain] = useState<ConfettiRainParticle[]>([]);

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
    // Remove "new" flag after animation
    setTimeout(() => {
      setNewTaskIds(prev => {
        const next = new Set(prev);
        next.delete(task.id);
        return next;
      });
    }, 600);
  }, [addTask]);

  const handleCompleteTask = useCallback((taskId: string) => {
    completeTask(taskId);

    // Check if this was the last pending task
    const remainingAfter = pendingTasks.filter(t => t.id !== taskId);
    if (remainingAfter.length === 0 && todaysTasks.length > 0) {
      // All done celebration!
      setTimeout(() => {
        setShowAllDone(true);
        audio.playUI('levelUp');
        customHaptic([30, 50, 30, 50, 40, 80, 60]);

        // Confetti rain
        const rainParticles: ConfettiRainParticle[] = [];
        for (let i = 0; i < 25; i++) {
          rainParticles.push({
            id: Date.now() + i,
            x: Math.random() * 100,
            delay: Math.random() * 0.5,
            size: 4 + Math.random() * 8,
            color: RAIN_COLORS[Math.floor(Math.random() * RAIN_COLORS.length)],
            rotation: Math.random() * 360,
          });
        }
        setConfettiRain(rainParticles);

        setTimeout(() => {
          setShowAllDone(false);
          setConfettiRain([]);
        }, 2500);
      }, 400);
    }
  }, [completeTask, pendingTasks, todaysTasks, audio, customHaptic]);

  return (
    <div
      className="h-full flex flex-col bg-stone-950 light:bg-stone-50 overflow-hidden"
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
          {getFormattedDate()}
        </motion.p>
        <motion.h1
          className="text-2xl font-bold text-white light:text-stone-900 mt-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Daily Tasks
        </motion.h1>
        <motion.p
          className="text-xs text-stone-500 light:text-stone-400 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {todaysTasks.length === 0
            ? 'Add your first task below'
            : pendingTasks.length === 0
              ? `All ${completedCount} tasks conquered!`
              : `${pendingTasks.length} remaining \u00B7 ${completedCount} done`}
        </motion.p>
      </div>

      {/* Task list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <AnimatePresence mode="popLayout">
          {pendingTasks.length === 0 && todaysTasks.length === 0 ? (
            /* Empty state */
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center pt-20 text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ListChecks size={56} className="text-stone-700 light:text-stone-300" strokeWidth={1.5} />
              </motion.div>
              <p className="mt-4 text-stone-500 light:text-stone-400 text-sm font-medium">
                Your slate is clean
              </p>
              <p className="mt-1 text-stone-600 light:text-stone-400 text-xs">
                Write what you want to conquer today
              </p>
            </motion.div>
          ) : pendingTasks.length === 0 && completedCount > 0 ? (
            /* All done state */
            <motion.div
              key="alldone"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center pt-20 text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles size={56} className="text-amber-400" strokeWidth={1.5} />
              </motion.div>
              <p className="mt-4 text-amber-300 light:text-amber-600 text-sm font-bold">
                You conquered everything
              </p>
              <p className="mt-1 text-stone-500 light:text-stone-400 text-xs">
                {completedCount} task{completedCount !== 1 ? 's' : ''} scratched off today
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

      {/* Input area */}
      <div className="shrink-0">
        <TaskInput onAddTask={handleAddTask} />
      </div>

      {/* All Done celebration overlay */}
      <AnimatePresence>
        {showAllDone && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background dim */}
            <motion.div
              className="absolute inset-0 bg-stone-950/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Text */}
            <motion.div
              className="relative z-10 text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <h2 className="text-4xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                All Done!
              </h2>
              <p className="mt-2 text-stone-300 text-sm">
                You crushed it today
              </p>
            </motion.div>

            {/* Confetti rain */}
            {confettiRain.map((p) => (
              <motion.div
                key={p.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${p.x}%`,
                  width: p.size,
                  height: p.size,
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                  backgroundColor: p.color,
                }}
                initial={{ top: '-5%', rotate: 0, opacity: 1 }}
                animate={{
                  top: '110%',
                  rotate: p.rotation + 720,
                  opacity: [1, 1, 1, 0],
                  x: [0, Math.sin(p.id) * 30, Math.cos(p.id) * -20, Math.sin(p.id) * 15],
                }}
                transition={{
                  duration: 1.8 + Math.random() * 0.8,
                  delay: p.delay,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
