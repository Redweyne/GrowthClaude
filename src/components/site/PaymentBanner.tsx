'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteTranslation } from '@/i18n/SiteTranslationProvider';

type PaymentState = 'success' | 'cancelled' | null;

export default function PaymentBanner() {
  const { t } = useSiteTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<PaymentState>(null);

  useEffect(() => {
    const payment = searchParams.get('payment');
    if (payment === 'success' || payment === 'cancelled') {
      setState(payment);
      // Strip the param so refresh/back doesn't re-trigger
      router.replace('/site', { scroll: false });
    }
  }, [searchParams, router]);

  if (!state) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={(e) => { if (e.target === e.currentTarget) setState(null); }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#1a1816] border border-amber-500/20 rounded-2xl p-6 max-w-sm w-full text-center"
        >
          {state === 'success' ? (
            <>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-amber-50 mb-2">
                {t('site.pricing.success.title')}
              </h3>
              <p className="text-sm text-amber-200/50 mb-5">
                {t('site.pricing.success.desc')}
              </p>
              <a
                href="/?signup=1"
                data-cta="free"
                className="block w-full py-2.5 rounded-xl font-semibold text-sm bg-amber-500 text-[#0a0908] hover:bg-amber-400 transition-colors mb-2"
              >
                {t('site.pricing.success.cta')}
              </a>
              <button
                onClick={() => setState(null)}
                className="w-full text-xs text-amber-200/40 hover:text-amber-200/60 py-2"
              >
                {t('site.pricing.success.later')}
              </button>
            </>
          ) : (
            <>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
                <span className="text-2xl">←</span>
              </div>
              <h3 className="text-lg font-semibold text-amber-50 mb-2">
                {t('site.pricing.cancelled.title')}
              </h3>
              <p className="text-sm text-amber-200/50 mb-5">
                {t('site.pricing.cancelled.desc')}
              </p>
              <button
                onClick={() => {
                  setState(null);
                  document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block w-full py-2.5 rounded-xl font-semibold text-sm bg-amber-500 text-[#0a0908] hover:bg-amber-400 transition-colors mb-2"
              >
                {t('site.pricing.cancelled.cta')}
              </button>
              <a
                href="/?signup=1"
                data-cta="free"
                className="block w-full text-xs text-amber-200/40 hover:text-amber-200/60 py-2"
              >
                {t('site.pricing.cancelled.free')}
              </a>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
