'use client';

// ============================================================================
// ADMIN DASHBOARD — Sophisticated analytics with session timelines, date
// filtering, marketing site tracking, and step-by-step user journey views.
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/i18n';
import { describeEvent } from '@/lib/eventDescriptions';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// ─── Types ──────────────────────────────────────────────────────────────────

interface OverviewData {
  totalUsers: number;
  totalSessions: number;
  totalEvents: number;
  totalPageViews: number;
  totalMarketingEvents: number;
  todaySessions: number;
  todayEvents: number;
  weekSessions: number;
  recentEvents: EventRow[];
  topCountries: { country: string; count: number }[];
  topDevices: { deviceType: string; count: number }[];
}

interface SessionRow {
  id: string;
  userId: string | null;
  userName: string | null;
  country: string | null;
  city: string | null;
  deviceType: string | null;
  browser: string | null;
  os: string | null;
  appLanguage: string | null;
  createdAt: string;
  endedAt: string | null;
  eventCount: number;
}

interface SessionsData {
  sessions: SessionRow[];
  total: number;
  page: number;
  totalPages: number;
}

interface TimelineEntry {
  time: string;
  type: 'event' | 'pageview';
  description: string;
  detail: string | null;
  screen: string | null;
  raw: string | null;
  eventData?: Record<string, unknown> | null;
}

interface SessionDetailData {
  session: {
    id: string;
    userId: string | null;
    userName: string | null;
    country: string | null;
    city: string | null;
    region: string | null;
    browser: string | null;
    browserVersion: string | null;
    os: string | null;
    osVersion: string | null;
    deviceType: string | null;
    screenWidth: number | null;
    screenHeight: number | null;
    appLanguage: string | null;
    referrer: string | null;
    createdAt: string;
    endedAt: string | null;
  } | null;
  timeline: TimelineEntry[];
}

interface UserRow {
  userId: string;
  userName: string | null;
  country: string | null;
  city: string | null;
  deviceType: string | null;
  browser: string | null;
  os: string | null;
  appLanguage: string | null;
  firstSeen: string;
  lastSeen: string;
  sessionCount: number;
  eventCount: number;
}

interface EventRow {
  id: string;
  eventType: string;
  eventData: Record<string, unknown> | string | null;
  view: string | null;
  userId: string | null;
  userName: string | null;
  country: string | null;
  deviceType: string | null;
  browser?: string | null;
  timestamp: string;
}

interface EventsData {
  events: EventRow[];
  total: number;
  page: number;
  totalPages: number;
  eventTypes: { type: string; count: number }[];
}

interface AnalyticsData {
  screenViews: { viewName: string; count: number; avgDuration: number }[];
  topEvents: { eventType: string; count: number }[];
  sessionsPerDay: { date: string; count: number }[];
  browserBreakdown: { browser: string; count: number }[];
  osBreakdown: { os: string; count: number }[];
  languageBreakdown: { language: string; count: number }[];
}

interface MarketingData {
  totalEvents: number;
  pageViews: number;
  uniqueVisitors: number;
  ctaClicks: number;
  scrollFunnel: { 25: number; 50: number; 75: number; 100: number };
  ctaBreakdown: { label: string; count: number }[];
  recentEvents: {
    id: string;
    sessionId: string;
    eventType: string;
    eventData: Record<string, unknown> | null;
    page: string | null;
    createdAt: string;
  }[];
}

interface UserDetailData {
  sessions: {
    id: string;
    createdAt: string;
    endedAt: string | null;
    country: string | null;
    city: string | null;
    browser: string | null;
    os: string | null;
    deviceType: string | null;
    screenWidth: number | null;
    screenHeight: number | null;
    appLanguage: string | null;
  }[];
  events: EventRow[];
  pageViews: { viewName: string; enteredAt: string; duration: number | null }[];
}

type Tab = 'overview' | 'sessions' | 'users' | 'events' | 'site' | 'analytics';
type DatePreset = 'today' | '7d' | '30d' | 'all';

