import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabaseService';

interface IncomingEvent {
  eventType: string;
  eventData?: string | null;
  view?: string | null;
  timestamp?: string;
}

interface IncomingPageView {
  viewName: string;
  enteredAt: string;
  duration?: number | null;
}

export async function POST(request: Request) {
  try {
    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const body = await request.json();
    const { sessionId, userId, events, pageViews } = body as {
      sessionId: string;
      userId?: string;
      events?: IncomingEvent[];
      pageViews?: IncomingPageView[];
    };

    if (!sessionId) {
      return NextResponse.json({ ok: true });
    }

    const promises: PromiseLike<unknown>[] = [];

    // Batch insert events
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

    // Batch insert page views
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
