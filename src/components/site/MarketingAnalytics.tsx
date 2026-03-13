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

export default function MarketingAnalytics() {
  const scrollMilestones = useRef(new Set<number>());

  useEffect(() => {
    const handleScroll = () => {
      const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
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

  useEffect(() => { track('page_view'); }, []);

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

  return null;
}
