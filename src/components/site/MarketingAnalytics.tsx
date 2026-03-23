'use client';

import { useEffect, useRef } from 'react';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem('sw-session');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('sw-session', id);
  }
  return id;
}

function track(eventType: string, data?: Record<string, unknown>) {
  const sessionId = getSessionId();
  if (!sessionId) return;

  const payload = JSON.stringify({ session_id: sessionId, event_type: eventType, event_data: data, page: '/site' });
  navigator.sendBeacon?.('/api/log/marketing', payload) ||
    fetch('/api/log/marketing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
}

/** Parse UTM parameters from URL */
function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
    const val = params.get(key);
    if (val) utm[key] = val;
  }
  return utm;
}

/** Register the session with full visitor metadata (called once per session) */
function registerSession() {
  const sessionId = getSessionId();
  if (!sessionId) return;
  // Only register once per session
  if (sessionStorage.getItem('sw-session-registered')) return;
  sessionStorage.setItem('sw-session-registered', '1');

  const utm = getUtmParams();
  const payload = {
    session_id: sessionId,
    event_type: 'session_start',
    event_data: {
      referrer: document.referrer || null,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      language: navigator.language || null,
      landing_page: window.location.pathname,
      ...utm,
    },
    page: '/site',
  };

  fetch('/api/log/marketing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

export default function MarketingAnalytics() {
  const scrollMilestones = useRef(new Set<number>());

  useEffect(() => {
    const handleScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = Math.round((window.scrollY / scrollable) * 100);
      for (const milestone of [25, 50, 75, 100]) {
        if (pct >= milestone && !scrollMilestones.current.has(milestone)) {
          scrollMilestones.current.add(milestone);
          track('scroll_depth', { percent: milestone });
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Register session + track page view on mount
  useEffect(() => {
    registerSession();
    track('page_view');
  }, []);

  // Track CTA clicks via data-cta attributes (locale-independent)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-cta]');
      if (!target) return;
      const ctaType = target.getAttribute('data-cta');
      const section = target.closest('section')?.id ?? 'unknown';
      track('cta_click', { type: ctaType, location: section });
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Track session end (time on page) when user leaves
  useEffect(() => {
    const startTime = Date.now();
    const handleUnload = () => {
      const duration = Math.round((Date.now() - startTime) / 1000);
      track('session_end', { duration_seconds: duration });
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  return null;
}
