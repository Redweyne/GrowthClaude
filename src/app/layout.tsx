import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { fontBody } from '@/lib/fonts';
import { getLocaleFromCookieHeader } from '@/i18n/localeCookie';
import { languageConfig } from '@/i18n/config';
import './globals.css';

// ═══════════════════════════════════════════════════════════════════════════
// ROOT LAYOUT — Bare shell shared by (app) and (marketing) route groups
// Providers and noise overlay live in (app)/layout.tsx
// ═══════════════════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: 'SolonsWay — Daily Self-Transformation',
  description:
    'A guided self-transformation app. Daily lessons from Stoicism, modern philosophy, and more. Anonymous reflections. Visible proof of growth.',
  keywords: [
    'self-improvement',
    'personal growth',
    'croissance personnelle',
    'developpement personnel',
    'النمو الشخصي',
    'التطور الذاتي',
    'stoicism',
    'habits',
    'mindfulness',
    'philosophy',
    'wisdom',
    'transformation',
  ],
  authors: [{ name: 'SolonsWay' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SolonsWay',
    startupImage: [],
  },
  openGraph: {
    title: 'SolonsWay',
    description: 'Turn wisdom into daily change. Join the open beta — free.',
    type: 'website',
    siteName: 'SolonsWay',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafaf9' },
    { media: '(prefers-color-scheme: dark)', color: '#050403' },
  ],
  colorScheme: 'dark light',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const cookieHeader = headerStore.get('cookie');
  const locale = getLocaleFromCookieHeader(cookieHeader);
  const dir = languageConfig[locale].dir;

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />
      </head>
      <body
        className="antialiased selection:bg-amber-500/30 selection:text-amber-50"
        style={fontBody.style}
      >
        {children}
      </body>
    </html>
  );
}
