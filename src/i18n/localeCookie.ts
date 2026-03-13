import { type Locale, locales, defaultLocale } from './config';

const COOKIE_NAME = 'sw-locale';

/** Read locale from cookie (client-side) */
export function getLocaleCookie(): Locale | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  const val = match?.[1];
  if (val && (locales as readonly string[]).includes(val)) return val as Locale;
  return null;
}

/** Write locale to cookie (client-side, 1 year, path=/) */
export function setLocaleCookie(locale: Locale): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_NAME}=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

/** Read locale from a cookie header string (server-side) */
export function getLocaleFromCookieHeader(cookieHeader: string | null): Locale {
  if (!cookieHeader) return defaultLocale;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  const val = match?.[1];
  if (val && (locales as readonly string[]).includes(val)) return val as Locale;
  return defaultLocale;
}
