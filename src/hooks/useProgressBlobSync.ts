'use client';

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS BLOB SYNC HOOK
// ═══════════════════════════════════════════════════════════════════════════
//
// Watches all Zustand stores and debounced-saves the full state to
// the `user_progress` JSONB blob table whenever changes occur.
// This runs alongside the existing granular useSupabaseStoreSync.
//
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store/useStore';
import { useTasksStore } from '@/store/useTasksStore';
import { useEchoesStore } from '@/store/useEchoesStore';
import { useDailyPracticeStore } from '@/store/useDailyPracticeStore';
import { useSparkStore } from '@/store/useSparkStore';
import { debouncedSave, cancelPendingSave, loadAllProgress } from '@/lib/progressSync';

export function useProgressBlobSync() {
  const { user, isAuthenticated, isConfigured } = useAuth();
  const hasHydratedRef = useRef(false);
  const prevUserIdRef = useRef<string | null>(null);

  // ─────────────────────────────────────────────────────────────────────────
  // HYDRATE: On login, load full state from server
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isConfigured || !isAuthenticated || !user) {
      hasHydratedRef.current = false;
      prevUserIdRef.current = null;
      return;
    }

    // Only hydrate once per user session (or when user changes)
    if (hasHydratedRef.current && prevUserIdRef.current === user.id) {
      return;
    }

    let cancelled = false;

    const hydrate = async () => {
      // Check if local stores look empty (fresh browser or after logout)
      const localState = useStore.getState();
      const hasLocalProgress =
        localState.onboardingComplete ||
        Object.keys(localState.completedLessons).length > 0;

      // If this is a fresh login (user ID changed) or local stores are empty,
      // load from the server blob.
      const isNewLogin = prevUserIdRef.current !== user.id;

      if (isNewLogin || !hasLocalProgress) {
        await loadAllProgress(user.id);
      }

      if (!cancelled) {
        hasHydratedRef.current = true;
        prevUserIdRef.current = user.id;
      }
    };

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [isConfigured, isAuthenticated, user?.id]);

  // ─────────────────────────────────────────────────────────────────────────
  // AUTO-SAVE: Subscribe to all stores and debounced-save on changes
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isConfigured || !isAuthenticated || !user) {
      cancelPendingSave();
      return;
    }

    const userId = user.id;

    const unsubs = [
      useStore.subscribe(() => debouncedSave(userId)),
      useTasksStore.subscribe(() => debouncedSave(userId)),
      useEchoesStore.subscribe(() => debouncedSave(userId)),
      useDailyPracticeStore.subscribe(() => debouncedSave(userId)),
      useSparkStore.subscribe(() => debouncedSave(userId)),
    ];

    return () => {
      unsubs.forEach((unsub) => unsub());
      cancelPendingSave();
    };
  }, [isConfigured, isAuthenticated, user?.id]);
}
