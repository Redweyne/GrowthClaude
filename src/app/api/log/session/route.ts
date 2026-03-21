import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabaseService';
import { parseUserAgent, resolveGeo, getClientIp } from '@/lib/activityLogger.server';
import { z } from 'zod';

const SessionSchema = z.object({
  userId: z.string().max(200).optional(),
  userName: z.string().max(200).optional(),
  appLanguage: z.string().max(10).optional(),
  screenWidth: z.union([z.string(), z.number()]).optional(),
  screenHeight: z.union([z.string(), z.number()]).optional(),
  referrer: z.string().max(2000).optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json({ sessionId: null }, { status: 200 });
    }

    const body = await request.json();
    const parsed = SessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ sessionId: null }, { status: 200 });
    }

    const {
      userId,
      userName,
      appLanguage,
      screenWidth,
      screenHeight,
      referrer,
    } = parsed.data;

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
        screen_width: screenWidth ? parseInt(String(screenWidth), 10) : null,
        screen_height: screenHeight ? parseInt(String(screenHeight), 10) : null,
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
