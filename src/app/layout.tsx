import type { Metadata, Viewport } from 'next';
import { fontBody } from '@/lib/fonts';
import { Providers } from './providers';
import './globals.css';

// ═══════════════════════════════════════════════════════════════════════════
// ROOT LAYOUT
// The foundation that wraps every page with our design system
// ═══════════════════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: 'Transformation Hub',
  description:
    'A daily, guided self-transformation journey that turns timeless human wisdom into small, repeatable actions that reshape identity over time.',
  keywords: [
    'self-improvement',
    'personal growth',
    'stoicism',
    'habits',
    'mindfulness',
    'philosophy',
    'wisdom',
    'transformation',
  ],
  authors: [{ name: 'Transformation Hub' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Transformation Hub',
  },
  openGraph: {
    title: 'Transformation Hub',
    description: 'A daily journey of self-transformation through timeless wisdom.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#050403', // Matches --depth-void for seamless feel
  colorScheme: 'dark light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased selection:bg-amber-500/30 selection:text-amber-50"
        style={fontBody.style}
      >
        {/* Subtle noise texture overlay for depth */}
        <div
          className="fixed inset-0 pointer-events-none z-50 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />

        {/* Main content */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
