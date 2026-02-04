// ============================================================================
// ACTIVITY LOGGER - Server-side utilities
// Zero external dependencies. Parses UA strings and resolves IP geo.
// ============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// USER-AGENT PARSING
// ─────────────────────────────────────────────────────────────────────────────

export interface ParsedUA {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

export function parseUserAgent(ua: string): ParsedUA {
  const result: ParsedUA = {
    browser: 'Unknown',
    browserVersion: '',
    os: 'Unknown',
    osVersion: '',
    deviceType: 'desktop',
  };

  if (!ua) return result;

  // --- Browser detection (order matters: check specific before generic) ---
  if (ua.includes('Edg/')) {
    result.browser = 'Edge';
    result.browserVersion = extract(ua, /Edg\/([\d.]+)/);
  } else if (ua.includes('OPR/') || ua.includes('Opera')) {
    result.browser = 'Opera';
    result.browserVersion = extract(ua, /(?:OPR|Opera)\/([\d.]+)/);
  } else if (ua.includes('SamsungBrowser/')) {
    result.browser = 'Samsung Browser';
    result.browserVersion = extract(ua, /SamsungBrowser\/([\d.]+)/);
  } else if (ua.includes('Firefox/') && !ua.includes('Seamonkey')) {
    result.browser = 'Firefox';
    result.browserVersion = extract(ua, /Firefox\/([\d.]+)/);
  } else if (ua.includes('CriOS/')) {
    result.browser = 'Chrome';
    result.browserVersion = extract(ua, /CriOS\/([\d.]+)/);
  } else if (ua.includes('Chrome/') && !ua.includes('Chromium')) {
    result.browser = 'Chrome';
    result.browserVersion = extract(ua, /Chrome\/([\d.]+)/);
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    result.browser = 'Safari';
    result.browserVersion = extract(ua, /Version\/([\d.]+)/);
  }

  // --- OS detection ---
  if (ua.includes('iPhone') || ua.includes('iPad') || ua.includes('iPod')) {
    result.os = 'iOS';
    result.osVersion = extract(ua, /OS ([\d_]+)/).replace(/_/g, '.');
  } else if (ua.includes('Mac OS X')) {
    result.os = 'macOS';
    result.osVersion = extract(ua, /Mac OS X ([\d_]+)/).replace(/_/g, '.');
  } else if (ua.includes('Android')) {
    result.os = 'Android';
    result.osVersion = extract(ua, /Android ([\d.]+)/);
  } else if (ua.includes('Windows')) {
    result.os = 'Windows';
    result.osVersion = extract(ua, /Windows NT ([\d.]+)/);
  } else if (ua.includes('Linux')) {
    result.os = 'Linux';
    result.osVersion = '';
  } else if (ua.includes('CrOS')) {
    result.os = 'ChromeOS';
    result.osVersion = '';
  }

  // --- Device type ---
  if (/Mobi|Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    result.deviceType = 'mobile';
  } else if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) {
    result.deviceType = 'tablet';
  }

  return result;
}

function extract(ua: string, regex: RegExp): string {
  const match = ua.match(regex);
  return match?.[1] || '';
}

// ─────────────────────────────────────────────────────────────────────────────
// IP GEOLOCATION (free API, cached in-memory)
// ─────────────────────────────────────────────────────────────────────────────

export interface GeoInfo {
  country: string;
  city: string;
  region: string;
}

// In-memory cache to avoid repeated lookups for the same IP
const geoCache = new Map<string, GeoInfo>();

export async function resolveGeo(ip: string): Promise<GeoInfo | null> {
  if (!ip || ip === 'unknown' || ip === '127.0.0.1' || ip === '::1') {
    return null;
  }

  // Check cache first
  const cached = geoCache.get(ip);
  if (cached) return cached;

  try {
    // ip-api.com is free for server-side use, no API key needed
    // Rate limit: 45 requests/minute (more than enough for session creation)
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,regionName,city`,
      { signal: AbortSignal.timeout(3000) }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data.status !== 'success') return null;

    const geo: GeoInfo = {
      country: data.country || '',
      city: data.city || '',
      region: data.regionName || '',
    };

    // Cache the result (limit cache size to prevent memory leak)
    if (geoCache.size > 10000) {
      const firstKey = geoCache.keys().next().value;
      if (firstKey) geoCache.delete(firstKey);
    }
    geoCache.set(ip, geo);

    return geo;
  } catch {
    // Geo lookup is best-effort; never block session creation
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// IP EXTRACTION FROM REQUEST
// ─────────────────────────────────────────────────────────────────────────────

export function getClientIp(request: Request): string {
  // Check common proxy headers (nginx, cloudflare, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp.trim();
  }

  return 'unknown';
}