// ─── Helpers ────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString();
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function toDateInputValue(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDateRange(preset: DatePreset): { from: string; to: string } | null {
  if (preset === 'all') return null;
  const now = new Date();
  const to = toDateInputValue(now);
  if (preset === 'today') return { from: to, to };
  if (preset === '7d') {
    const d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return { from: toDateInputValue(d), to };
  }
  const d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return { from: toDateInputValue(d), to };
}

function describeMarketingEvent(e: { eventType: string; eventData: Record<string, unknown> | null }): string {
  switch (e.eventType) {
    case 'page_view': return 'Visited the landing page';
    case 'scroll_depth': return `Scrolled to ${(e.eventData as { percent?: number })?.percent ?? '?'}%`;
    case 'cta_click': {
      const d = e.eventData as { type?: string; location?: string } | null;
      return `Clicked "${d?.type || 'CTA'}" in ${d?.location || 'page'}`;
    }
    default: return e.eventType;
  }
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AdminPage() {
  const { locale } = useTranslation();
  const [secret, setSecret] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(false);

  // Date filter
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Data
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [sessionsData, setSessionsData] = useState<SessionsData | null>(null);
  const [sessionDetail, setSessionDetail] = useState<SessionDetailData | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [eventsData, setEventsData] = useState<EventsData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [marketing, setMarketing] = useState<MarketingData | null>(null);
  const [userDetail, setUserDetail] = useState<{ userId: string; data: UserDetailData } | null>(null);

  // Pagination & filters
  const [sessionsPage, setSessionsPage] = useState(1);
  const [eventsPage, setEventsPage] = useState(1);
  const [eventsTypeFilter, setEventsTypeFilter] = useState('');
  const [eventsUserFilter, setEventsUserFilter] = useState('');

  // Restore from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('admin_secret');
    if (stored) {
      setSecret(stored);
      setAuthenticated(true);
    }
  }, []);

  // ─── Date filter helpers ──────────────────────────────────────────────

  const handlePresetChange = (p: DatePreset) => {
    setDatePreset(p);
    const range = getDateRange(p);
    if (range) {
      setDateFrom(range.from);
      setDateTo(range.to);
    } else {
      setDateFrom('');
      setDateTo('');
    }
  };

  const dateParams = useCallback((): Record<string, string> => {
    const p: Record<string, string> = {};
    if (dateFrom) p.dateFrom = dateFrom;
    if (dateTo) p.dateTo = dateTo;
    return p;
  }, [dateFrom, dateTo]);

  // ─── API fetch helper ─────────────────────────────────────────────────

  const apiFetch = useCallback(
    async (action: string, params: Record<string, string> = {}) => {
      const query = new URLSearchParams({ action, ...params });
      const res = await fetch(`${basePath}/api/admin?${query}`, {
        headers: { Authorization: `Bearer ${secret}` },
      });
      const data = await res.json();
      if (!res.ok) {
        const reason = data.reason || data.error || `HTTP ${res.status}`;
        if (res.status === 401) {
          setAuthenticated(false);
          sessionStorage.removeItem('admin_secret');
        }
        throw new Error(reason);
      }
      return data;
    },
    [secret]
  );

  // ─── Login ────────────────────────────────────────────────────────────

  const handleLogin = async () => {
    setError('');
    try {
      const data = await apiFetch('overview');
      setAuthenticated(true);
      sessionStorage.setItem('admin_secret', secret);
      setOverview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // ─── Load tab data ────────────────────────────────────────────────────

  const loadTab = useCallback(
    async (t: Tab) => {
      setLoading(true);
      try {
        switch (t) {
          case 'overview': {
            const data = await apiFetch('overview', dateParams());
            setOverview(data);
            break;
          }
          case 'sessions': {
            const data = await apiFetch('sessions', { page: String(sessionsPage), limit: '30', ...dateParams() });
            setSessionsData(data);
            break;
          }
          case 'users': {
            const data = await apiFetch('users');
            setUsers(data.users);
            break;
          }
          case 'events': {
            const params: Record<string, string> = { page: String(eventsPage), limit: '50', ...dateParams() };
            if (eventsTypeFilter) params.type = eventsTypeFilter;
            if (eventsUserFilter) params.userId = eventsUserFilter;
            const data = await apiFetch('events', params);
            setEventsData(data);
            break;
          }
          case 'site': {
            const data = await apiFetch('marketing', dateParams());
            setMarketing(data);
            break;
          }
          case 'analytics': {
            const data = await apiFetch('analytics', dateParams());
            setAnalytics(data);
            break;
          }
        }
      } catch {
        // handled by apiFetch
      } finally {
        setLoading(false);
      }
    },
    [apiFetch, dateParams, sessionsPage, eventsPage, eventsTypeFilter, eventsUserFilter]
  );

  useEffect(() => {
    if (authenticated) loadTab(tab);
  }, [authenticated, tab, loadTab]);

  // ─── Load session detail ──────────────────────────────────────────────

  const loadSessionDetail = async (sessionId: string) => {
    setLoading(true);
    try {
      const data = await apiFetch('session-detail', { sessionId });
      setSessionDetail(data);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  // ─── Load user detail ─────────────────────────────────────────────────

  const loadUserDetail = async (userId: string) => {
    setLoading(true);
    try {
      const data = await apiFetch('user-detail', { userId });
      setUserDetail({ userId, data });
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  // ─── Refresh events when filters change ───────────────────────────────

  useEffect(() => {
    if (authenticated && tab === 'events') loadTab('events');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventsPage, eventsTypeFilter, eventsUserFilter]);

  useEffect(() => {
    if (authenticated && tab === 'sessions') loadTab('sessions');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionsPage]);

  // Reload current tab when date range changes
  useEffect(() => {
    if (authenticated && ['overview', 'sessions', 'events', 'site', 'analytics'].includes(tab)) {
      loadTab(tab);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFrom, dateTo]);

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER: LOGIN SCREEN
  // ═══════════════════════════════════════════════════════════════════════

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-zinc-100">Admin Dashboard</h1>
            <p className="text-sm text-zinc-500">Enter your admin secret to continue</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Admin secret key"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleLogin}
              className="w-full px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl transition-colors"
            >
              Access Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER: SESSION DETAIL VIEW
  // ═══════════════════════════════════════════════════════════════════════

  if (sessionDetail?.session) {
    const { session, timeline } = sessionDetail;
    const duration = session.endedAt
      ? Math.round((new Date(session.endedAt).getTime() - new Date(session.createdAt).getTime()) / 1000)
      : null;

    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
        <button
          onClick={() => setSessionDetail(null)}
          className="mb-6 px-4 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
        >
          &larr; Back to Sessions
        </button>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-1">
            Session: <span className="text-amber-400">{session.userName || session.userId?.slice(0, 12) || 'Anonymous'}</span>
          </h2>
          <p className="text-sm text-zinc-500">{formatDate(session.createdAt)}</p>
        </div>

        {/* Session Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <InfoCard label="Device" value={session.deviceType || '-'} />
          <InfoCard label="Browser" value={`${session.browser || '-'}${session.browserVersion ? ` ${session.browserVersion}` : ''}`} />
          <InfoCard label="OS" value={`${session.os || '-'}${session.osVersion ? ` ${session.osVersion}` : ''}`} />
          <InfoCard label="Location" value={[session.city, session.country].filter(Boolean).join(', ') || '-'} />
          <InfoCard label="Screen" value={session.screenWidth && session.screenHeight ? `${session.screenWidth}x${session.screenHeight}` : '-'} />
          <InfoCard label="Language" value={session.appLanguage?.toUpperCase() || '-'} />
          <InfoCard label="Duration" value={duration ? `${Math.floor(duration / 60)}m ${duration % 60}s` : 'Active'} />
          <InfoCard label="Events" value={String(timeline.filter(t => t.type === 'event').length)} />
        </div>

        {session.referrer && (
          <div className="mb-6 px-4 py-2 bg-zinc-900/50 rounded-lg text-sm">
            <span className="text-zinc-500">Referrer: </span>
            <span className="text-zinc-300">{session.referrer}</span>
          </div>
        )}

        {/* Chronological Timeline */}
        <h3 className="text-lg font-semibold text-zinc-300 mb-4">
          Step-by-Step Timeline ({timeline.length} entries)
        </h3>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-800" />

          <div className="space-y-0">
            {timeline.map((entry, i) => {
              const isEvent = entry.type === 'event';
              const desc = isEvent && entry.raw
                ? describeEvent(entry.raw, entry.eventData as Record<string, unknown> | null)
                : entry.description;

              return (
                <div key={i} className="relative pl-10 py-2 group hover:bg-zinc-900/30 rounded transition-colors">
                  {/* Dot */}
                  <div className={`absolute left-2.5 top-3.5 w-3 h-3 rounded-full border-2 ${
                    isEvent
                      ? 'border-emerald-500 bg-emerald-500/20'
                      : 'border-blue-500 bg-blue-500/20'
                  }`} />

                  <div className="flex items-start gap-3">
                    <span className="text-zinc-600 text-xs font-mono w-20 shrink-0 pt-0.5">
                      {formatTime(entry.time)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm ${isEvent ? 'text-emerald-400' : 'text-blue-400'}`}>
                        {desc}
                      </span>
                      {entry.detail && (
                        <span className="text-zinc-600 text-xs ml-2">{entry.detail}</span>
                      )}
                      {isEvent && entry.raw && (
                        <div className="text-zinc-700 text-xs font-mono mt-0.5">{entry.raw}</div>
                      )}
                    </div>
                    {entry.screen && (
                      <span className="text-zinc-700 text-xs shrink-0">@ {entry.screen}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {timeline.length === 0 && (
          <p className="text-center text-zinc-600 py-8">No activity recorded for this session</p>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER: USER DETAIL VIEW
  // ═══════════════════════════════════════════════════════════════════════

  if (userDetail) {
    const { userId, data } = userDetail;
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
        <button
          onClick={() => setUserDetail(null)}
          className="mb-6 px-4 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
        >
          &larr; Back to Users
        </button>

        <h2 className="text-xl font-bold mb-6">
          User: <span className="text-amber-400">{userId}</span>
        </h2>

        {/* Sessions — clickable to view timeline */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-zinc-300 mb-3">Sessions ({data.sessions.length})</h3>
          <div className="space-y-1">
            {data.sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => loadSessionDetail(s.id)}
                className="flex items-center gap-4 text-sm py-2.5 px-4 bg-zinc-900/50 rounded hover:bg-zinc-800/70 cursor-pointer transition-colors"
              >
                <span className="text-zinc-300 w-44 shrink-0">{formatDate(s.createdAt)}</span>
                <span className="text-zinc-500">{s.country || '-'}{s.city ? `, ${s.city}` : ''}</span>
                <span className="text-zinc-500">{s.deviceType || '-'}</span>
                <span className="text-zinc-500">{s.browser || '-'}</span>
                <span className="text-amber-400/60 ml-auto text-xs">View Timeline &rarr;</span>
              </div>
            ))}
          </div>
        </section>

        {/* Screen Flow */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-zinc-300 mb-3">Screen Flow ({data.pageViews.length})</h3>
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {data.pageViews.map((pv, i) => (
              <div key={i} className="flex items-center gap-3 text-sm py-1.5 px-3 bg-zinc-900/50 rounded">
                <span className="text-zinc-500 w-40 shrink-0">{formatDate(pv.enteredAt)}</span>
                <span className="font-mono text-amber-400">{pv.viewName}</span>
                {pv.duration != null && (
                  <span className="text-zinc-600 ml-auto">{pv.duration}s</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Event Timeline */}
        <section>
          <h3 className="text-lg font-semibold text-zinc-300 mb-3">Event Timeline ({data.events.length})</h3>
          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {data.events.map((e) => (
              <div key={e.id} className="flex items-start gap-3 text-sm py-2 px-3 bg-zinc-900/50 rounded">
                <span className="text-zinc-500 w-40 shrink-0">{formatDate(e.timestamp)}</span>
                <span className="text-emerald-400 w-56 shrink-0">{describeEvent(e.eventType, e.eventData as Record<string, unknown> | null)}</span>
                <span className="text-zinc-600 font-mono text-xs">{e.eventType}</span>
                {e.view && <span className="text-zinc-600 ml-auto text-xs">@ {e.view}</span>}
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER: MAIN DASHBOARD
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 px-4 md:px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">
          <span className="text-amber-400">SolonsWay</span> Admin
        </h1>
        <div className="flex items-center gap-4">
          {loading && <span className="text-xs text-zinc-500 animate-pulse">Loading...</span>}
          <button
            onClick={() => loadTab(tab)}
            className="text-xs px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem('admin_secret');
              setAuthenticated(false);
            }}
            className="text-xs px-3 py-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Date Filter Bar */}
      <div className="border-b border-zinc-800 px-4 md:px-8 py-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-zinc-500 mr-1">Period:</span>
        {(['today', '7d', '30d', 'all'] as DatePreset[]).map((p) => (
          <button
            key={p}
            onClick={() => handlePresetChange(p)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              datePreset === p
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            {p === 'today' ? 'Today' : p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : 'All Time'}
          </button>
        ))}
        <div className="flex items-center gap-1.5 ml-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setDatePreset('all'); }}
            className="px-2 py-1 text-xs bg-zinc-900 border border-zinc-800 rounded text-zinc-300 focus:outline-none focus:border-amber-500/50"
          />
          <span className="text-zinc-600 text-xs">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setDatePreset('all'); }}
            className="px-2 py-1 text-xs bg-zinc-900 border border-zinc-800 rounded text-zinc-300 focus:outline-none focus:border-amber-500/50"
          />
        </div>
        {(dateFrom || dateTo) && (
          <button
            onClick={() => handlePresetChange('all')}
            className="text-xs text-zinc-600 hover:text-zinc-400 ml-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Tabs */}
      <nav className="border-b border-zinc-800 px-4 md:px-8 flex gap-1 overflow-x-auto">
        {(['overview', 'sessions', 'users', 'events', 'site', 'analytics'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 whitespace-nowrap ${
              tab === t
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t === 'site' ? 'Site' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="p-4 md:p-8">
        {tab === 'overview' && overview && (
          <OverviewTab
            data={overview}
            onViewSessions={() => setTab('sessions')}
            onViewSite={() => setTab('site')}
          />
        )}
        {tab === 'sessions' && sessionsData && (
          <SessionsTab
            data={sessionsData}
            page={sessionsPage}
            onPageChange={setSessionsPage}
            onSelectSession={loadSessionDetail}
          />
        )}
        {tab === 'users' && (
          <UsersTab
            users={users}
            onSelectUser={loadUserDetail}
            onFilterEvents={(userId: string) => {
              setEventsUserFilter(userId);
              setTab('events');
            }}
          />
        )}
        {tab === 'events' && eventsData && (
          <EventsTab
            data={eventsData}
            page={eventsPage}
            typeFilter={eventsTypeFilter}
            userFilter={eventsUserFilter}
            onPageChange={setEventsPage}
            onTypeFilterChange={setEventsTypeFilter}
            onUserFilterChange={setEventsUserFilter}
          />
        )}
        {tab === 'site' && marketing && <SiteTab data={marketing} />}
        {tab === 'analytics' && analytics && <AnalyticsTab data={analytics} />}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function StatCard({
  label, value, sub, onClick, accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  onClick?: () => void;
  accent?: 'amber' | 'emerald' | 'blue' | 'purple';
}) {
  const accentClass = accent === 'emerald' ? 'group-hover:border-emerald-500/40' :
    accent === 'blue' ? 'group-hover:border-blue-500/40' :
    accent === 'purple' ? 'group-hover:border-purple-500/40' :
    'group-hover:border-amber-500/40';

  return (
    <div
      onClick={onClick}
      className={`bg-zinc-900 border border-zinc-800 rounded-xl p-4 group transition-colors ${
        onClick ? `cursor-pointer ${accentClass}` : ''
      }`}
    >
      <div className="text-2xl font-bold text-zinc-100">{value}</div>
      <div className="text-sm text-zinc-500 mt-1">{label}</div>
      {sub && <div className="text-xs text-zinc-600 mt-0.5">{sub}</div>}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-lg px-3 py-2">
      <div className="text-xs text-zinc-600">{label}</div>
      <div className="text-sm text-zinc-300 capitalize">{value}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════════════════════════════════

function OverviewTab({
  data, onViewSessions, onViewSite,
}: {
  data: OverviewData;
  onViewSessions: () => void;
  onViewSite: () => void;
}) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Users" value={data.totalUsers.toLocaleString()} />
        <StatCard
          label="Total Sessions"
          value={data.totalSessions.toLocaleString()}
          sub={`${data.todaySessions} today`}
          onClick={onViewSessions}
          accent="amber"
        />
        <StatCard label="Total Events" value={data.totalEvents.toLocaleString()} sub={`${data.todayEvents} today`} />
        <StatCard label="This Week" value={data.weekSessions.toLocaleString()} sub="sessions" />
        <StatCard
          label="Site Visits"
          value={data.totalMarketingEvents.toLocaleString()}
          sub="landing page events"
          onClick={onViewSite}
          accent="purple"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Top Countries</h3>
          {data.topCountries.length === 0 ? (
            <p className="text-sm text-zinc-600">No data yet</p>
          ) : (
            <div className="space-y-2">
              {data.topCountries.map((c) => (
                <div key={c.country} className="flex items-center justify-between text-sm py-1.5 px-3 bg-zinc-900/50 rounded">
                  <span className="text-zinc-300">{c.country}</span>
                  <span className="text-zinc-500">{c.count} sessions</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Devices</h3>
          {data.topDevices.length === 0 ? (
            <p className="text-sm text-zinc-600">No data yet</p>
          ) : (
            <div className="space-y-2">
              {data.topDevices.map((d) => (
                <div key={d.deviceType} className="flex items-center justify-between text-sm py-1.5 px-3 bg-zinc-900/50 rounded">
                  <span className="text-zinc-300 capitalize">{d.deviceType}</span>
                  <span className="text-zinc-500">{d.count} sessions</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section>
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Recent Events</h3>
        <div className="space-y-1 max-h-[500px] overflow-y-auto">
          {data.recentEvents.map((e) => (
            <div key={e.id} className="flex items-center gap-3 text-sm py-2 px-3 bg-zinc-900/50 rounded hover:bg-zinc-900 transition-colors">
              <span className="text-zinc-500 w-16 shrink-0">{timeAgo(e.timestamp)}</span>
              <span className="text-zinc-300 w-24 shrink-0 truncate">{e.userName || e.userId?.slice(0, 8) || 'anon'}</span>
              <span className="text-emerald-400 w-56 shrink-0">{describeEvent(e.eventType, e.eventData as Record<string, unknown> | null)}</span>
              <span className="text-zinc-600 text-xs font-mono truncate">{e.eventType}</span>
              {e.country && <span className="text-zinc-600 text-xs ml-auto shrink-0">{e.country}</span>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SESSIONS TAB
// ═══════════════════════════════════════════════════════════════════════════

function SessionsTab({
  data, page, onPageChange, onSelectSession,
}: {
  data: SessionsData;
  page: number;
  onPageChange: (p: number) => void;
  onSelectSession: (sessionId: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-zinc-400">
          {data.total.toLocaleString()} sessions total | Page {data.page}/{data.totalPages}
        </h3>
      </div>

      <div className="space-y-1">
        {data.sessions.map((s) => (
          <div
            key={s.id}
            onClick={() => onSelectSession(s.id)}
            className="flex items-center gap-4 text-sm py-3 px-4 bg-zinc-900/50 rounded-lg hover:bg-zinc-800/70 cursor-pointer transition-colors group"
          >
            <div className="w-44 shrink-0">
              <div className="text-zinc-300">{formatDate(s.createdAt)}</div>
              <div className="text-xs text-zinc-600">{timeAgo(s.createdAt)}</div>
            </div>
            <div className="w-28 shrink-0">
              <span className="text-zinc-300">{s.userName || 'Anonymous'}</span>
              {s.userId && <div className="text-xs text-zinc-700 font-mono">{s.userId.slice(0, 10)}...</div>}
            </div>
            <span className="text-zinc-500 w-20 shrink-0">{s.country || '-'}</span>
            <span className="text-zinc-500 w-16 shrink-0 capitalize">{s.deviceType || '-'}</span>
            <span className="text-zinc-500 w-16 shrink-0">{s.browser || '-'}</span>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-zinc-600 text-xs">{s.eventCount} events</span>
              <span className="text-amber-400/60 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                View Timeline &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {data.sessions.length === 0 && (
        <p className="text-center text-zinc-600 py-8">No sessions found for this period</p>
      )}

      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 text-sm bg-zinc-900 border border-zinc-800 rounded-lg disabled:opacity-30 hover:border-zinc-700 transition-colors"
          >
            Prev
          </button>
          <span className="text-sm text-zinc-500 px-4">{page} / {data.totalPages}</span>
          <button
            onClick={() => onPageChange(Math.min(data.totalPages, page + 1))}
            disabled={page >= data.totalPages}
            className="px-3 py-1.5 text-sm bg-zinc-900 border border-zinc-800 rounded-lg disabled:opacity-30 hover:border-zinc-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// USERS TAB
// ═══════════════════════════════════════════════════════════════════════════

function UsersTab({
  users, onSelectUser, onFilterEvents,
}: {
  users: UserRow[];
  onSelectUser: (userId: string) => void;
  onFilterEvents: (userId: string) => void;
}) {
  const [search, setSearch] = useState('');

  const filtered = users.filter(
    (u) =>
      (u.userName || '').toLowerCase().includes(search.toLowerCase()) ||
      u.userId.toLowerCase().includes(search.toLowerCase()) ||
      (u.country || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search by name, ID, or country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-md px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 text-sm"
        />
        <span className="text-sm text-zinc-500">{filtered.length} users</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-500 border-b border-zinc-800">
              <th className="pb-2 pr-4">Name</th>
              <th className="pb-2 pr-4">Country</th>
              <th className="pb-2 pr-4">Device</th>
              <th className="pb-2 pr-4">Browser</th>
              <th className="pb-2 pr-4">Lang</th>
              <th className="pb-2 pr-4">Sessions</th>
              <th className="pb-2 pr-4">Events</th>
              <th className="pb-2 pr-4">First Seen</th>
              <th className="pb-2 pr-4">Last Seen</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.userId} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                <td className="py-2.5 pr-4">
                  <span className="text-zinc-200">{u.userName || 'Anonymous'}</span>
                  <div className="text-xs text-zinc-600 font-mono mt-0.5">{u.userId.slice(0, 12)}...</div>
                </td>
                <td className="py-2.5 pr-4">{u.country || '-'}{u.city ? `, ${u.city}` : ''}</td>
                <td className="py-2.5 pr-4 capitalize">{u.deviceType || '-'}</td>
                <td className="py-2.5 pr-4">{u.browser || '-'}</td>
                <td className="py-2.5 pr-4 uppercase">{u.appLanguage || '-'}</td>
                <td className="py-2.5 pr-4 text-zinc-300">{u.sessionCount}</td>
                <td className="py-2.5 pr-4 text-zinc-300">{u.eventCount}</td>
                <td className="py-2.5 pr-4 text-zinc-500">{timeAgo(u.firstSeen)}</td>
                <td className="py-2.5 pr-4 text-zinc-500">{timeAgo(u.lastSeen)}</td>
                <td className="py-2.5">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectUser(u.userId)}
                      className="text-xs px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors text-amber-400"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => onFilterEvents(u.userId)}
                      className="text-xs px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors text-zinc-400"
                    >
                      Events
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-zinc-600 py-8">No users found</p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EVENTS TAB
// ═══════════════════════════════════════════════════════════════════════════

function EventsTab({
  data, page, typeFilter, userFilter,
  onPageChange, onTypeFilterChange, onUserFilterChange,
}: {
  data: EventsData;
  page: number;
  typeFilter: string;
  userFilter: string;
  onPageChange: (p: number) => void;
  onTypeFilterChange: (t: string) => void;
  onUserFilterChange: (u: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={typeFilter}
          onChange={(e) => { onTypeFilterChange(e.target.value); onPageChange(1); }}
          className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 text-sm focus:outline-none focus:border-amber-500/50"
        >
          <option value="">All event types</option>
          {data.eventTypes.map((t) => (
            <option key={t.type} value={t.type}>{t.type} ({t.count})</option>
          ))}
        </select>

        {userFilter && (
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm">
            <span className="text-zinc-500">User:</span>
            <span className="text-zinc-300 font-mono">{userFilter.slice(0, 12)}...</span>
            <button onClick={() => onUserFilterChange('')} className="text-zinc-500 hover:text-zinc-300 ml-1">x</button>
          </div>
        )}

        <span className="text-sm text-zinc-500 ml-auto">
          {data.total.toLocaleString()} events | Page {data.page}/{data.totalPages}
        </span>
      </div>

      <div className="space-y-1 max-h-[600px] overflow-y-auto">
        {data.events.map((e) => (
          <div key={e.id} className="flex items-start gap-3 text-sm py-2 px-3 bg-zinc-900/50 rounded hover:bg-zinc-900 transition-colors">
            <span className="text-zinc-500 w-36 shrink-0">{formatDate(e.timestamp)}</span>
            <span className="text-zinc-300 w-24 shrink-0 truncate">{e.userName || (e.userId ? e.userId.slice(0, 8) : 'anon')}</span>
            <span className="text-emerald-400 w-56 shrink-0">{describeEvent(e.eventType, e.eventData as Record<string, unknown> | null)}</span>
            <span className="text-zinc-600 font-mono text-xs flex-1 truncate">{e.eventType}</span>
            {e.view && <span className="text-zinc-600 text-xs shrink-0">@ {e.view}</span>}
          </div>
        ))}
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 text-sm bg-zinc-900 border border-zinc-800 rounded-lg disabled:opacity-30 hover:border-zinc-700 transition-colors"
          >
            Prev
          </button>
          <span className="text-sm text-zinc-500 px-4">{page} / {data.totalPages}</span>
          <button
            onClick={() => onPageChange(Math.min(data.totalPages, page + 1))}
            disabled={page >= data.totalPages}
            className="px-3 py-1.5 text-sm bg-zinc-900 border border-zinc-800 rounded-lg disabled:opacity-30 hover:border-zinc-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SITE TAB (Landing Page / Marketing Analytics)
// ═══════════════════════════════════════════════════════════════════════════

function SiteTab({ data }: { data: MarketingData }) {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Page Views" value={data.pageViews.toLocaleString()} accent="purple" />
        <StatCard label="Unique Visitors" value={data.uniqueVisitors.toLocaleString()} accent="blue" />
        <StatCard label="CTA Clicks" value={data.ctaClicks.toLocaleString()} accent="emerald" />
        <StatCard label="Total Events" value={data.totalEvents.toLocaleString()} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Scroll Depth Funnel */}
        <section>
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Scroll Depth Funnel</h3>
          <div className="space-y-2">
            {([25, 50, 75, 100] as const).map((pct) => {
              const count = data.scrollFunnel[pct];
              const max = Math.max(data.scrollFunnel[25], 1);
              const pctWidth = (count / max) * 100;
              return (
                <div key={pct} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-300">{pct}% scrolled</span>
                    <span className="text-zinc-500">{count} visitors</span>
                  </div>
                  <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500/60 rounded-full transition-all"
                      style={{ width: `${Math.max(pctWidth, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Breakdown */}
        <section>
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">CTA Clicks Breakdown</h3>
          {data.ctaBreakdown.length === 0 ? (
            <p className="text-sm text-zinc-600">No CTA clicks yet</p>
          ) : (
            <div className="space-y-2">
              {data.ctaBreakdown.map((cta) => {
                const max = data.ctaBreakdown[0]?.count || 1;
                return (
                  <div key={cta.label} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-400">{cta.label}</span>
                      <span className="text-zinc-500">{cta.count}</span>
                    </div>
                    <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500/40 rounded-full"
                        style={{ width: `${(cta.count / max) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Recent Marketing Events */}
      <section>
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Recent Site Events</h3>
        <div className="space-y-1 max-h-[400px] overflow-y-auto">
          {data.recentEvents.map((e) => (
            <div key={e.id} className="flex items-center gap-3 text-sm py-2 px-3 bg-zinc-900/50 rounded hover:bg-zinc-900 transition-colors">
              <span className="text-zinc-500 w-16 shrink-0">{timeAgo(e.createdAt)}</span>
              <span className="text-zinc-600 font-mono text-xs w-20 shrink-0">{e.sessionId.slice(0, 8)}...</span>
              <span className="text-purple-400">
                {describeMarketingEvent(e)}
              </span>
              {e.page && <span className="text-zinc-600 text-xs ml-auto">{e.page}</span>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ANALYTICS TAB
// ═══════════════════════════════════════════════════════════════════════════

function AnalyticsTab({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-8">
      {/* Sessions Per Day */}
      <section>
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Sessions Per Day</h3>
        {data.sessionsPerDay.length === 0 ? (
          <p className="text-sm text-zinc-600">No data yet</p>
        ) : (
          <div className="flex items-end gap-1 h-32 bg-zinc-900/50 rounded-xl p-4">
            {(() => {
              const max = Math.max(...data.sessionsPerDay.map((d) => d.count), 1);
              return data.sessionsPerDay.map((d) => (
                <div
                  key={d.date}
                  className="flex-1 bg-amber-500/60 hover:bg-amber-500 rounded-t transition-colors cursor-default group relative"
                  style={{ height: `${Math.max((d.count / max) * 100, 2)}%` }}
                  title={`${d.date}: ${d.count} sessions`}
                >
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-zinc-800 text-xs text-zinc-300 px-2 py-1 rounded whitespace-nowrap z-10">
                    {d.date.slice(5)}: {d.count}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Screen Views */}
        <section>
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Most Visited Screens</h3>
          <div className="space-y-2">
            {data.screenViews.map((s) => {
              const max = data.screenViews[0]?.count || 1;
              return (
                <div key={s.viewName} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-amber-400">{s.viewName}</span>
                    <span className="text-zinc-500">
                      {s.count} views{s.avgDuration > 0 ? ` | avg ${s.avgDuration}s` : ''}
                    </span>
                  </div>
                  <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500/60 rounded-full" style={{ width: `${(s.count / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Top Events */}
        <section>
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Most Common Events</h3>
          <div className="space-y-2">
            {data.topEvents.slice(0, 15).map((e) => {
              const max = data.topEvents[0]?.count || 1;
              return (
                <div key={e.eventType} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-400">{describeEvent(e.eventType)}</span>
                    <span className="text-zinc-500">{e.count}</span>
                  </div>
                  <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500/40 rounded-full" style={{ width: `${(e.count / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <section>
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Browsers</h3>
          <div className="space-y-1.5">
            {data.browserBreakdown.map((b) => (
              <div key={b.browser} className="flex items-center justify-between text-sm py-1 px-3 bg-zinc-900/50 rounded">
                <span className="text-zinc-300">{b.browser}</span>
                <span className="text-zinc-500">{b.count}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Operating Systems</h3>
          <div className="space-y-1.5">
            {data.osBreakdown.map((o) => (
              <div key={o.os} className="flex items-center justify-between text-sm py-1 px-3 bg-zinc-900/50 rounded">
                <span className="text-zinc-300">{o.os}</span>
                <span className="text-zinc-500">{o.count}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">App Languages</h3>
          <div className="space-y-1.5">
            {data.languageBreakdown.map((l) => (
              <div key={l.language} className="flex items-center justify-between text-sm py-1 px-3 bg-zinc-900/50 rounded">
                <span className="text-zinc-300 uppercase">{l.language}</span>
                <span className="text-zinc-500">{l.count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
