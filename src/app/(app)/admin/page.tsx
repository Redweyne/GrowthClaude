'use client';

// ============================================================================
// ADMIN DASHBOARD
// Protected by ADMIN_SECRET. Access at /growthmvp/admin
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

const LOCALE_TAG_BY_LOCALE = {
  en: 'en-US',
  fr: 'fr-FR',
  ar: 'ar',
} as const;

const ADMIN_COPY_BY_LOCALE = {
  en: {
    unknownError: 'Unknown error',
    loginTitle: 'Admin Dashboard',
    loginSubtitle: 'Enter your admin secret to continue',
    loginPlaceholder: 'Admin secret key',
    loginButton: 'Access Dashboard',
    backToUsers: 'Back to Users',
    userLabel: 'User',
    sessions: 'Sessions',
    date: 'Date',
    country: 'Country',
    device: 'Device',
    browser: 'Browser',
    os: 'OS',
    screen: 'Screen',
    language: 'Language',
    screenFlow: 'Screen Flow',
    eventTimeline: 'Event Timeline',
    adminLabel: 'Admin',
    loading: 'Loading...',
    refresh: 'Refresh',
    logout: 'Logout',
    tabs: {
      overview: 'Overview',
      users: 'Users',
      events: 'Events',
      analytics: 'Analytics',
    },
    totalUsers: 'Total Users',
    totalSessions: 'Total Sessions',
    totalEvents: 'Total Events',
    thisWeek: 'This Week',
    today: 'today',
    sessionsLower: 'sessions',
    topCountries: 'Top Countries',
    devices: 'Devices',
    recentEvents: 'Recent Events',
    noDataYet: 'No data yet',
    anon: 'anon',
    searchPlaceholder: 'Search by name, ID, or country...',
    usersSuffix: 'users',
    name: 'Name',
    firstSeen: 'First Seen',
    lastSeen: 'Last Seen',
    actions: 'Actions',
    anonymous: 'Anonymous',
    detail: 'Detail',
    eventsButton: 'Events',
    noUsersFound: 'No users found',
    allEventTypes: 'All event types',
    user: 'User',
    eventsTotal: (total: string, page: number, totalPages: number) => `${total} events total | Page ${page}/${totalPages}`,
    prev: 'Prev',
    next: 'Next',
    sessionsPerDayLast30: 'Sessions Per Day (last 30 days)',
    mostVisitedScreens: 'Most Visited Screens',
    mostCommonEvents: 'Most Common Events',
    browsers: 'Browsers',
    operatingSystems: 'Operating Systems',
    appLanguages: 'App Languages',
    views: 'views',
    avg: 'avg',
    usersCount: (count: number) => `${count} users`,
    sessionsCount: (count: number) => `${count} sessions`,
    sessionTooltip: (date: string, count: number) => `${date}: ${count} sessions`,
  },
  fr: {
    unknownError: 'Erreur inconnue',
    loginTitle: "Tableau de bord d'administration",
    loginSubtitle: "Entrez votre secret administrateur pour continuer",
    loginPlaceholder: 'Clé secrète administrateur',
    loginButton: 'Accéder au tableau de bord',
    backToUsers: 'Retour aux utilisateurs',
    userLabel: 'Utilisateur',
    sessions: 'Sessions',
    date: 'Date',
    country: 'Pays',
    device: 'Appareil',
    browser: 'Navigateur',
    os: 'OS',
    screen: 'Écran',
    language: 'Langue',
    screenFlow: "Flux d'écrans",
    eventTimeline: "Chronologie des événements",
    adminLabel: 'Admin',
    loading: 'Chargement...',
    refresh: 'Actualiser',
    logout: 'Déconnexion',
    tabs: {
      overview: 'Vue générale',
      users: 'Utilisateurs',
      events: 'Événements',
      analytics: 'Analytique',
    },
    totalUsers: 'Utilisateurs totaux',
    totalSessions: 'Sessions totales',
    totalEvents: 'Événements totaux',
    thisWeek: 'Cette semaine',
    today: "aujourd'hui",
    sessionsLower: 'sessions',
    topCountries: 'Principaux pays',
    devices: 'Appareils',
    recentEvents: 'Événements récents',
    noDataYet: 'Pas encore de données',
    anon: 'anonyme',
    searchPlaceholder: 'Rechercher par nom, ID ou pays...',
    usersSuffix: 'utilisateurs',
    name: 'Nom',
    firstSeen: 'Première visite',
    lastSeen: 'Dernière visite',
    actions: 'Actions',
    anonymous: 'Anonyme',
    detail: 'Détail',
    eventsButton: 'Événements',
    noUsersFound: 'Aucun utilisateur trouvé',
    allEventTypes: "Tous les types d'événements",
    user: 'Utilisateur',
    eventsTotal: (total: string, page: number, totalPages: number) => `${total} événements au total | Page ${page}/${totalPages}`,
    prev: 'Précédent',
    next: 'Suivant',
    sessionsPerDayLast30: 'Sessions par jour (30 derniers jours)',
    mostVisitedScreens: 'Écrans les plus visités',
    mostCommonEvents: 'Événements les plus fréquents',
    browsers: 'Navigateurs',
    operatingSystems: "Systèmes d'exploitation",
    appLanguages: "Langues de l'application",
    views: 'vues',
    avg: 'moy',
    usersCount: (count: number) => `${count} utilisateurs`,
    sessionsCount: (count: number) => `${count} sessions`,
    sessionTooltip: (date: string, count: number) => `${date}: ${count} sessions`,
  },
  ar: {
    unknownError: 'خطأ غير معروف',
    loginTitle: 'لوحة تحكم المشرف',
    loginSubtitle: 'أدخل السر الإداري للمتابعة',
    loginPlaceholder: 'مفتاح سر المشرف',
    loginButton: 'الدخول إلى لوحة التحكم',
    backToUsers: 'العودة إلى المستخدمين',
    userLabel: 'المستخدم',
    sessions: 'الجلسات',
    date: 'التاريخ',
    country: 'الدولة',
    device: 'الجهاز',
    browser: 'المتصفح',
    os: 'النظام',
    screen: 'الشاشة',
    language: 'اللغة',
    screenFlow: 'تدفق الشاشات',
    eventTimeline: 'الجدول الزمني للأحداث',
    adminLabel: 'المشرف',
    loading: 'جار التحميل...',
    refresh: 'تحديث',
    logout: 'تسجيل الخروج',
    tabs: {
      overview: 'نظرة عامة',
      users: 'المستخدمون',
      events: 'الأحداث',
      analytics: 'التحليلات',
    },
    totalUsers: 'إجمالي المستخدمين',
    totalSessions: 'إجمالي الجلسات',
    totalEvents: 'إجمالي الأحداث',
    thisWeek: 'هذا الأسبوع',
    today: 'اليوم',
    sessionsLower: 'جلسات',
    topCountries: 'أهم الدول',
    devices: 'الأجهزة',
    recentEvents: 'الأحداث الأخيرة',
    noDataYet: 'لا توجد بيانات بعد',
    anon: 'مجهول',
    searchPlaceholder: 'ابحث بالاسم أو المعرّف أو الدولة...',
    usersSuffix: 'مستخدم',
    name: 'الاسم',
    firstSeen: 'أول ظهور',
    lastSeen: 'آخر ظهور',
    actions: 'الإجراءات',
    anonymous: 'مجهول',
    detail: 'تفاصيل',
    eventsButton: 'الأحداث',
    noUsersFound: 'لم يتم العثور على مستخدمين',
    allEventTypes: 'كل أنواع الأحداث',
    user: 'المستخدم',
    eventsTotal: (total: string, page: number, totalPages: number) => `${total} حدث | الصفحة ${page}/${totalPages}`,
    prev: 'السابق',
    next: 'التالي',
    sessionsPerDayLast30: 'الجلسات اليومية (آخر 30 يومًا)',
    mostVisitedScreens: 'أكثر الشاشات زيارة',
    mostCommonEvents: 'أكثر الأحداث شيوعًا',
    browsers: 'المتصفحات',
    operatingSystems: 'أنظمة التشغيل',
    appLanguages: 'لغات التطبيق',
    views: 'مشاهدات',
    avg: 'متوسط',
    usersCount: (count: number) => `${count} مستخدم`,
    sessionsCount: (count: number) => `${count} جلسة`,
    sessionTooltip: (date: string, count: number) => `${date}: ${count} جلسة`,
  },
} as const;

