import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabaseService';
import { z } from 'zod';

const EventSchema = z.object({
  eventType: z.string().max(100),
  eventData: z.string().max(5000).nullish(),
  view: z.string().max(100).nullish(),
  timestamp: z.string().max(50).optional(),
});

const PageViewSchema = z.object({
  viewName: z.string().max(100),
  enteredAt: z.string().max(50),
  duration: z.number().min(0).max(86400).nullish(),
});

const EventLogSchema = z.object({
  sessionId: z.string().uuid(),
  userId: z.string().max(200).optional(),
  events: z.array(EventSchema).max(100).optional(),
  pageViews: z.array(PageViewSchema).max(100).optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const body = await request.json();
    const parsed = EventLogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: true });
    }

    const { sessionId, userId, events, pageViews } = parsed.data;

    if (!sessionId) {
      return NextResponse.json({ ok: true });
    }

    const promises: PromiseLike<unknown>[] = [];

    // Batch insert events (zod already caps at 100)
    if (events && events.length > 0) {
      promises.push(
        supabase.from('activity_events').insert(
          events.map((e) => ({
            session_id: sessionId,
            user_id: userId || null,
            event_type: e.eventType,
            event_data: e.eventData ? safeParseJSON(e.eventData) : null,
            view: e.view || null,
            timestamp: e.timestamp || new Date().toISOString(),
          }))
        ).then(() => {})
      );
    }

    // Batch insert page views (zod already caps at 100)
    if (pageViews && pageViews.length > 0) {
      promises.push(
        supabase.from('activity_page_views').insert(
          pageViews.map((pv) => ({
            session_id: sessionId,
            user_id: userId || null,
            view_name: pv.viewName,
            entered_at: pv.enteredAt,
            duration: pv.duration ?? null,
          }))
        ).then(() => {})
      );
    }

    // Update session's userId if provided (covers onboarding-to-logged-in transition)
    if (userId) {
      promises.push(
        supabase
          .from('activity_sessions')
          .update({ user_id: userId })
          .eq('id', sessionId)
          .then(() => {})
      );
    }

    await Promise.all(promises);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Activity Log] Event logging failed:', error);
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}

function safeParseJSON(str: string): unknown {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}
