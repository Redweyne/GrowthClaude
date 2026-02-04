'use client';

// ============================================================================
// ADMIN DASHBOARD
// Protected by ADMIN_SECRET. Access at /growthmvp/admin
// ============================================================================

import { useState, useEffect, useCallback } from 'react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// ─── Types ──────────────────────────────────────────────────────────────────

interface OverviewData {
  totalUsers: number;
  totalSessions: number;
  totalEvents: number;
  totalPageViews: number;
  todaySessions: number;
  todayEvents: number;
  weekSessions: number;
  recentEvents: EventRow[];
  topCountries: { country: string; count: number }[];
  topDevices: { deviceType: string; count: number }[];
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

type Tab = 'overview' | 'users' | 'events' | 'analytics';

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

function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + '...' : str;
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(false);

  // Data
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [eventsData, setEventsData] = useState<EventsData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [userDetail, setUserDetail] = useState<{ userId: string; data: UserDetailData } | null>(null);

  // Events filters
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

  // ─── API fetch helper ─────────────────────────────────────────────────

  const apiFetch = useCallback(
    async (action: string, params: Record<string, string> = {}) => {
      const query = new URLSearchParams({ action, ...params });
      const res = await fetch(`${basePath}/api/admin?${query}`, {
        headers: { Authorization: `Bearer ${secret}` },
      });
      const data = await res.json();
      if (!res.ok) {
        // Pass the server's reason through so the UI can show it
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
            const data = await apiFetch('overview');
            setOverview(data);
            break;
          }
          case 'users': {
            const data = await apiFetch('users');
            setUsers(data.users);
            break;
          }
          case 'events': {
            const params: Record<string, string> = {
              page: String(eventsPage),
              limit: '50',
            };
            if (eventsTypeFilter) params.type = eventsTypeFilter;
            if (eventsUserFilter) params.userId = eventsUserFilter;
            const data = await apiFetch('events', params);
            setEventsData(data);
            break;
          }
          case 'analytics': {
            const data = await apiFetch('analytics');
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
    [apiFetch, eventsPage, eventsTypeFilter, eventsUserFilter]
  );

  useEffect(() => {
    if (authenticated) loadTab(tab);
  }, [authenticated, tab, loadTab]);

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

        {/* Sessions */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-zinc-300 mb-3">Sessions ({data.sessions.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500 border-b border-zinc-800">
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 pr-4">Country</th>
                  <th className="pb-2 pr-4">Device</th>
                  <th className="pb-2 pr-4">Browser</th>
                  <th className="pb-2 pr-4">OS</th>
                  <th className="pb-2 pr-4">Screen</th>
                  <th className="pb-2">Language</th>
                </tr>
              </thead>
              <tbody>
                {data.sessions.map((s) => (
                  <tr key={s.id} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                    <td className="py-2 pr-4 text-zinc-300">{formatDate(s.createdAt)}</td>
                    <td className="py-2 pr-4">{s.country || '-'}{s.city ? `, ${s.city}` : ''}</td>
                    <td className="py-2 pr-4">{s.deviceType || '-'}</td>
                    <td className="py-2 pr-4">{s.browser || '-'}</td>
                    <td className="py-2 pr-4">{s.os || '-'}</td>
                    <td className="py-2 pr-4">{s.screenWidth && s.screenHeight ? `${s.screenWidth}x${s.screenHeight}` : '-'}</td>
                    <td className="py-2">{s.appLanguage || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Page Views */}
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
                <span className="font-mono text-emerald-400 w-48 shrink-0">{e.eventType}</span>
                <span className="text-zinc-400 font-mono text-xs">
                  {e.eventData ? truncate(JSON.stringify(e.eventData), 100) : ''}
                </span>
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
          <span className="text-amber-400">GrowthMVP</span> Admin
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

      {/* Tabs */}
      <nav className="border-b border-zinc-800 px-4 md:px-8 flex gap-1">
        {(['overview', 'users', 'events', 'analytics'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${
              tab === t
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="p-4 md:p-8">
        {tab === 'overview' && overview && <OverviewTab data={overview} />}
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
        {tab === 'analytics' && analytics && <AnalyticsTab data={analytics} />}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// ─── Stat Card ──────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="text-2xl font-bold text-zinc-100">{value}</div>
      <div className="text-sm text-zinc-500 mt-1">{label}</div>
      {sub && <div className="text-xs text-zinc-600 mt-0.5">{sub}</div>}
    </div>
  );
}

// ─── Overview Tab ───────────────────────────────────────────────────────

function OverviewTab({ data }: { data: OverviewData }) {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={data.totalUsers} />
        <StatCard label="Total Sessions" value={data.totalSessions} sub={`${data.todaySessions} today`} />
        <StatCard label="Total Events" value={data.totalEvents.toLocaleString()} sub={`${data.todayEvents} today`} />
        <StatCard label="This Week" value={data.weekSessions} sub="sessions" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Top Countries */}
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

        {/* Devices */}
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

      {/* Recent Events */}
      <section>
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Recent Events</h3>
        <div className="space-y-1 max-h-[500px] overflow-y-auto">
          {data.recentEvents.map((e) => (
            <div key={e.id} className="flex items-center gap-3 text-sm py-2 px-3 bg-zinc-900/50 rounded hover:bg-zinc-900 transition-colors">
              <span className="text-zinc-500 w-16 shrink-0">{timeAgo(e.timestamp)}</span>
              <span className="text-zinc-300 w-24 shrink-0 truncate">{e.userName || e.userId?.slice(0, 8) || 'anon'}</span>
              <span className="font-mono text-emerald-400 w-48 shrink-0">{e.eventType}</span>
              <span className="text-zinc-500 text-xs font-mono truncate">
                {e.eventData ? truncate(JSON.stringify(e.eventData), 60) : ''}
              </span>
              {e.country && <span className="text-zinc-600 text-xs ml-auto shrink-0">{e.country}</span>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Users Tab ──────────────────────────────────────────────────────────

function UsersTab({
  users,
  onSelectUser,
  onFilterEvents,
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
              <th className="pb-2 pr-4">Language</th>
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

// ─── Events Tab ─────────────────────────────────────────────────────────

function EventsTab({
  data,
  page,
  typeFilter,
  userFilter,
  onPageChange,
  onTypeFilterChange,
  onUserFilterChange,
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
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={typeFilter}
          onChange={(e) => {
            onTypeFilterChange(e.target.value);
            onPageChange(1);
          }}
          className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 text-sm focus:outline-none focus:border-amber-500/50"
        >
          <option value="">All event types</option>
          {data.eventTypes.map((t) => (
            <option key={t.type} value={t.type}>
              {t.type} ({t.count})
            </option>
          ))}
        </select>

        {userFilter && (
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm">
            <span className="text-zinc-500">User:</span>
            <span className="text-zinc-300 font-mono">{userFilter.slice(0, 12)}...</span>
            <button
              onClick={() => onUserFilterChange('')}
              className="text-zinc-500 hover:text-zinc-300 ml-1"
            >
              x
            </button>
          </div>
        )}

        <span className="text-sm text-zinc-500 ml-auto">
          {data.total.toLocaleString()} events total | Page {data.page}/{data.totalPages}
        </span>
      </div>

      {/* Event List */}
      <div className="space-y-1 max-h-[600px] overflow-y-auto">
        {data.events.map((e) => (
          <div key={e.id} className="flex items-start gap-3 text-sm py-2 px-3 bg-zinc-900/50 rounded hover:bg-zinc-900 transition-colors">
            <span className="text-zinc-500 w-36 shrink-0">{formatDate(e.timestamp)}</span>
            <span className="text-zinc-300 w-24 shrink-0 truncate">{e.userName || (e.userId ? e.userId.slice(0, 8) : 'anon')}</span>
            <span className="font-mono text-emerald-400 w-52 shrink-0">{e.eventType}</span>
            <span className="text-zinc-400 font-mono text-xs flex-1 truncate">
              {e.eventData ? truncate(JSON.stringify(e.eventData), 80) : ''}
            </span>
            {e.view && <span className="text-zinc-600 text-xs shrink-0">@ {e.view}</span>}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 text-sm bg-zinc-900 border border-zinc-800 rounded-lg disabled:opacity-30 hover:border-zinc-700 transition-colors"
          >
            Prev
          </button>
          <span className="text-sm text-zinc-500 px-4">
            {page} / {data.totalPages}
          </span>
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

// ─── Analytics Tab ──────────────────────────────────────────────────────

function AnalyticsTab({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-8">
      {/* Sessions Per Day (simple bar chart) */}
      <section>
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Sessions Per Day (last 30 days)</h3>
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
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-zinc-800 text-xs text-zinc-300 px-2 py-1 rounded whitespace-nowrap">
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
                    <div
                      className="h-full bg-amber-500/60 rounded-full"
                      style={{ width: `${(s.count / max) * 100}%` }}
                    />
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
                    <span className="font-mono text-emerald-400">{e.eventType}</span>
                    <span className="text-zinc-500">{e.count}</span>
                  </div>
                  <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500/40 rounded-full"
                      style={{ width: `${(e.count / max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Browser Breakdown */}
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

        {/* OS Breakdown */}
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

        {/* Language Breakdown */}
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
