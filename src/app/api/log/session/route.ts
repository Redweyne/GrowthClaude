import { NextResponse } from 'next/server';
import { activityDb, isLegacyActivityDbEnabled } from '@/lib/activityDb';
import { parseUserAgent, resolveGeo, getClientIp } from '@/lib/activityLogger.server';

export async function POST(request: Request) {
  try {
    if (!isLegacyActivityDbEnabled) {
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

    // Extract IP and User-Agent from the request
    const ip = getClientIp(request);
    const userAgentString = request.headers.get('user-agent') || '';

    // Parse user agent for browser/OS/device info
    const ua = parseUserAgent(userAgentString);

    // Resolve geolocation from IP (non-blocking, best-effort)
    const geo = await resolveGeo(ip);

    // Create session record
    const session = await activityDb.activitySession.create({
      data: {
        userId: userId || null,
        userName: userName || null,
        ipAddress: ip,
        userAgent: userAgentString,
        browser: ua.browser,
        browserVersion: ua.browserVersion,
        os: ua.os,
        osVersion: ua.osVersion,
        deviceType: ua.deviceType,
        country: geo?.country || null,
        city: geo?.city || null,
        region: geo?.region || null,
        screenWidth: screenWidth ? parseInt(screenWidth, 10) : null,
        screenHeight: screenHeight ? parseInt(screenHeight, 10) : null,
        appLanguage: appLanguage || null,
        referrer: referrer || null,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('[Activity Log] Session creation failed:', error);
    // Never block the app — return a placeholder so the client can still queue events
    return NextResponse.json({ sessionId: null }, { status: 200 });
  }
}