type AdminCopy = (typeof ADMIN_COPY_BY_LOCALE)[keyof typeof ADMIN_COPY_BY_LOCALE];

// ─── Helpers ────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string, localeTag: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  const rtf = new Intl.RelativeTimeFormat(localeTag, { numeric: 'auto' });
  if (seconds < 60) return rtf.format(-seconds, 'second');
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return rtf.format(-minutes, 'minute');
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return rtf.format(-hours, 'hour');
  const days = Math.floor(hours / 24);
  if (days < 30) return rtf.format(-days, 'day');
  return new Date(dateStr).toLocaleDateString(localeTag);
}

function formatDate(dateStr: string, localeTag: string): string {
  return new Date(dateStr).toLocaleString(localeTag);
}

function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + '...' : str;
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AdminPage() {
  const { locale } = useTranslation();
  const [secret, setSecret] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(false);
  const copy = ADMIN_COPY_BY_LOCALE[locale] ?? ADMIN_COPY_BY_LOCALE.en;
  const localeTag = LOCALE_TAG_BY_LOCALE[locale] ?? LOCALE_TAG_BY_LOCALE.en;

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
      setError(err instanceof Error ? err.message : copy.unknownError);
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
            <h1 className="text-2xl font-bold text-zinc-100">{copy.loginTitle}</h1>
            <p className="text-sm text-zinc-500">{copy.loginSubtitle}</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder={copy.loginPlaceholder}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleLogin}
              className="w-full px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl transition-colors"
            >
              {copy.loginButton}
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
          &larr; {copy.backToUsers}
        </button>

        <h2 className="text-xl font-bold mb-6">
          {copy.userLabel}: <span className="text-amber-400">{userId}</span>
        </h2>

        {/* Sessions */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-zinc-300 mb-3">{copy.sessions} ({data.sessions.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500 border-b border-zinc-800">
                  <th className="pb-2 pr-4">{copy.date}</th>
                  <th className="pb-2 pr-4">{copy.country}</th>
                  <th className="pb-2 pr-4">{copy.device}</th>
                  <th className="pb-2 pr-4">{copy.browser}</th>
                  <th className="pb-2 pr-4">{copy.os}</th>
                  <th className="pb-2 pr-4">{copy.screen}</th>
                  <th className="pb-2">{copy.language}</th>
                </tr>
              </thead>
              <tbody>
                {data.sessions.map((s) => (
                  <tr key={s.id} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                    <td className="py-2 pr-4 text-zinc-300">{formatDate(s.createdAt, localeTag)}</td>
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
          <h3 className="text-lg font-semibold text-zinc-300 mb-3">{copy.screenFlow} ({data.pageViews.length})</h3>
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {data.pageViews.map((pv, i) => (
              <div key={i} className="flex items-center gap-3 text-sm py-1.5 px-3 bg-zinc-900/50 rounded">
                <span className="text-zinc-500 w-40 shrink-0">{formatDate(pv.enteredAt, localeTag)}</span>
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
          <h3 className="text-lg font-semibold text-zinc-300 mb-3">{copy.eventTimeline} ({data.events.length})</h3>
          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {data.events.map((e) => (
              <div key={e.id} className="flex items-start gap-3 text-sm py-2 px-3 bg-zinc-900/50 rounded">
                <span className="text-zinc-500 w-40 shrink-0">{formatDate(e.timestamp, localeTag)}</span>
                <span className="text-emerald-400 w-56 shrink-0">{describeEvent(e.eventType, e.eventData as Record<string, unknown> | null)}</span>
                <span className="text-zinc-600 font-mono text-xs">
                  {e.eventType}
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
          <span className="text-amber-400">GrowthMVP</span> {copy.adminLabel}
        </h1>
        <div className="flex items-center gap-4">
          {loading && <span className="text-xs text-zinc-500 animate-pulse">{copy.loading}</span>}
          <button
            onClick={() => loadTab(tab)}
            className="text-xs px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
          >
            {copy.refresh}
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem('admin_secret');
              setAuthenticated(false);
            }}
            className="text-xs px-3 py-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {copy.logout}
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
            {copy.tabs[t]}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="p-4 md:p-8">
        {tab === 'overview' && overview && <OverviewTab data={overview} copy={copy} localeTag={localeTag} />}
        {tab === 'users' && (
          <UsersTab
            users={users}
            copy={copy}
            localeTag={localeTag}
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
            copy={copy}
            localeTag={localeTag}
            page={eventsPage}
            typeFilter={eventsTypeFilter}
            userFilter={eventsUserFilter}
            onPageChange={setEventsPage}
            onTypeFilterChange={setEventsTypeFilter}
            onUserFilterChange={setEventsUserFilter}
          />
        )}
        {tab === 'analytics' && analytics && <AnalyticsTab data={analytics} copy={copy} />}
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

function OverviewTab({ data, copy, localeTag }: { data: OverviewData; copy: AdminCopy; localeTag: string }) {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label={copy.totalUsers} value={data.totalUsers.toLocaleString(localeTag)} />
        <StatCard label={copy.totalSessions} value={data.totalSessions.toLocaleString(localeTag)} sub={`${data.todaySessions.toLocaleString(localeTag)} ${copy.today}`} />
        <StatCard label={copy.totalEvents} value={data.totalEvents.toLocaleString(localeTag)} sub={`${data.todayEvents.toLocaleString(localeTag)} ${copy.today}`} />
        <StatCard label={copy.thisWeek} value={data.weekSessions.toLocaleString(localeTag)} sub={copy.sessionsLower} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Top Countries */}
        <section>
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">{copy.topCountries}</h3>
          {data.topCountries.length === 0 ? (
            <p className="text-sm text-zinc-600">{copy.noDataYet}</p>
          ) : (
            <div className="space-y-2">
              {data.topCountries.map((c) => (
                <div key={c.country} className="flex items-center justify-between text-sm py-1.5 px-3 bg-zinc-900/50 rounded">
                  <span className="text-zinc-300">{c.country}</span>
                  <span className="text-zinc-500">{copy.sessionsCount(c.count)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Devices */}
        <section>
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">{copy.devices}</h3>
          {data.topDevices.length === 0 ? (
            <p className="text-sm text-zinc-600">{copy.noDataYet}</p>
          ) : (
            <div className="space-y-2">
              {data.topDevices.map((d) => (
                <div key={d.deviceType} className="flex items-center justify-between text-sm py-1.5 px-3 bg-zinc-900/50 rounded">
                  <span className="text-zinc-300 capitalize">{d.deviceType}</span>
                  <span className="text-zinc-500">{copy.sessionsCount(d.count)}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Recent Events */}
      <section>
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">{copy.recentEvents}</h3>
        <div className="space-y-1 max-h-[500px] overflow-y-auto">
          {data.recentEvents.map((e) => (
            <div key={e.id} className="flex items-center gap-3 text-sm py-2 px-3 bg-zinc-900/50 rounded hover:bg-zinc-900 transition-colors">
              <span className="text-zinc-500 w-16 shrink-0">{timeAgo(e.timestamp, localeTag)}</span>
              <span className="text-zinc-300 w-24 shrink-0 truncate">{e.userName || e.userId?.slice(0, 8) || copy.anon}</span>
              <span className="text-emerald-400 w-56 shrink-0">{describeEvent(e.eventType, e.eventData as Record<string, unknown> | null)}</span>
              <span className="text-zinc-600 text-xs font-mono truncate">
                {e.eventType}
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
  copy,
  localeTag,
  onSelectUser,
  onFilterEvents,
}: {
  users: UserRow[];
  copy: AdminCopy;
  localeTag: string;
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
          placeholder={copy.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-md px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 text-sm"
        />
        <span className="text-sm text-zinc-500">{copy.usersCount(filtered.length)}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-500 border-b border-zinc-800">
              <th className="pb-2 pr-4">{copy.name}</th>
              <th className="pb-2 pr-4">{copy.country}</th>
              <th className="pb-2 pr-4">{copy.device}</th>
              <th className="pb-2 pr-4">{copy.browser}</th>
              <th className="pb-2 pr-4">{copy.language}</th>
              <th className="pb-2 pr-4">{copy.sessions}</th>
              <th className="pb-2 pr-4">{copy.eventsButton}</th>
              <th className="pb-2 pr-4">{copy.firstSeen}</th>
              <th className="pb-2 pr-4">{copy.lastSeen}</th>
              <th className="pb-2">{copy.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.userId} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                <td className="py-2.5 pr-4">
                  <span className="text-zinc-200">{u.userName || copy.anonymous}</span>
                  <div className="text-xs text-zinc-600 font-mono mt-0.5">{u.userId.slice(0, 12)}...</div>
                </td>
                <td className="py-2.5 pr-4">{u.country || '-'}{u.city ? `, ${u.city}` : ''}</td>
                <td className="py-2.5 pr-4 capitalize">{u.deviceType || '-'}</td>
                <td className="py-2.5 pr-4">{u.browser || '-'}</td>
                <td className="py-2.5 pr-4 uppercase">{u.appLanguage || '-'}</td>
                <td className="py-2.5 pr-4 text-zinc-300">{u.sessionCount}</td>
                <td className="py-2.5 pr-4 text-zinc-300">{u.eventCount}</td>
                <td className="py-2.5 pr-4 text-zinc-500">{timeAgo(u.firstSeen, localeTag)}</td>
                <td className="py-2.5 pr-4 text-zinc-500">{timeAgo(u.lastSeen, localeTag)}</td>
                <td className="py-2.5">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectUser(u.userId)}
                      className="text-xs px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors text-amber-400"
                    >
                      {copy.detail}
                    </button>
                    <button
                      onClick={() => onFilterEvents(u.userId)}
                      className="text-xs px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors text-zinc-400"
                    >
                      {copy.eventsButton}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-zinc-600 py-8">{copy.noUsersFound}</p>
      )}
    </div>
  );
}

// ─── Events Tab ─────────────────────────────────────────────────────────

function EventsTab({
  data,
  copy,
  localeTag,
  page,
  typeFilter,
  userFilter,
  onPageChange,
  onTypeFilterChange,
  onUserFilterChange,
}: {
  data: EventsData;
  copy: AdminCopy;
  localeTag: string;
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
          <option value="">{copy.allEventTypes}</option>
          {data.eventTypes.map((t) => (
            <option key={t.type} value={t.type}>
              {t.type} ({t.count})
            </option>
          ))}
        </select>

        {userFilter && (
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm">
            <span className="text-zinc-500">{copy.user}:</span>
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
          {copy.eventsTotal(data.total.toLocaleString(localeTag), data.page, data.totalPages)}
        </span>
      </div>

      {/* Event List */}
      <div className="space-y-1 max-h-[600px] overflow-y-auto">
        {data.events.map((e) => (
          <div key={e.id} className="flex items-start gap-3 text-sm py-2 px-3 bg-zinc-900/50 rounded hover:bg-zinc-900 transition-colors">
            <span className="text-zinc-500 w-36 shrink-0">{formatDate(e.timestamp, localeTag)}</span>
            <span className="text-zinc-300 w-24 shrink-0 truncate">{e.userName || (e.userId ? e.userId.slice(0, 8) : copy.anon)}</span>
            <span className="text-emerald-400 w-56 shrink-0">{describeEvent(e.eventType, e.eventData as Record<string, unknown> | null)}</span>
            <span className="text-zinc-600 font-mono text-xs flex-1 truncate">
              {e.eventType}
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
            {copy.prev}
          </button>
          <span className="text-sm text-zinc-500 px-4">
            {page} / {data.totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(data.totalPages, page + 1))}
            disabled={page >= data.totalPages}
            className="px-3 py-1.5 text-sm bg-zinc-900 border border-zinc-800 rounded-lg disabled:opacity-30 hover:border-zinc-700 transition-colors"
          >
            {copy.next}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Analytics Tab ──────────────────────────────────────────────────────

function AnalyticsTab({ data, copy }: { data: AnalyticsData; copy: AdminCopy }) {
  return (
    <div className="space-y-8">
      {/* Sessions Per Day (simple bar chart) */}
      <section>
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">{copy.sessionsPerDayLast30}</h3>
        {data.sessionsPerDay.length === 0 ? (
          <p className="text-sm text-zinc-600">{copy.noDataYet}</p>
        ) : (
          <div className="flex items-end gap-1 h-32 bg-zinc-900/50 rounded-xl p-4">
            {(() => {
              const max = Math.max(...data.sessionsPerDay.map((d) => d.count), 1);
              return data.sessionsPerDay.map((d) => (
                <div
                  key={d.date}
                  className="flex-1 bg-amber-500/60 hover:bg-amber-500 rounded-t transition-colors cursor-default group relative"
                  style={{ height: `${Math.max((d.count / max) * 100, 2)}%` }}
                  title={copy.sessionTooltip(d.date, d.count)}
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
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">{copy.mostVisitedScreens}</h3>
          <div className="space-y-2">
            {data.screenViews.map((s) => {
              const max = data.screenViews[0]?.count || 1;
              return (
                <div key={s.viewName} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-amber-400">{s.viewName}</span>
                    <span className="text-zinc-500">
                      {s.count} {copy.views}{s.avgDuration > 0 ? ` | ${copy.avg} ${s.avgDuration}s` : ''}
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
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">{copy.mostCommonEvents}</h3>
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
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">{copy.browsers}</h3>
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
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">{copy.operatingSystems}</h3>
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
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">{copy.appLanguages}</h3>
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
