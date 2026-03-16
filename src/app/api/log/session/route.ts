import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabaseService';
import { parseUserAgent, resolveGeo, getClientIp } from '@/lib/activityLogger.server';

export async function POST(request: Request) {
  try {
    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json({ sessionId: null }, { status: 200 });
    }

    const body = await request.json();
    const {
      userId,
      userName,
      appLanguage,
      screenWidth,
      screenHeight,
      referrer,
    } = body;

    const ip = getClientIp(request);
    const userAgentString = request.headers.get('user-agent') || '';
    const ua = parseUserAgent(userAgentString);
    const geo = await resolveGeo(ip);

    const { data, error } = await supabase
      .from('activity_sessions')
      .insert({
        user_id: userId || null,
        user_name: userName || null,
        ip_address: ip,
        user_agent: userAgentString,
        browser: ua.browser,
        browser_version: ua.browserVersion,
        os: ua.os,
        os_version: ua.osVersion,
        device_type: ua.deviceType,
        country: geo?.country || null,
        city: geo?.city || null,
        region: geo?.region || null,
        screen_width: screenWidth ? parseInt(screenWidth, 10) : null,
        screen_height: screenHeight ? parseInt(screenHeight, 10) : null,
        app_language: appLanguage || null,
        referrer: referrer || null,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[Activity Log] Session insert error:', error.message);
      return NextResponse.json({ sessionId: null }, { status: 200 });
    }

    return NextResponse.json({ sessionId: data.id });
  } catch (error) {
    console.error('[Activity Log] Session creation failed:', error);
    return NextResponse.json({ sessionId: null }, { status: 200 });
  }
}
