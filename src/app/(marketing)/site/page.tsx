import { Suspense } from 'react';
import { getSiteTranslation } from '@/i18n/siteTranslation';
import SiteNav from '@/components/site/SiteNav';
import HeroSection from '@/components/site/HeroSection';
import ProofStrip from '@/components/site/ProofStrip';
import HowItWorks from '@/components/site/HowItWorks';
import ProductShowcase from '@/components/site/ProductShowcase';
import ThirtyDayArc from '@/components/site/ThirtyDayArc';
import WhyItSticks from '@/components/site/WhyItSticks';
import PricingSection from '@/components/site/PricingSection';
import FAQSection from '@/components/site/FAQSection';
import FinalCTA from '@/components/site/FinalCTA';
import StickyMobileCTA from '@/components/site/StickyMobileCTA';
import MarketingAnalytics from '@/components/site/MarketingAnalytics';
import PaymentBanner from '@/components/site/PaymentBanner';

export default async function SitePage() {
  const { t } = await getSiteTranslation();

  return (
    <main className="min-h-screen bg-[#0a0908] text-amber-50 overflow-x-hidden">
      <SiteNav />
      <HeroSection />
      <ProofStrip />
      <HowItWorks />
      <ProductShowcase />
      <ThirtyDayArc />
      <WhyItSticks />
      <PricingSection />
      <FAQSection />
      <FinalCTA />

      {/* Footer — server-rendered with correct locale */}
      <footer className="py-8 text-center text-xs text-amber-200/30 border-t border-amber-500/5">
        <p>{t('site.footer.copy')}</p>
      </footer>

      {/* Mobile sticky CTA */}
      <StickyMobileCTA />

      {/* Payment return flow (uses useSearchParams — needs Suspense) */}
      <Suspense>
        <PaymentBanner />
      </Suspense>

      {/* Lightweight analytics */}
      <MarketingAnalytics />
    </main>
  );
}
