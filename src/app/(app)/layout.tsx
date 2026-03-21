import { Providers } from '../providers';

// ═══════════════════════════════════════════════════════════════════════════
// APP LAYOUT — Wraps all app routes with providers + noise texture
// ═══════════════════════════════════════════════════════════════════════════

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      {children}
      {/* Subtle noise texture overlay for depth — rendered after children,
          z-[1] so it never blocks interaction during client-side navigation */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.015] light:opacity-[0.008]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />
    </Providers>
  );
}
