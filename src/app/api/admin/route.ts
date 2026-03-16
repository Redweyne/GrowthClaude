import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabaseService';

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
  const action = searchParams.get('action') || 'overview';

  try {
    switch (action) {
      case 'overview':
        return NextResponse.json(await getOverview());
      case 'users':
        return NextResponse.json(await getUsers());
      case 'user-detail': {
        const userId = searchParams.get('userId');
        if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
        return NextResponse.json(await getUserDetail(userId));
      }
      case 'events': {
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const eventType = searchParams.get('type') || undefined;
        const userId = searchParams.get('userId') || undefined;
        return NextResponse.json(await getEvents(page, limit, eventType, userId));
      }
      case 'analytics':
        return NextResponse.json(await getAnalytics());
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
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

async function getOverview() {
  const supabase = getServiceClient()!;
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

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
  ] = await Promise.all([
    supabase.from('activity_sessions').select('id', { count: 'exact', head: true }),
    supabase.from('activity_events').select('id', { count: 'exact', head: true }),
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
  userId?: string
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

async function getAnalytics() {
  const supabase = getServiceClient()!;

  const [
    screenViewsRes,
    topEventsRes,
    sessionsPerDayRes,
    browserRes,
    osRes,
    languageRes,
  ] = await Promise.all([
    supabase.rpc('get_screen_analytics'),
    supabase.rpc('get_event_type_counts', { days_back: 9999 }),
    supabase.rpc('get_sessions_per_day', { days_back: 30 }),
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
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const current = new Date(cutoff);
  const today = new Date();
  while (current <= today) {
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
