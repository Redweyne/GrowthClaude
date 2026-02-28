'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ═══════════════════════════════════════════════════════════════════════════
// DAILY TASKS STORE - "Scratch & Conquer"
// ═══════════════════════════════════════════════════════════════════════════

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export interface DailyTask {
  id: string;
  text: string;
  createdAt: string;
  completedAt: string | null;
  scratchProgress: number; // 0-100
  dateKey: string;         // YYYY-MM-DD
}

interface TasksState {
  tasks: DailyTask[];
  totalTasksCompleted: number;
}

interface TasksActions {
  addTask: (text: string) => DailyTask;
  updateScratchProgress: (taskId: string, progress: number) => void;
  completeTask: (taskId: string) => void;
  removeTask: (taskId: string) => void;
  getTodaysTasks: () => DailyTask[];
  getPendingToday: () => DailyTask[];
  getCompletedToday: () => DailyTask[];
  clearOldTasks: (daysToKeep?: number) => void;
}

export const useTasksStore = create<TasksState & TasksActions>()(
  persist(
    (set, get) => ({
      tasks: [],
      totalTasksCompleted: 0,

      addTask: (text: string) => {
        const task: DailyTask = {
          id: generateId(),
          text: text.trim(),
          createdAt: new Date().toISOString(),
          completedAt: null,
          scratchProgress: 0,
          dateKey: getTodayString(),
        };
        set(state => ({ tasks: [task, ...state.tasks] }));
        return task;
      },

      updateScratchProgress: (taskId, progress) => {
        set(state => ({
          tasks: state.tasks.map(t =>
            t.id === taskId ? { ...t, scratchProgress: Math.min(100, progress) } : t
          ),
        }));
      },

      completeTask: (taskId) => {
        set(state => ({
          tasks: state.tasks.map(t =>
            t.id === taskId
              ? { ...t, completedAt: new Date().toISOString(), scratchProgress: 100 }
              : t
          ),
          totalTasksCompleted: state.totalTasksCompleted + 1,
        }));
      },

      removeTask: (taskId) => {
        set(state => ({
          tasks: state.tasks.filter(t => t.id !== taskId),
        }));
      },

      getTodaysTasks: () => {
        const today = getTodayString();
        return get().tasks.filter(t => t.dateKey === today);
      },

      getPendingToday: () => {
        const today = getTodayString();
        return get().tasks.filter(t => t.dateKey === today && !t.completedAt);
      },

      getCompletedToday: () => {
        const today = getTodayString();
        return get().tasks.filter(t => t.dateKey === today && t.completedAt !== null);
      },

      clearOldTasks: (daysToKeep = 7) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - daysToKeep);
        const cutoffStr = cutoff.toISOString().split('T')[0];
        set(state => ({
          tasks: state.tasks.filter(t => t.dateKey >= cutoffStr),
        }));
      },
    }),
    {
      name: 'tasks-storage',
    }
  )
);
