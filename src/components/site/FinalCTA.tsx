'use client';

import { motion } from 'framer-motion';
import { useSiteTranslation } from '@/i18n/SiteTranslationProvider';

export default function FinalCTA() {
  const { t } = useSiteTranslation();

  return (
    <section className="relative py-24 sm:py-32 bg-[#0a0908] overflow-hidden">
      {/* Background radials */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-radial from-amber-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-xl mx-auto px-5 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-50 leading-tight mb-4"
        >
          {t('site.final.headline')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-base text-amber-200/50 mb-8"
        >
          {t('site.final.subhead')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <a
            href="/?signup=1"
            data-cta="free"
            className="inline-block px-10 py-4 rounded-full font-semibold text-base text-[#0a0908] bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30"
          >
            {t('site.final.cta')}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
