'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteTranslation } from '@/i18n/SiteTranslationProvider';

export default function StickyMobileCTA() {
  const { t } = useSiteTranslation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (approx viewport height)
      setShow(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 inset-x-0 z-50 md:hidden p-3 bg-[#0a0908]/90 backdrop-blur-xl border-t border-amber-500/10"
        >
          <a
            href="/?signup=1"
            data-cta="free"
            className="block w-full py-3 rounded-full text-center font-semibold text-sm text-[#0a0908] bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg shadow-amber-500/20"
          >
            {t('site.sticky.cta')}
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
