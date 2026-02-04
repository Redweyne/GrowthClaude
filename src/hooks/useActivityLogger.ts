'use client';

// ============================================================================
// ACTIVITY LOGGER HOOK
// Client-side event collection with batching, sendBeacon, and view tracking.
// ============================================================================

import { useRef, useCallback, useEffect } from 'react';
import { useStore } from '@/store/useStore';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface QueuedEvent {
  eventType: string;
  eventData: string | null;
  view: string | null;
  timestamp: string;
}

interface QueuedPageView {
  viewName: string;
  enteredAt: string;
  duration: number | null;
}

interface ActivityLogger {
  logEvent: (type: string, data?: Record<string, unknown>) => void;
  trackView: (viewName: string) => void;
  updateUser: (userId: string, userName?: string | null) => void;
}

const FLUSH_INTERVAL_MS = 5000;
const FLUSH_THRESHOLD = 10;

export function useActivityLogger(): ActivityLogger {
  const sessionIdRef = useRef<string | null>(null);
  const userIdRef = useRef<string | null>(null);
  const eventBufferRef = useRef<QueuedEvent[]>([]);
  const pageViewBufferRef = useRef<QueuedPageView[]>([]);
  const currentViewRef = useRef<string | null>(null);
  const viewEnteredAtRef = useRef<string | null>(null);
  const flushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initializedRef = useRef(false);

  // Skip on admin pages
  const isAdmin =
    typeof window !== 'undefined' &&
    window.location.pathname.includes('/admin');

  // ─────────────────────────────────────────────────────────────────────────
  // FLUSH — send buffered events to the server
  // ─────────────────────────────────────────────────────────────────────────

  const flush = useCallback(
    (useBeacon = false) => {
      const events = [...eventBufferRef.current];
      const pageViews = [...pageViewBufferRef.current];
      eventBufferRef.current = [];
      pageViewBufferRef.current = [];

      if ((events.length === 0 && pageViews.length === 0) || !sessionIdRef.current) {
        return;
      }

      const payload = JSON.stringify({
        sessionId: sessionIdRef.current,
        userId: userIdRef.current,
        events,
        pageViews,
      });

      const url = `${basePath}/api/log/event`;

      // Use sendBeacon for page unload (more reliable than fetch)
      if (useBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
      } else {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true, // Allows request to outlive the page
        }).catch(() => {
          // Silently fail — logging should never break the app
        });
      }
    },
    []
  );

  // ─────────────────────────────────────────────────────────────────────────
  // LOG EVENT — add event to buffer, auto-flush when full
  // ─────────────────────────────────────────────────────────────────────────

  const logEvent = useCallback(
    (type: string, data?: Record<string, unknown>) => {
      if (isAdmin) return;

      eventBufferRef.current.push({
        eventType: type,
        eventData: data ? JSON.stringify(data) : null,
        view: currentViewRef.current,
        timestamp: new Date().toISOString(),
      });

      if (eventBufferRef.current.length >= FLUSH_THRESHOLD) {
        flush();
      }
    },
    [flush, isAdmin]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // TRACK VIEW — record screen transitions with duration
  // ─────────────────────────────────────────────────────────────────────────

  const trackView = useCallback(
    (viewName: string) => {
      if (isAdmin) return;
      if (viewName === currentViewRef.current) return; // No change

      const now = new Date().toISOString();

      // Close out previous view with duration
      if (currentViewRef.current && viewEnteredAtRef.current) {
        const enteredAt = new Date(viewEnteredAtRef.current).getTime();
        const duration = Math.round((Date.now() - enteredAt) / 1000);

        pageViewBufferRef.current.push({
          viewName: currentViewRef.current,
          enteredAt: viewEnteredAtRef.current,
          duration,
        });

        logEvent('view_change', {
          from: currentViewRef.current,
          to: viewName,
          durationSeconds: duration,
        });
      }

      currentViewRef.current = viewName;
      viewEnteredAtRef.current = now;
    },
    [logEvent, isAdmin]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // UPDATE USER — called when userId becomes available (post-onboarding)
  // ─────────────────────────────────────────────────────────────────────────

  const updateUser = useCallback(
    (userId: string, userName?: string | null) => {
      userIdRef.current = userId;
      // Also update the session record with the userId
      if (sessionIdRef.current) {
        fetch(`${basePath}/api/log/event`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            userId,
            events: [],
          }),
          keepalive: true,
        }).catch(() => {});
      }
      // Log separately with userName
      if (userName) {
        logEvent('user_identified', { userId, userName });
      }
    },
    [logEvent]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // INITIALIZE SESSION — runs once on mount
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (isAdmin || initializedRef.current) return;
    initializedRef.current = true;

    const store = useStore.getState();
    userIdRef.current = store.userId;

    // Create a session on the server
    fetch(`${basePath}/api/log/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: store.userId,
        userName: store.name,
        appLanguage: store.language,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        referrer: document.referrer || null,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        sessionIdRef.current = data.sessionId;
        logEvent('session_start');
      })
      .catch(() => {
        // Silently fail
      });

    // Set up periodic flush
    flushTimerRef.current = setInterval(() => flush(), FLUSH_INTERVAL_MS);

    // Flush on page unload / visibility change
    const handleUnload = () => {
      logEvent('session_end');
      flush(true); // Use sendBeacon
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flush(true); // Flush when tab goes to background
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (flushTimerRef.current) clearInterval(flushTimerRef.current);
      window.removeEventListener('beforeunload', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      flush(true);
    };
  }, [isAdmin, logEvent, flush]);

  return { logEvent, trackView, updateUser };
}
