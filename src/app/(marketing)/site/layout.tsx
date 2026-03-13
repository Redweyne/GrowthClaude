import type { Metadata } from 'next';
import { SiteTranslationProvider } from '@/i18n/SiteTranslationProvider';

export const metadata: Metadata = {
  title: 'SolonsWay — Daily Self-Transformation',
  description: 'A guided self-transformation app. Daily lessons from Stoicism, modern philosophy, and more. Anonymous reflections. Visible proof of growth. 10 minutes a day.',
  keywords: ['self-improvement', 'stoicism', 'philosophy', 'daily practice', 'personal growth', 'transformation', 'anonymous community'],
  openGraph: {
    title: 'SolonsWay — Daily Self-Transformation',
    description: 'Turn wisdom into daily change. Join the open beta — free.',
    type: 'website',
    siteName: 'SolonsWay',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SolonsWay — Daily Self-Transformation',
    description: 'Turn wisdom into daily change. Join the open beta — free.',
  },
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SiteTranslationProvider>
      {children}
    </SiteTranslationProvider>
  );
}
