import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabaseService';
import { z } from 'zod';

const AdminQuerySchema = z.object({
  action: z.enum(['overview', 'users', 'user-detail', 'sessions', 'session-detail', 'events', 'analytics', 'marketing']).default('overview'),
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(30),
  userId: z.string().max(200).optional(),
  sessionId: z.string().max(200).optional(),
  type: z.string().max(100).optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN API - Protected endpoint for the admin dashboard
// All actions require ADMIN_SECRET in the Authorization header
// ─────────────────────────────────────────────────────────────────────────────

function unauthorized(reason: string) {
  return NextResponse.json({ error: 'Unauthorized', reason }, { status: 401 });
}

function validateAuth(request: NextRequest): { valid: boolean; reason: string } {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return { valid: false, reason: 'ADMIN_SECRET env variable is not set on the server' };
  }
  if (secret === 'change-this-to-a-secure-random-string') {
    return { valid: false, reason: 'ADMIN_SECRET is still the default placeholder — change it in .env' };
  }
  const auth = request.headers.get('authorization');
  if (!auth) {
    return { valid: false, reason: 'No authorization header sent' };
  }
  const token = auth.replace('Bearer ', '');
  if (token !== secret) {
    return { valid: false, reason: 'Secret does not match' };
  }
  return { valid: true, reason: '' };
}

export async function GET(request: NextRequest) {
  const auth = validateAuth(request);
  if (!auth.valid) return unauthorized(auth.reason);

  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured', reason: 'SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL missing' },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());
  const parsed = AdminQuerySchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query parameters', details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { action, dateFrom, dateTo, page, limit, userId, sessionId, type: eventType } = parsed.data;

  try {
    switch (action) {
      case 'overview':
        return NextResponse.json(await getOverview(dateFrom, dateTo));
      case 'users':
        return NextResponse.json(await getUsers());
      case 'user-detail': {
        if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
        return NextResponse.json(await getUserDetail(userId));
      }
      case 'sessions':
        return NextResponse.json(await getSessions(page, limit, dateFrom, dateTo));
      case 'session-detail': {
        if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
        return NextResponse.json(await getSessionDetail(sessionId));
      }
      case 'events':
        return NextResponse.json(await getEvents(page, limit, eventType, userId, dateFrom, dateTo));
      case 'analytics':
        return NextResponse.json(await getAnalytics(dateFrom, dateTo));
      case 'marketing':
        return NextResponse.json(await getMarketing(dateFrom, dateTo));
    }
  } catch (error) {
    console.error('[Admin API] Error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Internal error', reason: message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// OVERVIEW
// ─────────────────────────────────────────────────────────────────────────────

async function getOverview(dateFrom?: string, dateTo?: string) {
  const supabase = getServiceClient()!;
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Build date-filtered count queries
  const sessionsQuery = supabase.from('activity_sessions').select('id', { count: 'exact', head: true });
  const eventsQuery = supabase.from('activity_events').select('id', { count: 'exact', head: true });
  if (dateFrom) {
    sessionsQuery.gte('created_at', dateFrom);
    eventsQuery.gte('timestamp', dateFrom);
  }
  if (dateTo) {
    sessionsQuery.lte('created_at', dateTo + 'T23:59:59.999Z');
    eventsQuery.lte('timestamp', dateTo + 'T23:59:59.999Z');
  }

  const [
    totalSessionsRes,
    totalEventsRes,
    totalPageViewsRes,
    todaySessionsRes,
    todayEventsRes,
    weekSessionsRes,
    recentEventsRes,
    uniqueUsersRes,
    topCountriesRes,
    topDevicesRes,
    marketingCountRes,
  ] = await Promise.all([
    sessionsQuery,
    eventsQuery,
    supabase.from('activity_page_views').select('id', { count: 'exact', head: true }),
    supabase.from('activity_sessions').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
    supabase.from('activity_events').select('id', { count: 'exact', head: true }).gte('timestamp', todayStart),
    supabase.from('activity_sessions').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
    supabase
      .from('activity_events')
      .select('id, event_type, event_data, view, user_id, timestamp, session_id')
      .order('timestamp', { ascending: false })
      .limit(20),
    supabase.rpc('get_unique_user_count'),
    supabase.rpc('get_top_countries', { max_results: 10 }),
    supabase.rpc('get_device_breakdown'),
    supabase.from('marketing_events').select('id', { count: 'exact', head: true }),
  ]);

  // For recent events, fetch session info separately
  const recentEvents = recentEventsRes.data || [];
  const sessionIds = [...new Set(recentEvents.map((e: { session_id: string }) => e.session_id).filter(Boolean))];
  let sessionMap: Record<string, { user_name: string | null; country: string | null; device_type: string | null }> = {};
  if (sessionIds.length > 0) {
    const { data: sessions } = await supabase
      .from('activity_sessions')
      .select('id, user_name, country, device_type')
      .in('id', sessionIds);
    if (sessions) {
      sessionMap = Object.fromEntries(sessions.map((s: { id: string; user_name: string | null; country: string | null; device_type: string | null }) => [s.id, s]));
    }
  }

  return {
    totalUsers: uniqueUsersRes.data ?? 0,
    totalSessions: totalSessionsRes.count ?? 0,
    totalEvents: totalEventsRes.count ?? 0,
    totalPageViews: totalPageViewsRes.count ?? 0,
    todaySessions: todaySessionsRes.count ?? 0,
    todayEvents: todayEventsRes.count ?? 0,
    weekSessions: weekSessionsRes.count ?? 0,
    totalMarketingEvents: marketingCountRes.count ?? 0,
    recentEvents: recentEvents.map((e: { id: string; event_type: string; event_data: unknown; view: string | null; user_id: string | null; timestamp: string; session_id: string }) => {
      const session = sessionMap[e.session_id];
      return {
        id: e.id,
        eventType: e.event_type,
        eventData: e.event_data,
        view: e.view,
        userId: e.user_id,
        userName: session?.user_name ?? null,
        country: session?.country ?? null,
        deviceType: session?.device_type ?? null,
        timestamp: e.timestamp,
      };
    }),
    topCountries: (topCountriesRes.data || []).map((c: { country: string; count: number }) => ({
      country: c.country || 'Unknown',
      count: c.count,
    })),
    topDevices: (topDevicesRes.data || []).map((d: { device_type: string; count: number }) => ({
      deviceType: d.device_type || 'Unknown',
      count: d.count,
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSIONS LIST (paginated, date-filtered)
// ─────────────────────────────────────────────────────────────────────────────

async function getSessions(page: number, limit: number, dateFrom?: string, dateTo?: string) {
  const supabase = getServiceClient()!;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('activity_sessions')
    .select('id, user_id, user_name, country, city, device_type, browser, os, app_language, created_at, ended_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (dateFrom) query = query.gte('created_at', dateFrom);
  if (dateTo) query = query.lte('created_at', dateTo + 'T23:59:59.999Z');

  const sessionsRes = await query;
  const sessions = sessionsRes.data || [];
  const total = sessionsRes.count ?? 0;

  // Get event counts per session
  const sessionIds = sessions.map((s: { id: string }) => s.id);
  let eventCountMap: Record<string, number> = {};
  if (sessionIds.length > 0) {
    const { data: eventCounts } = await supabase
      .from('activity_events')
      .select('session_id')
      .in('session_id', sessionIds);
    if (eventCounts) {
      for (const e of eventCounts) {
        eventCountMap[e.session_id] = (eventCountMap[e.session_id] || 0) + 1;
      }
    }
  }

  return {
    sessions: sessions.map((s: Record<string, unknown>) => ({
      id: s.id,
      userId: s.user_id,
      userName: s.user_name,
      country: s.country,
      city: s.city,
      deviceType: s.device_type,
      browser: s.browser,
      os: s.os,
      appLanguage: s.app_language,
      createdAt: s.created_at,
      endedAt: s.ended_at,
      eventCount: eventCountMap[s.id as string] || 0,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSION DETAIL (chronological timeline)
// ─────────────────────────────────────────────────────────────────────────────

async function getSessionDetail(sessionId: string) {
  const supabase = getServiceClient()!;

  const [sessionRes, eventsRes, pageViewsRes] = await Promise.all([
    supabase
      .from('activity_sessions')
      .select('id, user_id, user_name, ip_address, country, city, region, browser, browser_version, os, os_version, device_type, screen_width, screen_height, app_language, referrer, created_at, ended_at')
      .eq('id', sessionId)
      .single(),
    supabase
      .from('activity_events')
      .select('id, event_type, event_data, view, timestamp')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true })
      .limit(500),
    supabase
      .from('activity_page_views')
      .select('view_name, entered_at, duration')
      .eq('session_id', sessionId)
      .order('entered_at', { ascending: true })
      .limit(200),
  ]);

  const session = sessionRes.data;
  if (!session) {
    return { session: null, timeline: [] };
  }

  // Merge events and page views into a single chronological timeline
  const timeline: { time: string; type: 'event' | 'pageview'; description: string; detail: string | null; screen: string | null; raw: string | null }[] = [];

  for (const e of (eventsRes.data || [])) {
    timeline.push({
      time: e.timestamp,
      type: 'event',
      description: '', // will be filled client-side with describeEvent
      detail: null,
      screen: e.view,
      raw: e.event_type,
      ...{ eventData: e.event_data }, // pass through for client-side description
    });
  }

  for (const pv of (pageViewsRes.data || [])) {
    timeline.push({
      time: pv.entered_at,
      type: 'pageview',
      description: `Viewed "${pv.view_name}"`,
      detail: pv.duration != null ? `${pv.duration}s` : null,
      screen: pv.view_name,
      raw: null,
    });
  }

  // Sort by time
  timeline.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  return {
    session: {
      id: session.id,
      userId: session.user_id,
      userName: session.user_name,
      country: session.country,
      city: session.city,
      region: session.region,
      browser: session.browser,
      browserVersion: session.browser_version,
      os: session.os,
      osVersion: session.os_version,
      deviceType: session.device_type,
      screenWidth: session.screen_width,
      screenHeight: session.screen_height,
      appLanguage: session.app_language,
      referrer: session.referrer,
      createdAt: session.created_at,
      endedAt: session.ended_at,
    },
    timeline,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// USERS LIST
// ─────────────────────────────────────────────────────────────────────────────

async function getUsers() {
  const supabase = getServiceClient()!;

  const { data: sessions } = await supabase
    .from('activity_sessions')
    .select('id, user_id, user_name, country, city, device_type, browser, os, app_language, created_at')
    .not('user_id', 'is', null)
    .order('created_at', { ascending: false });

  if (!sessions || sessions.length === 0) return { users: [] };

  // Get event counts per session
  const sessionIds = sessions.map((s: { id: string }) => s.id);
  const { data: eventCounts } = await supabase
    .from('activity_events')
    .select('session_id')
    .in('session_id', sessionIds);

  const eventCountBySession = new Map<string, number>();
  if (eventCounts) {
    for (const e of eventCounts) {
      eventCountBySession.set(e.session_id, (eventCountBySession.get(e.session_id) || 0) + 1);
    }
  }

  // Aggregate by userId
  const userMap = new Map<string, {
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
  }>();

  for (const s of sessions) {
    if (!s.user_id) continue;
    const sessionEventCount = eventCountBySession.get(s.id) || 0;
    const existing = userMap.get(s.user_id);
    if (existing) {
      existing.sessionCount++;
      existing.eventCount += sessionEventCount;
      if (s.created_at > existing.lastSeen) {
        existing.lastSeen = s.created_at;
        if (s.user_name) existing.userName = s.user_name;
        if (s.country) existing.country = s.country;
        if (s.city) existing.city = s.city;
        if (s.device_type) existing.deviceType = s.device_type;
        if (s.browser) existing.browser = s.browser;
        if (s.os) existing.os = s.os;
      }
      if (s.created_at < existing.firstSeen) {
        existing.firstSeen = s.created_at;
      }
    } else {
      userMap.set(s.user_id, {
        userId: s.user_id,
        userName: s.user_name,
        country: s.country,
        city: s.city,
        deviceType: s.device_type,
        browser: s.browser,
        os: s.os,
        appLanguage: s.app_language,
        firstSeen: s.created_at,
        lastSeen: s.created_at,
        sessionCount: 1,
        eventCount: sessionEventCount,
      });
    }
  }

  const users = Array.from(userMap.values()).sort(
    (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
  );

  return { users };
}

// ─────────────────────────────────────────────────────────────────────────────
// USER DETAIL
// ─────────────────────────────────────────────────────────────────────────────

async function getUserDetail(userId: string) {
  const supabase = getServiceClient()!;

  const [sessionsRes, eventsRes, pageViewsRes] = await Promise.all([
    supabase
      .from('activity_sessions')
      .select('id, created_at, ended_at, ip_address, country, city, browser, os, device_type, screen_width, screen_height, app_language')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('activity_events')
      .select('id, event_type, event_data, view, timestamp, session_id')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(100),
    supabase
      .from('activity_page_views')
      .select('view_name, entered_at, duration')
      .eq('user_id', userId)
      .order('entered_at', { ascending: false })
      .limit(50),
  ]);

  return {
    sessions: (sessionsRes.data || []).map((s: Record<string, unknown>) => ({
      id: s.id,
      createdAt: s.created_at,
      endedAt: s.ended_at,
      country: s.country,
      city: s.city,
      browser: s.browser,
      os: s.os,
      deviceType: s.device_type,
      screenWidth: s.screen_width,
      screenHeight: s.screen_height,
      appLanguage: s.app_language,
    })),
    events: (eventsRes.data || []).map((e: Record<string, unknown>) => ({
      id: e.id,
      eventType: e.event_type,
      eventData: e.event_data,
      view: e.view,
      timestamp: e.timestamp,
      sessionId: e.session_id,
    })),
    pageViews: (pageViewsRes.data || []).map((pv: Record<string, unknown>) => ({
      viewName: pv.view_name,
      enteredAt: pv.entered_at,
      duration: pv.duration,
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENTS STREAM
// ─────────────────────────────────────────────────────────────────────────────

async function getEvents(
  page: number,
  limit: number,
  eventType?: string,
  userId?: string,
  dateFrom?: string,
  dateTo?: string,
) {
  const supabase = getServiceClient()!;
  const offset = (page - 1) * limit;

  // Build query
  let query = supabase
    .from('activity_events')
    .select('id, event_type, event_data, view, user_id, timestamp, session_id', { count: 'exact' })
    .order('timestamp', { ascending: false })
    .range(offset, offset + limit - 1);

  if (eventType) query = query.eq('event_type', eventType);
  if (userId) query = query.eq('user_id', userId);
  if (dateFrom) query = query.gte('timestamp', dateFrom);
  if (dateTo) query = query.lte('timestamp', dateTo + 'T23:59:59.999Z');

  const [eventsRes, eventTypesRes] = await Promise.all([
    query,
    supabase.rpc('get_event_type_counts', { days_back: 9999 }),
  ]);

  const events = eventsRes.data || [];
  const total = eventsRes.count ?? 0;

  // Fetch session info for these events
  const sessionIds = [...new Set(events.map((e: { session_id: string }) => e.session_id).filter(Boolean))];
  let sessionMap: Record<string, { user_name: string | null; country: string | null; device_type: string | null; browser: string | null }> = {};
  if (sessionIds.length > 0) {
    const { data: sessions } = await supabase
      .from('activity_sessions')
      .select('id, user_name, country, device_type, browser')
      .in('id', sessionIds);
    if (sessions) {
      sessionMap = Object.fromEntries(sessions.map((s: { id: string; user_name: string | null; country: string | null; device_type: string | null; browser: string | null }) => [s.id, s]));
    }
  }

  return {
    events: events.map((e: { id: string; event_type: string; event_data: unknown; view: string | null; user_id: string | null; timestamp: string; session_id: string }) => {
      const session = sessionMap[e.session_id];
      return {
        id: e.id,
        eventType: e.event_type,
        eventData: e.event_data,
        view: e.view,
        userId: e.user_id,
        userName: session?.user_name ?? null,
        country: session?.country ?? null,
        deviceType: session?.device_type ?? null,
        browser: session?.browser ?? null,
        timestamp: e.timestamp,
      };
    }),
    total,
    page,
    totalPages: Math.ceil(total / limit),
    eventTypes: (eventTypesRes.data || []).map((t: { event_type: string; count: number }) => ({
      type: t.event_type,
      count: t.count,
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────────────────────────────────────

async function getAnalytics(dateFrom?: string, dateTo?: string) {
  const supabase = getServiceClient()!;

  // Calculate days_back from dateFrom if provided
  let daysBack = 30;
  if (dateFrom) {
    const from = new Date(dateFrom);
    const now = new Date();
    daysBack = Math.ceil((now.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  const [
    screenViewsRes,
    topEventsRes,
    sessionsPerDayRes,
    browserRes,
    osRes,
    languageRes,
  ] = await Promise.all([
    supabase.rpc('get_screen_analytics'),
    supabase.rpc('get_event_type_counts', { days_back: dateFrom ? daysBack : 9999 }),
    supabase.rpc('get_sessions_per_day', { days_back: daysBack }),
    supabase.rpc('get_browser_breakdown', { max_results: 10 }),
    supabase.rpc('get_os_breakdown', { max_results: 10 }),
    supabase.rpc('get_language_breakdown'),
  ]);

  // Fill in missing days for sessionsPerDay
  const rawDays = sessionsPerDayRes.data || [];
  const dayMap = new Map<string, number>();
  for (const d of rawDays) {
    dayMap.set(d.day, d.count);
  }

  const sessionsPerDay: { date: string; count: number }[] = [];
  const cutoff = dateFrom ? new Date(dateFrom) : new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
  const current = new Date(cutoff);
  const end = dateTo ? new Date(dateTo) : new Date();
  while (current <= end) {
    const day = current.toISOString().split('T')[0];
    sessionsPerDay.push({ date: day, count: dayMap.get(day) || 0 });
    current.setDate(current.getDate() + 1);
  }

  return {
    screenViews: (screenViewsRes.data || []).map((s: { view_name: string; count: number; avg_duration: number }) => ({
      viewName: s.view_name,
      count: s.count,
      avgDuration: Math.round(s.avg_duration || 0),
    })),
    topEvents: (topEventsRes.data || []).slice(0, 20).map((e: { event_type: string; count: number }) => ({
      eventType: e.event_type,
      count: e.count,
    })),
    sessionsPerDay,
    browserBreakdown: (browserRes.data || []).map((b: { browser: string; count: number }) => ({
      browser: b.browser || 'Unknown',
      count: b.count,
    })),
    osBreakdown: (osRes.data || []).map((o: { os: string; count: number }) => ({
      os: o.os || 'Unknown',
      count: o.count,
    })),
    languageBreakdown: (languageRes.data || []).map((l: { language: string; count: number }) => ({
      language: l.language || 'Unknown',
      count: l.count,
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MARKETING (Landing page / /site analytics)
// ─────────────────────────────────────────────────────────────────────────────

async function getMarketing(dateFrom?: string, dateTo?: string) {
  const supabase = getServiceClient()!;

  // ── Helper to apply date filters ──────────────────────────────────────────
  function dateBound<T extends { gte: (col: string, val: string) => T; lte: (col: string, val: string) => T }>(q: T, col = 'created_at'): T {
    if (dateFrom) q = q.gte(col, dateFrom);
    if (dateTo) q = q.lte(col, dateTo + 'T23:59:59.999Z');
    return q;
  }

  // ── Counts ────────────────────────────────────────────────────────────────
  const totalQuery = dateBound(supabase.from('marketing_events').select('id', { count: 'exact', head: true }));
  const pageViewQuery = dateBound(supabase.from('marketing_events').select('id', { count: 'exact', head: true }).eq('event_type', 'page_view'));
  const ctaQuery = dateBound(supabase.from('marketing_events').select('id', { count: 'exact', head: true }).eq('event_type', 'cta_click'));

  // ── Scroll depth ──────────────────────────────────────────────────────────
  const scrollQuery = dateBound(supabase.from('marketing_events').select('event_data').eq('event_type', 'scroll_depth'));

  // ── CTA breakdown ─────────────────────────────────────────────────────────
  const ctaBreakdownQuery = dateBound(supabase.from('marketing_events').select('event_data').eq('event_type', 'cta_click'));

  // ── Unique sessions from page views ───────────────────────────────────────
  const uniqueSessionQuery = dateBound(supabase.from('marketing_events').select('session_id').eq('event_type', 'page_view'));

  // ── Recent events ─────────────────────────────────────────────────────────
  const recentQuery = dateBound(supabase.from('marketing_events').select('id, session_id, event_type, event_data, page, created_at').order('created_at', { ascending: false }).limit(50));

  // ── All marketing sessions (with visitor info) ────────────────────────────
  const sessionsQuery = dateBound(supabase.from('marketing_sessions').select('*').order('created_at', { ascending: false }).limit(500));

  // ── All events grouped per session (for visitor timeline) ─────────────────
  const allEventsQuery = dateBound(supabase.from('marketing_events').select('session_id, event_type, event_data, created_at').order('created_at', { ascending: true }).limit(5000));

  // ── Daily visitors (page_view events grouped by date) ─────────────────────
  const dailyQuery = dateBound(supabase.from('marketing_events').select('session_id, created_at').eq('event_type', 'page_view'));

  const [totalRes, pageViewRes, ctaRes, scrollRes, ctaBreakdownRes, uniqueSessionRes, recentRes, sessionsRes, allEventsRes, dailyRes] = await Promise.all([
    totalQuery, pageViewQuery, ctaQuery, scrollQuery, ctaBreakdownQuery, uniqueSessionQuery, recentQuery, sessionsQuery, allEventsQuery, dailyQuery,
  ]);

  // ── Unique visitors ───────────────────────────────────────────────────────
  const uniqueVisitors = new Set((uniqueSessionRes.data || []).map((r: { session_id: string }) => r.session_id)).size;

  // ── Scroll depth funnel ───────────────────────────────────────────────────
  const scrollData = scrollRes.data || [];
  const scrollCounts = { 25: 0, 50: 0, 75: 0, 100: 0 };
  for (const s of scrollData) {
    const percent = (s.event_data as { percent?: number })?.percent;
    if (percent && percent in scrollCounts) scrollCounts[percent as keyof typeof scrollCounts]++;
  }

  // ── CTA breakdown ─────────────────────────────────────────────────────────
  const ctaData = ctaBreakdownRes.data || [];
  const ctaMap = new Map<string, number>();
  for (const c of ctaData) {
    const data = c.event_data as { type?: string; location?: string } | null;
    const label = data?.location ? `${data.type || 'cta'} (${data.location})` : (data?.type || 'unknown');
    ctaMap.set(label, (ctaMap.get(label) || 0) + 1);
  }
  const ctaBreakdown = Array.from(ctaMap.entries()).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);

  // ── Country breakdown ─────────────────────────────────────────────────────
  const sessions = sessionsRes.data || [];
  const countryMap = new Map<string, number>();
  for (const s of sessions) {
    const c = (s as { country?: string }).country || 'Unknown';
    countryMap.set(c, (countryMap.get(c) || 0) + 1);
  }
  const countryBreakdown = Array.from(countryMap.entries()).map(([country, count]) => ({ country, count })).sort((a, b) => b.count - a.count);

  // ── Device breakdown ──────────────────────────────────────────────────────
  const deviceMap = new Map<string, number>();
  for (const s of sessions) {
    const d = (s as { device_type?: string }).device_type || 'Unknown';
    deviceMap.set(d, (deviceMap.get(d) || 0) + 1);
  }
  const deviceBreakdown = Array.from(deviceMap.entries()).map(([device, count]) => ({ device, count })).sort((a, b) => b.count - a.count);

  // ── Browser breakdown ─────────────────────────────────────────────────────
  const browserMap = new Map<string, number>();
  for (const s of sessions) {
    const b = (s as { browser?: string }).browser || 'Unknown';
    browserMap.set(b, (browserMap.get(b) || 0) + 1);
  }
  const browserBreakdown = Array.from(browserMap.entries()).map(([browser, count]) => ({ browser, count })).sort((a, b) => b.count - a.count);

  // ── OS breakdown ──────────────────────────────────────────────────────────
  const osMap = new Map<string, number>();
  for (const s of sessions) {
    const o = (s as { os?: string }).os || 'Unknown';
    osMap.set(o, (osMap.get(o) || 0) + 1);
  }
  const osBreakdown = Array.from(osMap.entries()).map(([os, count]) => ({ os, count })).sort((a, b) => b.count - a.count);

  // ── Referrer breakdown ────────────────────────────────────────────────────
  const referrerMap = new Map<string, number>();
  for (const s of sessions) {
    let ref = (s as { referrer?: string }).referrer || '';
    if (!ref) { ref = 'Direct / None'; }
    else {
      try { ref = new URL(ref).hostname; } catch { /* keep raw */ }
    }
    referrerMap.set(ref, (referrerMap.get(ref) || 0) + 1);
  }
  const referrerBreakdown = Array.from(referrerMap.entries()).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count);

  // ── Daily visitors chart ──────────────────────────────────────────────────
  const dailyData = dailyRes.data || [];
  const dailyMap = new Map<string, Set<string>>();
  for (const d of dailyData) {
    const row = d as { session_id: string; created_at: string };
    const day = row.created_at.slice(0, 10); // YYYY-MM-DD
    if (!dailyMap.has(day)) dailyMap.set(day, new Set());
    dailyMap.get(day)!.add(row.session_id);
  }
  const visitorsPerDay = Array.from(dailyMap.entries())
    .map(([date, set]) => ({ date, visitors: set.size }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // ── Build per-session event map for visitor list ──────────────────────────
  const eventsBySession = new Map<string, { eventType: string; eventData: Record<string, unknown> | null; createdAt: string }[]>();
  for (const ev of (allEventsRes.data || [])) {
    const row = ev as { session_id: string; event_type: string; event_data: Record<string, unknown> | null; created_at: string };
    if (!eventsBySession.has(row.session_id)) eventsBySession.set(row.session_id, []);
    eventsBySession.get(row.session_id)!.push({ eventType: row.event_type, eventData: row.event_data, createdAt: row.created_at });
  }

  // ── Visitor list (sessions + their events) ────────────────────────────────
  type SessionRow = { id: string; country?: string; city?: string; region?: string; device_type?: string; browser?: string; os?: string; referrer?: string; screen_width?: number; screen_height?: number; language?: string; utm_source?: string; utm_medium?: string; utm_campaign?: string; created_at: string };
  const visitors = sessions.map((s) => {
    const row = s as SessionRow;
    const events = eventsBySession.get(row.id) || [];
    const maxScroll = events.reduce((max, e) => {
      if (e.eventType === 'scroll_depth') {
        const p = (e.eventData as { percent?: number })?.percent || 0;
        return Math.max(max, p);
      }
      return max;
    }, 0);
    const ctaClicks = events.filter(e => e.eventType === 'cta_click').map(e => {
      const d = e.eventData as { type?: string; location?: string } | null;
      return d?.type || 'CTA';
    });
    const sessionEnd = events.find(e => e.eventType === 'session_end');
    const duration = sessionEnd ? (sessionEnd.eventData as { duration_seconds?: number })?.duration_seconds ?? null : null;
    const pageViews = events.filter(e => e.eventType === 'page_view').length;

    return {
      sessionId: row.id,
      country: row.country || null,
      city: row.city || null,
      region: row.region || null,
      deviceType: row.device_type || null,
      browser: row.browser || null,
      os: row.os || null,
      referrer: row.referrer || null,
      screenWidth: row.screen_width || null,
      screenHeight: row.screen_height || null,
      language: row.language || null,
      utmSource: row.utm_source || null,
      utmMedium: row.utm_medium || null,
      utmCampaign: row.utm_campaign || null,
      arrivedAt: row.created_at,
      maxScrollDepth: maxScroll,
      ctaClicks,
      durationSeconds: duration,
      pageViews,
      totalEvents: events.length,
    };
  });

  // ── Average time on page ──────────────────────────────────────────────────
  const durations = visitors.map(v => v.durationSeconds).filter((d): d is number => d !== null && d > 0);
  const avgDuration = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : null;

  // ── Bounce rate (visitors who only had a page_view, no scroll or CTA) ─────
  const bouncedCount = visitors.filter(v => v.maxScrollDepth === 0 && v.ctaClicks.length === 0).length;
  const bounceRate = visitors.length > 0 ? Math.round((bouncedCount / visitors.length) * 100) : 0;

  return {
    totalEvents: totalRes.count ?? 0,
    pageViews: pageViewRes.count ?? 0,
    uniqueVisitors,
    ctaClicks: ctaRes.count ?? 0,
    avgDuration,
    bounceRate,
    scrollFunnel: scrollCounts,
    ctaBreakdown,
    countryBreakdown,
    deviceBreakdown,
    browserBreakdown,
    osBreakdown,
    referrerBreakdown,
    visitorsPerDay,
    visitors,
    recentEvents: (recentRes.data || []).map((e: { id: string; session_id: string; event_type: string; event_data: unknown; page: string | null; created_at: string }) => ({
      id: e.id,
      sessionId: e.session_id,
      eventType: e.event_type,
      eventData: e.event_data,
      page: e.page,
      createdAt: e.created_at,
    })),
  };
}
