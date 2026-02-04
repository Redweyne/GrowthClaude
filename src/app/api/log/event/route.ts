import { NextResponse } from 'next/server';
import { activityDb } from '@/lib/activityDb';

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
    const body = await request.json();
    const { sessionId, userId, events, pageViews } = body as {
      sessionId: string;
      userId?: string;
      events?: IncomingEvent[];
      pageViews?: IncomingPageView[];
    };

    if (!sessionId) {
      return NextResponse.json({ ok: true }); // Silently skip if no session
    }

    const promises: Promise<unknown>[] = [];

    // Batch insert events
    if (events && events.length > 0) {
      promises.push(
        activityDb.activityEvent.createMany({
          data: events.map((e) => ({
            sessionId,
            userId: userId || null,
            eventType: e.eventType,
            eventData: e.eventData || null,
            view: e.view || null,
            timestamp: e.timestamp ? new Date(e.timestamp) : new Date(),
          })),
        })
      );
    }

    // Batch insert page views
    if (pageViews && pageViews.length > 0) {
      promises.push(
        activityDb.activityPageView.createMany({
          data: pageViews.map((pv) => ({
            sessionId,
            userId: userId || null,
            viewName: pv.viewName,
            enteredAt: new Date(pv.enteredAt),
            duration: pv.duration ?? null,
          })),
        })
      );
    }

    // Update session's userId if provided (covers onboarding-to-logged-in transition)
    if (userId) {
      promises.push(
        activityDb.activitySession.update({
          where: { id: sessionId },
          data: { userId },
        }).catch(() => {
          // Session may not exist if initial creation failed
        })
      );
    }

    await Promise.all(promises);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Activity Log] Event logging failed:', error);
    // Never block the app
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
