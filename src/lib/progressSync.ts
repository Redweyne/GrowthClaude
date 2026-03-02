'use client';

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS SYNC - Full state backup/restore via Supabase JSONB blobs
// ═══════════════════════════════════════════════════════════════════════════
//
// Saves ALL Zustand store state to a single `user_progress` row per user.
// This ensures reliable full-state restore on login, regardless of whether
// the granular per-table sync worked.
//
// ═══════════════════════════════════════════════════════════════════════════

import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
import { useStore } from '@/store/useStore';
import { useTasksStore } from '@/store/useTasksStore';
import { useEchoesStore } from '@/store/useEchoesStore';
import { useDailyPracticeStore } from '@/store/useDailyPracticeStore';
import { useSparkStore } from '@/store/useSparkStore';
import { getTodayDateString } from '@/types/dailyPractice';

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Strip functions from a Zustand store snapshot, keeping only serializable state. */
function extractState(storeState: Record<string, unknown>): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(storeState)) {
    if (typeof value !== 'function') {
      data[key] = value;
    }
  }
  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// SAVE ALL PROGRESS TO SUPABASE
// ─────────────────────────────────────────────────────────────────────────────

export async function saveAllProgress(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const client = getSupabaseBrowserClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('user_progress')
      .upsert(
        {
          user_id: userId,
          main_store: extractState(useStore.getState() as unknown as Record<string, unknown>),
          tasks_store: extractState(useTasksStore.getState() as unknown as Record<string, unknown>),
          echoes_store: extractState(useEchoesStore.getState() as unknown as Record<string, unknown>),
          daily_practice_store: extractState(useDailyPracticeStore.getState() as unknown as Record<string, unknown>),
          spark_store: extractState(useSparkStore.getState() as unknown as Record<string, unknown>),
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('[ProgressSync] Save failed:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[ProgressSync] Save error:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LOAD ALL PROGRESS FROM SUPABASE
// ─────────────────────────────────────────────────────────────────────────────

export async function loadAllProgress(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const client = getSupabaseBrowserClient();
  if (!client) return false;

  try {
    const { data, error } = await client
      .from('user_progress')
      .select('main_store, tasks_store, echoes_store, daily_practice_store, spark_store')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No row found — new user. Save current local state as their first backup.
        console.log('[ProgressSync] No server data found, saving current local state.');
        return await saveAllProgress(userId);
      }
      // Table might not exist yet (migration not run). Fail silently.
      console.warn('[ProgressSync] Load failed:', error.message);
      return false;
    }

    if (!data) return false;

    // Hydrate each store with server data (only if server has meaningful data)
    if (data.main_store && typeof data.main_store === 'object' && Object.keys(data.main_store).length > 0) {
      useStore.setState(data.main_store);
    }

    if (data.tasks_store && typeof data.tasks_store === 'object' && Object.keys(data.tasks_store).length > 0) {
      useTasksStore.setState(data.tasks_store);
    }

    if (data.echoes_store && typeof data.echoes_store === 'object' && Object.keys(data.echoes_store).length > 0) {
      useEchoesStore.setState(data.echoes_store);
    }

    if (data.daily_practice_store && typeof data.daily_practice_store === 'object' && Object.keys(data.daily_practice_store).length > 0) {
      // Strip stale todayProgress so initializeToday() creates fresh daily state.
      // Without this, yesterday's completed status would overwrite today's fresh progress.
      const dailyData = { ...data.daily_practice_store } as Record<string, unknown>;
      const todayProgress = dailyData.todayProgress as { date?: string } | null | undefined;
      if (todayProgress?.date && todayProgress.date !== getTodayDateString()) {
        dailyData.todayProgress = null;
        dailyData.hasInitializedToday = false;
      }
      useDailyPracticeStore.setState(dailyData);
    }

    if (data.spark_store && typeof data.spark_store === 'object' && Object.keys(data.spark_store).length > 0) {
      useSparkStore.setState(data.spark_store);
    }

    console.log('[ProgressSync] Loaded progress from server.');
    return true;
  } catch (err) {
    console.error('[ProgressSync] Load error:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CLEAR ALL LOCAL STORES
// ─────────────────────────────────────────────────────────────────────────────

export function clearAllStores(): void {
  useStore.getState().resetUser();
  useTasksStore.setState({ tasks: [], totalTasksCompleted: 0 });
  useEchoesStore.getState().resetEchoes();
  useDailyPracticeStore.getState().resetDailyPractice();
  useSparkStore.getState().resetSpark();

  // Also clear the persisted localStorage entries so they don't rehydrate
  if (typeof window !== 'undefined') {
    localStorage.removeItem('transformation-hub-storage');
    localStorage.removeItem('tasks-storage');
    localStorage.removeItem('echoes-storage');
    localStorage.removeItem('daily-practice-storage');
    localStorage.removeItem('spark-storage');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DEBOUNCED AUTO-SAVE
// ─────────────────────────────────────────────────────────────────────────────

let saveTimer: ReturnType<typeof setTimeout> | null = null;

export function debouncedSave(userId: string, delayMs = 5000): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    void saveAllProgress(userId);
  }, delayMs);
}

export function cancelPendingSave(): void {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
}
