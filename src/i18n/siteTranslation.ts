import { headers } from 'next/headers';
import { type Locale } from './config';
import { getLocaleFromCookieHeader } from './localeCookie';
import { createT } from './shared';

/** Server-side translation getter — reads locale from cookie header */
export async function getSiteTranslation(): Promise<{ t: (key: string, params?: Record<string, string | number>) => string; locale: Locale }> {
  const headerStore = await headers();
  const cookieHeader = headerStore.get('cookie');
  const locale = getLocaleFromCookieHeader(cookieHeader);
  return { t: createT(locale), locale };
}
