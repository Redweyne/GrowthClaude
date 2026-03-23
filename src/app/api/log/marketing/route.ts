import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabaseService';
import { parseUserAgent, resolveGeo, getClientIp } from '@/lib/activityLogger.server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session_id, event_type, event_data, page } = body;

    if (!session_id || !event_type) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json({ ok: true });
    }

    // Handle session registration — create a marketing_sessions row with full visitor info
    if (event_type === 'session_start' && event_data) {
      const ua = req.headers.get('user-agent') || '';
      const ip = getClientIp(req);
      const parsed = parseUserAgent(ua);
      const geo = await resolveGeo(ip);

      await supabase.from('marketing_sessions').upsert({
        id: session_id,
        ip_address: ip,
        user_agent: ua,
        browser: parsed.browser,
        browser_version: parsed.browserVersion,
        os: parsed.os,
        os_version: parsed.osVersion,
        device_type: parsed.deviceType,
        country: geo?.country || null,
        city: geo?.city || null,
        region: geo?.region || null,
        referrer: event_data.referrer || null,
        utm_source: event_data.utm_source || null,
        utm_medium: event_data.utm_medium || null,
        utm_campaign: event_data.utm_campaign || null,
        screen_width: event_data.screen_width || null,
        screen_height: event_data.screen_height || null,
        language: event_data.language || null,
        landing_page: event_data.landing_page || '/site',
      }, { onConflict: 'id' });

      // Don't insert session_start as an event — it's metadata only
      return NextResponse.json({ ok: true });
    }

    // Regular event logging
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
