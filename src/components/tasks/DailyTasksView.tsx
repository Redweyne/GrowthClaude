'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListChecks, Plus, Sparkles } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { AddTaskOverlay } from './AddTaskOverlay';
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
  const [showAddOverlay, setShowAddOverlay] = useState(false);
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
      // ALL DONE — MASSIVE celebration
      setTimeout(() => {
        setShowAllDone(true);
        audio.playUI('levelUp');
        customHaptic([40, 50, 40, 50, 50, 80, 70, 100, 50]);

        // Confetti rain
        const rainParticles: ConfettiRainParticle[] = [];
        for (let i = 0; i < 30; i++) {
          rainParticles.push({
            id: Date.now() + i,
            x: Math.random() * 100,
            delay: Math.random() * 0.6,
            size: 5 + Math.random() * 9,
            color: RAIN_COLORS[Math.floor(Math.random() * RAIN_COLORS.length)],
            rotation: Math.random() * 360,
          });
        }
        setConfettiRain(rainParticles);

        setTimeout(() => {
          setShowAllDone(false);
          setConfettiRain([]);
        }, 3000);
      }, 500);
    }
  }, [completeTask, pendingTasks, todaysTasks, audio, customHaptic]);

  return (
    <div
      className="h-full flex flex-col bg-stone-950 light:bg-stone-50 overflow-hidden relative"
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
            ? 'Tap the golden button to begin'
            : pendingTasks.length === 0
              ? `All ${completedCount} tasks conquered!`
              : `${pendingTasks.length} remaining \u00B7 ${completedCount} done`}
        </motion.p>
      </div>

      {/* Task list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                  scale: [1, 1.06, 1],
                  opacity: [0.35, 0.55, 0.35],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ListChecks size={60} className="text-stone-700 light:text-stone-300" strokeWidth={1.5} />
              </motion.div>
              <p className="mt-5 text-stone-400 light:text-stone-500 text-base font-semibold">
                Your slate is clean
              </p>
              <p className="mt-1.5 text-stone-600 light:text-stone-400 text-xs">
                Tap the golden button to add your first task
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
                  scale: [1, 1.1, 1],
                  rotate: [0, 6, -6, 0],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles size={60} className="text-amber-400" strokeWidth={1.5} />
              </motion.div>
              <p className="mt-5 text-amber-300 light:text-amber-600 text-base font-bold">
                You conquered everything
              </p>
              <p className="mt-1.5 text-stone-500 light:text-stone-400 text-xs">
                {completedCount} task{completedCount !== 1 ? 's' : ''} crossed off today
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
        className="fixed bottom-24 right-5 z-30 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
        animate={{
          scale: [1, 1.06, 1],
          boxShadow: [
            '0 0 20px rgba(251,191,36,0.3)',
            '0 0 35px rgba(251,191,36,0.5)',
            '0 0 20px rgba(251,191,36,0.3)',
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAddOverlay(true)}
        aria-label="Add task"
      >
        <Plus size={28} className="text-stone-950" strokeWidth={3} />
      </motion.button>

      {/* Add Task Overlay */}
      <AddTaskOverlay
        isOpen={showAddOverlay}
        onClose={() => setShowAddOverlay(false)}
        onAddTask={handleAddTask}
      />

      {/* ALL DONE celebration overlay */}
      <AnimatePresence>
        {showAllDone && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background dim */}
            <motion.div
              className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Celebration text */}
            <motion.div
              className="relative z-10 text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.3, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <h2 className="text-5xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                You crushed it!
              </h2>
              <p className="mt-3 text-stone-300 text-base">
                {completedCount} task{completedCount !== 1 ? 's' : ''} conquered today
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
                  top: '115%',
                  rotate: p.rotation + 720,
                  opacity: [1, 1, 1, 0],
                  x: [0, Math.sin(p.id) * 35, Math.cos(p.id) * -25, Math.sin(p.id) * 18],
                }}
                transition={{
                  duration: 2 + Math.random() * 1,
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
