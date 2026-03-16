import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabaseService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session_id, event_type, event_data, page } = body;

    if (!session_id || !event_type) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const supabase = getServiceClient();
    if (!supabase) {
      // Silently skip if service role not configured
      return NextResponse.json({ ok: true });
    }

    await supabase.from('marketing_events').insert({
      session_id,
      event_type,
      event_data: event_data ?? null,
      page: page ?? '/site',
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // Never fail analytics
  }
}
