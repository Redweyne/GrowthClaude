import { NextRequest, NextResponse } from 'next/server';
import { activityDb, isLegacyActivityDbEnabled } from '@/lib/activityDb';

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

  if (!isLegacyActivityDbEnabled) {
    return NextResponse.json(
      { error: 'Legacy activity database is disabled', reason: 'Set ENABLE_LEGACY_ACTIVITY_DB=true to re-enable admin analytics' },
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
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalSessions,
    totalEvents,
    totalPageViews,
    todaySessions,
    todayEvents,
    weekSessions,
    recentEvents,
    uniqueUsers,
    topCountries,
    topDevices,
  ] = await Promise.all([
    activityDb.activitySession.count(),
    activityDb.activityEvent.count(),
    activityDb.activityPageView.count(),
    activityDb.activitySession.count({ where: { createdAt: { gte: todayStart } } }),
    activityDb.activityEvent.count({ where: { timestamp: { gte: todayStart } } }),
    activityDb.activitySession.count({ where: { createdAt: { gte: weekAgo } } }),
    activityDb.activityEvent.findMany({
      orderBy: { timestamp: 'desc' },
      take: 20,
      include: { session: { select: { userName: true, country: true, deviceType: true } } },
    }),
    activityDb.activitySession.groupBy({
      by: ['userId'],
      where: { userId: { not: null } },
      _count: true,
    }),
    activityDb.activitySession.groupBy({
      by: ['country'],
      where: { country: { not: null } },
      _count: true,
      orderBy: { _count: { country: 'desc' } },
      take: 10,
    }),
    activityDb.activitySession.groupBy({
      by: ['deviceType'],
      where: { deviceType: { not: null } },
      _count: true,
      orderBy: { _count: { deviceType: 'desc' } },
    }),
  ]);

  return {
    totalUsers: uniqueUsers.length,
    totalSessions,
    totalEvents,
    totalPageViews,
    todaySessions,
    todayEvents,
    weekSessions,
    recentEvents: recentEvents.map((e) => ({
      id: e.id,
      eventType: e.eventType,
      eventData: e.eventData ? safeParseJSON(e.eventData) : null,
      view: e.view,
      userId: e.userId,
      userName: e.session?.userName,
      country: e.session?.country,
      deviceType: e.session?.deviceType,
      timestamp: e.timestamp,
    })),
    topCountries: topCountries.map((c) => ({
      country: c.country || 'Unknown',
      count: c._count,
    })),
    topDevices: topDevices.map((d) => ({
      deviceType: d.deviceType || 'Unknown',
      count: d._count,
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// USERS LIST
// ─────────────────────────────────────────────────────────────────────────────

async function getUsers() {
  // Get all sessions grouped by userId with aggregated info
  const sessions = await activityDb.activitySession.findMany({
    where: { userId: { not: null } },
    orderBy: { createdAt: 'desc' },
    select: {
      userId: true,
      userName: true,
      country: true,
      city: true,
      deviceType: true,
      browser: true,
      os: true,
      appLanguage: true,
      createdAt: true,
      _count: { select: { events: true } },
    },
  });

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
    firstSeen: Date;
    lastSeen: Date;
    sessionCount: number;
    eventCount: number;
  }>();

  for (const s of sessions) {
    if (!s.userId) continue;
    const existing = userMap.get(s.userId);
    if (existing) {
      existing.sessionCount++;
      existing.eventCount += s._count.events;
      if (s.createdAt > existing.lastSeen) {
        existing.lastSeen = s.createdAt;
        // Update to latest info
        if (s.userName) existing.userName = s.userName;
        if (s.country) existing.country = s.country;
        if (s.city) existing.city = s.city;
        if (s.deviceType) existing.deviceType = s.deviceType;
        if (s.browser) existing.browser = s.browser;
        if (s.os) existing.os = s.os;
      }
      if (s.createdAt < existing.firstSeen) {
        existing.firstSeen = s.createdAt;
      }
    } else {
      userMap.set(s.userId, {
        userId: s.userId,
        userName: s.userName,
        country: s.country,
        city: s.city,
        deviceType: s.deviceType,
        browser: s.browser,
        os: s.os,
        appLanguage: s.appLanguage,
        firstSeen: s.createdAt,
        lastSeen: s.createdAt,
        sessionCount: 1,
        eventCount: s._count.events,
      });
    }
  }

  const users = Array.from(userMap.values()).sort(
    (a, b) => b.lastSeen.getTime() - a.lastSeen.getTime()
  );

  return { users };
}

// ─────────────────────────────────────────────────────────────────────────────
// USER DETAIL
// ─────────────────────────────────────────────────────────────────────────────

async function getUserDetail(userId: string) {
  const [sessions, recentEvents, pageViews] = await Promise.all([
    activityDb.activitySession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        createdAt: true,
        endedAt: true,
        ipAddress: true,
        country: true,
        city: true,
        browser: true,
        os: true,
        deviceType: true,
        screenWidth: true,
        screenHeight: true,
        appLanguage: true,
      },
    }),
    activityDb.activityEvent.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 100,
      select: {
        id: true,
        eventType: true,
        eventData: true,
        view: true,
        timestamp: true,
        sessionId: true,
      },
    }),
    activityDb.activityPageView.findMany({
      where: { userId },
      orderBy: { enteredAt: 'desc' },
      take: 50,
      select: {
        viewName: true,
        enteredAt: true,
        duration: true,
      },
    }),
  ]);

  return {
    sessions,
    events: recentEvents.map((e) => ({
      ...e,
      eventData: e.eventData ? safeParseJSON(e.eventData) : null,
    })),
    pageViews,
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
  const where: Record<string, unknown> = {};
  if (eventType) where.eventType = eventType;
  if (userId) where.userId = userId;

  const [events, total] = await Promise.all([
    activityDb.activityEvent.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        session: {
          select: { userName: true, country: true, deviceType: true, browser: true },
        },
      },
    }),
    activityDb.activityEvent.count({ where }),
  ]);

  // Get unique event types for filter dropdown
  const eventTypes = await activityDb.activityEvent.groupBy({
    by: ['eventType'],
    _count: true,
    orderBy: { _count: { eventType: 'desc' } },
  });

  return {
    events: events.map((e) => ({
      id: e.id,
      eventType: e.eventType,
      eventData: e.eventData ? safeParseJSON(e.eventData) : null,
      view: e.view,
      userId: e.userId,
      userName: e.session?.userName,
      country: e.session?.country,
      deviceType: e.session?.deviceType,
      browser: e.session?.browser,
      timestamp: e.timestamp,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
    eventTypes: eventTypes.map((t) => ({
      type: t.eventType,
      count: t._count,
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────────────────────────────────────

async function getAnalytics() {
  const [
    screenViews,
    topEvents,
    sessionsPerDay,
    browserBreakdown,
    osBreakdown,
    languageBreakdown,
  ] = await Promise.all([
    // Most visited screens
    activityDb.activityPageView.groupBy({
      by: ['viewName'],
      _count: true,
      _avg: { duration: true },
      orderBy: { _count: { viewName: 'desc' } },
    }),
    // Most common events
    activityDb.activityEvent.groupBy({
      by: ['eventType'],
      _count: true,
      orderBy: { _count: { eventType: 'desc' } },
      take: 20,
    }),
    // Sessions per day (last 30 days)
    getSessionsPerDay(30),
    // Browser breakdown
    activityDb.activitySession.groupBy({
      by: ['browser'],
      where: { browser: { not: null } },
      _count: true,
      orderBy: { _count: { browser: 'desc' } },
      take: 10,
    }),
    // OS breakdown
    activityDb.activitySession.groupBy({
      by: ['os'],
      where: { os: { not: null } },
      _count: true,
      orderBy: { _count: { os: 'desc' } },
      take: 10,
    }),
    // Language breakdown
    activityDb.activitySession.groupBy({
      by: ['appLanguage'],
      where: { appLanguage: { not: null } },
      _count: true,
      orderBy: { _count: { appLanguage: 'desc' } },
    }),
  ]);

  return {
    screenViews: screenViews.map((s) => ({
      viewName: s.viewName,
      count: s._count,
      avgDuration: Math.round(s._avg.duration || 0),
    })),
    topEvents: topEvents.map((e) => ({
      eventType: e.eventType,
      count: e._count,
    })),
    sessionsPerDay,
    browserBreakdown: browserBreakdown.map((b) => ({
      browser: b.browser || 'Unknown',
      count: b._count,
    })),
    osBreakdown: osBreakdown.map((o) => ({
      os: o.os || 'Unknown',
      count: o._count,
    })),
    languageBreakdown: languageBreakdown.map((l) => ({
      language: l.appLanguage || 'Unknown',
      count: l._count,
    })),
  };
}

async function getSessionsPerDay(days: number) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const sessions = await activityDb.activitySession.findMany({
    where: { createdAt: { gte: cutoff } },
    select: { createdAt: true },
  });

  // Group by date string
  const byDay = new Map<string, number>();
  for (const s of sessions) {
    const day = s.createdAt.toISOString().split('T')[0];
    byDay.set(day, (byDay.get(day) || 0) + 1);
  }

  // Fill in missing days with 0
  const result: { date: string; count: number }[] = [];
  const current = new Date(cutoff);
  const today = new Date();
  while (current <= today) {
    const day = current.toISOString().split('T')[0];
    result.push({ date: day, count: byDay.get(day) || 0 });
    current.setDate(current.getDate() + 1);
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────

function safeParseJSON(str: string): unknown {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}
